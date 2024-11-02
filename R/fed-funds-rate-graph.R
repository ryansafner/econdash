plot_ffr <-ggplot(data = ffr)+
  aes(x = date,
      y = value,
      color = series_id)+
  geom_rect(data = recs, 
            aes(xmin = start, xmax = end, ymin = -Inf, ymax = Inf),
            inherit.aes = FALSE, fill = "black", alpha = 0.3)+
  geom_path(size=1)+
  geom_hline(yintercept=0, size=1)+
  scale_x_date(limits=as.Date(c("1955-01-01", "2022-07-01")),
               date_breaks = "5 years",
               #minor_breaks = "2 years",
               date_labels = "%Y",
               expand = c(0,0))+
  scale_y_continuous(breaks=seq(0,20,2),
                     labels=function(x){paste0(x,"%")},
                     limits = c(0,20),
                     expand = c(0,0))+
  labs(x = "Year",
       y = "Federal Funds Rate",
       caption = "Data Source: FRED; Recessions Shaded in Gray")+
  theme_classic(base_family = "Fira Sans Condensed", base_size = 16)+
  theme(legend.position="none")

plot_ffr # %>% plotly::ggplotly()
