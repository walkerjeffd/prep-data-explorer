tar_option_set(packages = c("tidyverse", "lubridate", "sf", "janitor", "glue"))

targets_pwde <- list(
  tar_target(pwde_gis_regions, {
    filename <- "../public/gis/regions.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_regions |> 
      select(name) |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE, layer_options = c("COORDINATE_PRECISION=6", "ID_GENERATE=YES"))
    filename
  }, format = "file"),
  tar_target(pwde_gis_towns, {
    filename <- "../public/gis/towns.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_towns |> 
      select(name, state) |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE, layer_options = c("COORDINATE_PRECISION=6", "ID_GENERATE=YES"))
    filename
  }, format = "file"),
  tar_target(pwde_gis_basin, {
    filename <- "../public/gis/basin.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_basin |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE)
    filename
  }, format = "file"),
  tar_target(pwde_gis_huc10, {
    filename <- "../public/gis/huc10.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_nhd_wbdhu10 |> 
      select(HUC10, Name) |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE, layer_options = c("COORDINATE_PRECISION=6", "ID_GENERATE=YES"))
    filename
  }, format = "file"),
  tar_target(pwde_gis_huc12, {
    filename <- "../public/gis/huc12.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_nhd_wbdhu12 |> 
      select(HUC12, Name) |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE, layer_options = c("COORDINATE_PRECISION=6", "ID_GENERATE=YES"))
    filename
  }, format = "file"),
  tar_target(pwde_variables, {
    variables_inp |> 
      semi_join(results_stations, by = c("variabletypecv", "variablenamecv", "unitsid")) |> 
      arrange(variablenamecv) |>
      mutate(prep_variableid = row_number()) |> 
      select(prep_variableid, variabletypecv, variablenamecv, unitsid, unitsabbreviation)
  }),
  tar_target(pwde_variables_file, {
    filename <- "../public/api/prep_variables"
    pwde_variables |> 
      jsonlite::write_json(filename)
    filename
  }, format = "file"),
  tar_target(pwde_results, {
    results_variables |> 
      select(-unitsabbreviation) |> 
      inner_join(pwde_variables, by = c("variabletypecv", "variablenamecv", "unitsid")) |> 
      group_by(samplingfeatureid, prep_variableid) |>
      summarise(
        start = min(start),
        end = max(end),
        n_values = sum(n_values),
        .groups = "drop"
      ) |> 
      inner_join(select(db_stations, samplingfeatureid, samplingfeaturecode), by = c("samplingfeatureid")) |> 
      mutate(
        prep_resultid = row_number(),
        samplingfeaturecore = samplingfeaturecode %in% c(
          "GRBAP", "GRBCL", "GRBLR", "GRBCML", "GRBGB", "GRBGBE", "GRBGBW", "GRBOR",
          "GRBSF", "GRBSQ", "GRBULB", "GRBUPR", "HHHR", "02-GWR", "05-SFR", "07-CCH",
          "05-OYS", "05-LMP", "09-EXT", "05-BLM", "02-WNC"
        )
      ) |>
      select(prep_resultid, samplingfeatureid, samplingfeaturecore, prep_variableid, start, end, n_values)
  }),
  tar_target(pwde_results_file, {
    filename <- "../public/api/prep_results"
    pwde_results |> 
      jsonlite::write_json(filename)
    filename
  }, format = "file"),
  tar_target(pwde_stations, {
    stations_basin |> 
      semi_join(pwde_results, by = "samplingfeatureid") |>
      st_drop_geometry() |> 
      as_tibble() |> 
      select(
        samplingfeatureid,
        samplingfeaturecode,
        samplingfeaturename,
        samplingfeaturedescription,
        latitude,
        longitude
      )
  }),
  tar_target(pwde_stations_file, {
    filename <- "../public/api/prep_stations"
    pwde_stations |> 
      jsonlite::write_json(filename)
    filename
  }, format = "file")
)