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

list(
  targets_gis,
  targets_db,
  targets_variables,
  targets_stations,
  targets_results,
  targets_pwde
)
