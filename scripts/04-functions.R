get_latest_value = function(input){
  input %>%
    arrange(desc(date)) %>%
    slice(1) %>%
    pull(value)
}

get_latest_date = function(input){
  input %>%
    arrange(desc(date)) %>%
    slice(1) %>%
    pull(date) -> temp
  paste(lubridate::month(temp, label = TRUE),
        lubridate::day(temp),
        lubridate::year(temp))
}

dy_graph <- function(indicator, series_name, y_unit, line_color = "blue", shade_recessions){
  if(y_unit == "percent"){
    c <- indicator %>%
      select(value) %>%
      rename_with(~series_name, value) %>%
      xts(., order.by = as.Date(indicator$date)) %>% 
      dygraph() %>%
      dySeries(color = line_color) %>%
      dyAxis("y", label = series_name,
             valueFormatter = "function(v){return (v) + '%'}",
             axisLabelFormatter = "function(v){return (v) + '%'}"
      ) %>%
      dyOptions(strokeWidth = 3) %>%
      dyRangeSelector()
  } else if(y_unit == "dollar"){
    c <- indicator %>%
      select(value) %>%
      rename_with(~series_name, value) %>%
      xts(., order.by = as.Date(indicator$date)) %>% 
      dygraph() %>%
      dySeries(color = line_color) %>%
      dyAxis("y", label = series_name,
             valueFormatter = "function(v){return '$' + (v)}",
             axisLabelFormatter = "function(v){return '$' + (v)}"
      ) %>%
      dyOptions(strokeWidth = 3) %>%
      dyRangeSelector()
  } else {
    c <- indicator %>%
      select(value) %>%
      rename_with(~series_name, value) %>%
      xts(., order.by = as.Date(indicator$date)) %>% 
      dygraph() %>%
      dySeries(color = line_color) %>%
      dyAxis("y", label = series_name) %>%
      dyOptions(strokeWidth = 3) %>%
      dyRangeSelector()
  }
  
  # shade recessions?
  
  if(shade_recessions == TRUE){
    return(c %>%
             dyShading(from = "1969-04-01", to = "1971-01-01", color = "#e5e5e5") %>%
             dyShading(from = "1973-10-01", to = "1975-04-01", color = "#e5e5e5") %>%
             dyShading(from = "1979-04-01", to = "1980-07-01", color = "#e5e5e5") %>%
             dyShading(from = "1981-04-01", to = "1982-07-01", color = "#e5e5e5") %>%
             dyShading(from = "1989-10-01", to = "1991-04-01", color = "#e5e5e5") %>%
             dyShading(from = "2001-01-01", to = "2001-10-01", color = "#e5e5e5") %>%
             dyShading(from = "2007-10-01", to = "2009-07-01", color = "#e5e5e5") %>%
             dyShading(from = "2020-01-01", to = "2020-07-01", color = "#e5e5e5") 
    )
  } else {
    return(c)
  }
}