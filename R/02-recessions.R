# Create Recession Shaded Areas on Time Series Graphs

recessions <-fredr(
  series_id = "JHDUSRGDPBR"
)

recessions_start_end <- recessions %>% # from https://datavizm20.classes.andrewheiss.com/example/11-example/
  mutate(recession_change = value - lag(value)) %>% 
  filter(recession_change != 0)

recs <- tibble(start = filter(recessions_start_end, recession_change == 1)$date,
               end = filter(recessions_start_end, recession_change == -1)$date)
