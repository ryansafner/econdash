library(Quandl)
Quandl.api_key("eeyHdZS9oAkytWs-F21X")
yc <- Quandl("USTREASURY/YIELD")
yield_curve_data <- yc %>% 
  rename("1 month" = `1 MO`,
         "2 months" = `2 MO`,
         "3 months" = `3 MO`,
         "6 months" = `6 MO`,
         "1 Year" = `1 YR`,
         "2 Years" = `2 YR`,
         "3 Years" = `3 YR`,
         "5 Years" = `5 YR`,
         "7 Years" = `7 YR`,
         "10 Years" = `10 YR`,
         "20 Years" = `20 YR`,
         "30 Years" = `30 YR`) %>%
  slice(1) %>%
  pivot_longer(cols = 2:13, names_to = "maturity") %>%
  mutate(maturity = ordered(maturity,
                            levels = c("1 month", "2 months", "3 months", "6 months", "1 Year", "2 Years", "3 Years", "5 Years", "7 Years", "10 Years", "20 Years", "30 Years")
  )) 

yield_curve <- yield_curve_data %>%
  ggplot()+
  aes(x = maturity,
      y = value)+
  geom_point(color = "red")+
  geom_path(aes(x = as.numeric(maturity), y = value), color = "red", size = 2)+
  #annotate(x = 10, y = 4.5, geom = "text", label = "As of April 6, 2023", color = "red")+
  labs(x = "Maturity",
       y = "Yield",
       title = "U.S. Treasury Yield Curve",
       caption = paste0("As of ",yc$Date[1]))+
  scale_y_continuous(breaks = seq(0,10,0.5),
                     labels = scales::label_percent(scale = 1))+
  theme_bw(base_family = "Fira Sans Condensed", base_size = 14)+
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))

yc_df <- yc %>% 
  rename("1" = `1 MO`,
         "2" = `2 MO`,
         "3" = `3 MO`,
         "6" = `6 MO`,
         "12" = `1 YR`,
         "24" = `2 YR`,
         "36" = `3 YR`,
         "60" = `5 YR`,
         "84" = `7 YR`,
         "120" = `10 YR`,
         "240" = `20 YR`,
         "360" = `30 YR`) %>%
  slice(1) %>%
  pivot_longer(cols = 2:13, names_to = "maturity") %>%
  mutate(maturity = as.numeric(maturity))

yc_slope <- yc_df %>%
  lm(value ~ maturity, data = .) %>%
  broom::tidy() %>%
  filter(term == "maturity") %>%
  pull(estimate)

yc_status <- ifelse(yc_slope > 0, "Normal", "Inverted")