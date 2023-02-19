#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#


library(shiny)
library(tidyverse)
library(fredr)
fredr_set_key("9100cdf3c862283007d8c83ce02059e6")

recessions <-fredr(
    series_id = "JHDUSRGDPBR"
)

recessions_start_end <- recessions %>% # from https://datavizm20.classes.andrewheiss.com/example/11-example/
    mutate(recession_change = value - lag(value)) %>% 
    filter(recession_change != 0)

recs <- tibble(start = filter(recessions_start_end, recession_change == 1)$date,
               end = filter(recessions_start_end, recession_change == -1)$date)


plot_ffr <-ggplot(data = ffr)+
    aes(x = date,
        y = value,
        color = series_id)+
    geom_rect(data = recs, 
              aes(xmin = start, xmax = end, ymin = -Inf, ymax = Inf),
              inherit.aes = FALSE, fill = "black", alpha = 0.3)+
    geom_path(size=1)+
    geom_hline(yintercept=0, size=1)+
    scale_x_date(limits=as.Date(c("1955-01-01", "2022-05-01")),
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

# Define UI for application that draws a histogram
ui <- fluidPage(

    # Application title
    titlePanel("Old Faithful Geyser Data"),

    # Sidebar with a slider input for number of bins 
    sidebarLayout(
        sidebarPanel(
            sliderInput("bins",
                        "Number of bins:",
                        min = 1,
                        max = 50,
                        value = 30)
        ),

        # Show a plot of the generated distribution
        mainPanel(
           plotOutput("distPlot")
        )
    )
)

# Define server logic required to draw a histogram
server <- function(input, output) {

    output$distPlot <- renderPlot({
        # generate bins based on input$bins from ui.R
        x    <- faithful[, 2]
        bins <- seq(min(x), max(x), length.out = input$bins + 1)

        # draw the histogram with the specified number of bins
        hist(x, breaks = bins, col = 'darkgray', border = 'white')
    })
}

# Run the application 
shinyApp(ui = ui, server = server)
