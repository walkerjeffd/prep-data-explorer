tar_option_set(packages = c("tidyverse", "lubridate", "sf", "janitor", "glue"))

db_connect <- function () {
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

targets_db <- list(
  tar_target(db_stations, {
    con <- db_connect()
    sql <- "
      select s.samplingfeatureid,
        samplingfeaturecode,
        samplingfeaturename,
        samplingfeaturedescription,
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
  tar_target(db_results, {
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
          filter(qualitycodecv != "Bad", datavalue != "NaN") |> 
          group_by(resultid) |> 
          summarise(
            start = min(valuedatetime, na.rm = TRUE),
            end = max(valuedatetime, na.rm = TRUE),
            n_values = n()
          ),
        by = "resultid"
      ) |> 
      mutate(n_values = coalesce(n_values, 0)) |> 
      # filter(
      #   samplingfeatureid %in% local(stations_basin$samplingfeatureid),
      #   variabletypecv == "Water quality"
      # ) |>
      select(resultid, samplingfeatureid, variabletypecv, variableid, variablenamecv, unitsid, unitsabbreviation, start, end, n_values) |> 
      collect()
    DBI::dbDisconnect(con)
    x
  })
)