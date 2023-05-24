targets_results <- list(
  tar_target(results_stations, {
    db_results |> 
      filter(
        samplingfeatureid %in% stations_basin$samplingfeatureid,
        n_values > 0
      )
  }),
  tar_target(results_variables_tally, {
    results_stations |> 
      group_by(variabletypecv, variablenamecv, unitsid, unitsabbreviation) |> 
      summarise(n_values = sum(n_values), .groups = "drop") |> 
      arrange(desc(n_values))
  }),
  tar_target(results_variables_tally_exclude, {
    results_variables_tally |> 
      anti_join(variables_inp, by = c("variabletypecv", "variablenamecv", "unitsid"))
  }),
  tar_target(results_variables_tally_include, {
    results_variables_tally |> 
      semi_join(variables_inp, by = c("variabletypecv", "variablenamecv", "unitsid"))
  }),
  tar_target(results_variables, {
    results_stations |> 
      semi_join(variables_inp, by = c("variabletypecv", "variablenamecv", "unitsid"))
  })
)