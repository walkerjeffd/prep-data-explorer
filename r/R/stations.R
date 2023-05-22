targets_stations <- list(
  tar_target(stations_basin, {
    st_filter(
      db_stations,
      st_transform(gis_basin, crs = st_crs(db_stations))
    )
  })
)