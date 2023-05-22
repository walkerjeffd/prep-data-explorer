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
  tar_target(pwde_gis_basin, {
    filename <- "../public/gis/basin.geojson"
    if (file.exists(filename)) {
      unlink(filename)
    }
    gis_basin |> 
      write_sf(filename, driver = "GeoJSON", delete_layer = TRUE)
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
      semi_join(results_stations, by = c("variablenamecv", "unitsid")) |> 
      arrange(variablenamecv) |>
      mutate(variableid_prep = row_number()) |> 
      select(variableid_prep, variablenamecv, unitsid, unitsabbreviation)
  }),
  tar_target(pwde_variables_file, {
    filename <- "../public/api/variables"
    pwde_variables |> 
      jsonlite::write_json(filename)
    filename
  }, format = "file"),
  tar_target(pwde_results, {
    results_variables |> 
      select(-unitsabbreviation) |> 
      inner_join(pwde_variables, by = c("variablenamecv", "unitsid")) |> 
      group_by(samplingfeatureid, variableid_prep) |>
      summarise(
        start = min(start),
        end = max(end),
        n_values = sum(n_values),
        .groups = "drop"
      ) |> 
      mutate(resultid_prep = row_number()) |>
      select(resultid_prep, samplingfeatureid, variableid_prep, start, end, n_values)
  }),
  tar_target(pwde_results_file, {
    filename <- "../public/api/results"
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
    filename <- "../public/api/stations"
    pwde_stations |> 
      jsonlite::write_json(filename)
    filename
  }, format = "file")
)