library(targets)

invisible(sapply(list.files("R", recursive = TRUE, pattern = ".R$", full.names = TRUE), source))

options(tidyverse.quiet = TRUE)
tar_option_set(packages = c(
  "tidyverse",
  "lubridate",
  "sf",
  "janitor",
  "glue"
))

# load packages into session
if (interactive()) {
  sapply(tar_option_get("packages"), require, character.only = TRUE)
}

db_connect <- function () {
  # database must be running locally
  # TODO: move db creds to .env
  dotenv::load_dot_env()
  con <- DBI::dbConnect(
    RPostgres::Postgres(),
    host = Sys.getenv("PREP_DB_HOST"),
    port = Sys.getenv("PREP_DB_PORT"),
    user = Sys.getenv("PREP_DB_USERNAME"),
    password = Sys.getenv("PREP_DB_PASSWORD"),
    dbname = Sys.getenv("PREP_DB_DBNAME")
  )
  rs <- DBI::dbSendQuery(con, "SET search_path = odm2, public")
  DBI::dbClearResult(rs)
  con
}

list(
  tar_target(gis_nhd_file, {
    download_dir <- nhdplusTools::download_nhdplushr("data/nhd", c("0106"))
    file.path(download_dir, list.files(download_dir, pattern = "*.gdb"))
  }, format = "file"),
  tar_target(gis_nhd_wbdhu12, {
    nhdplusTools::get_nhdplushr(dirname(gis_nhd_file), gis_nhd_file, layers = "WBDHU12")$WBDHU12 |>
      filter(
        str_starts(HUC12, "01060003"),
        HUC12 != "010600031004",
        !str_sub(HUC12, 1, 10) %in% c("0106000301", "0106000302", "0106000303", "0106000311")
      ) |> 
      st_as_sf()
  }),
  tar_target(gis_basin, {
    gis_nhd_wbdhu12 |> 
      st_union(is_coverage = TRUE) |> 
      st_as_sf() |> 
      transmute(name = "PREP Basin")
  }),
  tar_target(db_stations_all, {
    con <- db_connect()
    sql <- "
      select s.samplingfeatureid,
        samplingfeaturecode,
        samplingfeaturename,
        samplingfeaturedescription,
        sitetypecv,
        st_x(featuregeometry) as longitude,
        st_y(featuregeometry) as latitude,
        featuregeometry as geometry
      from samplingfeatures s
      left join sites on s.samplingfeatureid = sites.samplingfeatureid;
    "
    x <- DBI::dbGetQuery(con, sql) |>
      mutate(geometry = st_as_sfc(geometry, crs = 4326)) |>
      st_as_sf()
    DBI::dbDisconnect(con)
    x
  }),
  tar_target(db_stations, {
    st_filter(
      db_stations_all,
      st_transform(gis_basin, crs = st_crs(db_stations_all))
    )
  }),
  tar_target(db_results_all, {
    # filters:
    #   - stations within basin
    #   - variabletypecv = 'Water quality'
    con <- db_connect()
    x <- tbl(con, "results") |> 
      left_join(tbl(con, "featureactions"), by = "featureactionid") |> 
      left_join(tbl(con, "samplingfeatures"), by = "samplingfeatureid") |> 
      left_join(tbl(con, "variables"), by = "variableid") |> 
      left_join(tbl(con, "units"), by = "unitsid") |> 
      left_join(
        tbl(con, "timeseriesresultvalues") |>
          group_by(resultid) |> 
          summarise(
            start = min(valuedatetime, na.rm = TRUE),
            end = max(valuedatetime, na.rm = TRUE),
            n_values = n()
          ),
        by = "resultid"
      ) |> 
      mutate(n_values = coalesce(n_values, 0)) |> 
      filter(
        samplingfeatureid %in% local(db_stations$samplingfeatureid),
        variabletypecv == "Water quality"
      ) |> 
      select(resultid, samplingfeatureid, variableid, variablenamecv, unitsid, unitsabbreviation, start, end, n_values) |> 
      collect()
    DBI::dbDisconnect(con)
    x
  }),
  tar_target(pwde_variables, {
    # most common units for each variable
    # variables with at least 1000 values
    db_results_all |> 
      filter(n_values > 0) |> 
      group_by(variablenamecv, unitsid, unitsabbreviation) |> 
      summarise(n_results = n(), n_values = sum(n_values), .groups = "drop") |> 
      group_by(variablenamecv) |> 
      arrange(variablenamecv, desc(n_values)) |> 
      slice(1) |> 
      ungroup() |> 
      filter(n_values > 1000) |> 
      arrange(variablenamecv) |>
      mutate(variableid_prep = row_number()) |> 
      select(variableid_prep, variablenamecv, unitsid, unitsabbreviation)
  }),
  tar_target(pwde_variables_file, {
    filename <- "../src/mirage/fixtures/variables.json"
    pwde_variables |> 
      jsonlite::write_json(filename)
    file.copy(filename, "../public/data/variables", overwrite = TRUE)
    filename
  }, format = "file"),
  tar_target(pwde_results, {
    db_results_all |> 
      filter(n_values > 0) |> 
      inner_join(pwde_variables, by = c("variablenamecv", "unitsid")) |> 
      group_by(samplingfeatureid, variableid_prep) |> 
      summarise(
        start = min(start),
        end = max(end),
        n_values = sum(n_values),
        .groups = "drop"
      ) |> 
      filter(n_values >= 100) |> 
      mutate(resultid_prep = row_number()) |> 
      select(resultid_prep, samplingfeatureid, variableid_prep, start, end, n_values)
  }),
  tar_target(pwde_results_file, {
    filename <- "../src/mirage/fixtures/results.json"
    pwde_results |> 
      jsonlite::write_json(filename)
    file.copy(filename, "../public/data/results", overwrite = TRUE)
    filename
  }, format = "file"),
  tar_target(pwde_stations, {
    db_stations |> 
      filter(samplingfeatureid %in% pwde_results$samplingfeatureid) |>
      st_drop_geometry() |> 
      as_tibble() |> 
      select(
        samplingfeatureid,
        samplingfeaturecode,
        samplingfeaturename,
        samplingfeaturedescription,
        sitetypecv,
        latitude,
        longitude
      )
  }),
  tar_target(pwde_stations_file, {
    filename <- "../src/mirage/fixtures/stations.json"
    pwde_stations |> 
      jsonlite::write_json(filename)
    file.copy(filename, "../public/data/stations", overwrite = TRUE)
    filename
  }, format = "file")
)
