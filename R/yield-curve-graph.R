#library(Quandl)
#Quandl.api_key("eeyHdZS9oAkytWs-F21X")
#yc <- Quandl("USTREASURY/YIELD")

yc <- treas_1mo %>% rbind(
  treas_3mo,
  treas_6mo,
  treas_1yr,
  treas_2yr,
  treas_5yr,
  treas_10yr,
  treas_20yr
) %>%
  mutate(maturity = case_when(
    series_id == "DGS1MO" ~ "1 month",
    series_id == "DGS3MO" ~ "3 months",
    series_id == "DGS6MO" ~ "6 months",
    series_id == "DGS1" ~ "1 Year",
    series_id == "DGS2" ~ "2 Years",
    series_id == "DGS5" ~ "5 Years",
    series_id == "DGS10" ~ "10 Years",
    series_id == "DGS20" ~ "20 Years",
    series_id == "DGS30" ~ "30 Years"
  ),
  maturity = ordered(maturity,
                     levels = c("1 month", "2 months", "3 months", "6 months", "1 Year", "2 Years", "5 Years", "10 Years", "20 Years", "30 Years")
                     )
  ) 

yield_curve <- yc %>%
  filter(date == max(date)) %>%
  ggplot()+
  aes(x = maturity,
      y = value)+
  geom_path(aes(x = as.numeric(maturity), y = value), color = "red", size = 2)+
  #geom_smooth(aes(x = as.numeric(maturity), y = value), method = "lm")+
  labs(x = "Date",
       y = "Yield",
       title = "U.S. Treasury Yield Curve",
       caption = paste0("As of ", format(max(yc$date), "%B %d, %Y"))
       )+
  scale_x_continuous(breaks = seq(1,10,1),
                     labels = yc$maturity %>% levels())+
  scale_y_continuous(breaks = seq(0,10,0.5),
                     limits = c(3,6),
                     expand = c(0,0),
                     labels = scales::label_percent(scale = 1))+
  theme_bw(base_family = "Fira Sans Condensed", base_size = 14)+
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))

yc_df <- yc %>% 
  filter(date == max(date)) %>%
  mutate(maturity = case_when(
    maturity == "1 month" ~ 1,
    maturity == "3 months" ~ 3,
    maturity == "6 months" ~ 6,
    maturity == "1 Year" ~ 12,
    maturity == "2 Years" ~ 24,
    maturity == "5 Years" ~ 60,
    maturity == "10 Years" ~ 120,
    maturity == "20 Years" ~ 240,
    maturity == "30 Years" ~ 360
  ))

yc_slope <- yc_df %>%
  lm(value ~ maturity, data = .) %>%
  broom::tidy() %>%
  filter(term == "maturity") %>%
  pull(estimate)

yc_status <- ifelse(yc_slope > 0, "Normal", "Inverted")