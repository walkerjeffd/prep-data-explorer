targets_variables <- list(
  tar_target(variables_inp_file, "data/variables.csv", format = "file"),
  tar_target(variables_inp, {
    # read_csv(variables_inp_file, show_col_types = FALSE) |> 
    #   mutate(
    #     unitsabbreviation = if_else(unitsabbreviation == "(blank)", "", unitsabbreviation)
    #   )
    
    # tally values by name, units (wq only)
    x <- results_stations |> 
      filter(variabletypecv == "Water quality") |> 
      group_by(variablenamecv, unitsid, unitsabbreviation) |> 
      summarise(n_values = sum(n_values), .groups = "drop") |> 
      filter(n_values > 0)

    # filter for most common units
    y <- x |> 
      arrange(variablenamecv, desc(n_values)) |> 
      group_by(variablenamecv) |> 
      slice(1) |> 
      ungroup()
    
    y |> 
      transmute(variablenamecv, unitsid, unitsabbreviation)
  })
)