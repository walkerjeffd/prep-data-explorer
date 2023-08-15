tar_option_set(packages = c("tidyverse", "lubridate", "sf", "janitor", "glue"))

targets_gis <- list(
  tar_target(gis_regions_file, "data/gis/GreatBayRegionsv4/GreatBayRegionsv4.shp", format = "file"),
  tar_target(gis_regions, {
    st_read(gis_regions_file) |> 
      mutate(
        name = case_when(
          name == "Gulf of Main (Ocean Region)" ~ "Gulf of Maine (Ocean Region)",
          TRUE ~ name
        )
      )
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
  tar_target(gis_nhd_wbdhu10, {
    x <- nhdplusTools::get_nhdplushr(dirname(gis_nhd_file), gis_nhd_file, layers = "WBDHU10")$WBDHU10 |>
      filter(
        str_starts(HUC10, "01060003"),
        !HUC10 %in% c("0106000301", "0106000302", "0106000303", "0106000311")
      ) |> 
      st_make_valid() |> 
      st_as_sf()
    x |> 
      st_intersection(st_transform(gis_basin, st_crs(x)))
  }),
  tar_target(gis_basin, {
    gis_nhd_wbdhu12 |> 
      st_union(is_coverage = TRUE) |> 
      st_as_sf() |> 
      transmute(name = "PREP Basin")
  }),
  tar_target(gis_basin_shp, {
    f <- "data/gis/prep-basin/prep-basin.shp"
    if (file.exists(f)) {
      unlink(f)
    }
    gis_basin |> 
      st_transform(4326) |> 
      write_sf(f)
    f
  }, format = "file"),
  tar_target(gis_towns_nh_file, "data/gis/towns/Base_Layers_for_New_Hampshire/Base_Layers_for_New_Hampshire.shp", format = "file"),
  tar_target(gis_towns_nh, {
    st_read(gis_towns_nh_file) |> 
      st_transform(4326) |> 
      st_filter(st_transform(gis_basin, 4326))
  }),
  tar_target(gis_towns_me_file, "data/gis/towns/Maine_Town_and_Townships_Boundary_Polygons_Feature/Maine_Town_and_Townships_Boundary_Polygons_Feature.shp", format = "file"),
  tar_target(gis_towns_me, {
    st_read(gis_towns_me_file) |> 
      filter(LAND == "y") |>
      st_make_valid() |>
      st_transform(4326) |> 
      st_filter(st_transform(gis_basin, 4326))
  }),
  tar_target(gis_towns_ma_file, "data/gis/towns/townssurvey_shp/TOWNSSURVEY_POLY.shp", format = "file"),
  tar_target(gis_towns_ma, {
    st_read(gis_towns_ma_file) |> 
      filter(COASTAL_PO == "NO") |> 
      st_make_valid() |>
      st_transform(4326) |> 
      st_filter(st_transform(gis_basin, 4326))
  }),
  tar_target(gis_towns, {
    bind_rows(
      NH = gis_towns_nh |> 
        select(name = pbpNAME),
      ME = gis_towns_me |> 
        select(name = TOWN),
      MA = gis_towns_ma |> 
        transmute(name = str_to_sentence(TOWN)),
      .id = "state"
    ) |> 
      st_intersection(st_transform(gis_basin, 4326))
  })
)