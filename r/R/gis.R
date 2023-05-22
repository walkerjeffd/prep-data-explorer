tar_option_set(packages = c("tidyverse", "lubridate", "sf", "janitor", "glue"))

targets_gis <- list(
  tar_target(gis_regions_file, "/Users/jeff/Dropbox/Work/prep/gis/GreatBayRegionsv4/GreatBayRegionsv4.shp", format = "file"),
  tar_target(gis_regions, {
    st_read(gis_regions_file)
  }),
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
  })
)