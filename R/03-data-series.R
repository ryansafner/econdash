# Import series

# Federal Funds Rate

ffr <- fredr(
  series_id = "FEDFUNDS"
)

#  US Regular All Formulations Gas Price
gas <- fredr(
  series_id = "GASREGW"
)

#  University of Michigan: Consumer Sentiment
## 1966Q1 = 100 Index

conssent <- fredr(
  series_id = "UMCSENT"
)

#  Crude Oil Prices: West Texas Intermediate (WTI) - Cushing, Oklahoma; Dollars per Barrel
oil <- fredr(
  series_id = "DCOILWTICO"
)

# Percent, Not Seasonally Adjusted;  Weekly, Ending Thursday 
mortgage <- fredr(
  series_id = "MORTGAGE30US"
)

# Consumer Price Index for All Urban Consumers: All Items in U.S. City Average 
# Index 1982-1984=100, Seasonally Adjusted 
# pc1 = percent change from 1 year ago, see https://cran.r-project.org/web/packages/fredr/fredr.pdf
cpi <- fredr(
  series_id = "CPIAUCSL", units = "pc1"
)

# GDP
# Billions of Dollars, Seasonally Adjusted Annual Rate; Quarterly
gdp <- fredr(
  series_id = "GDP"
)

# Real GDP
# Billions of Chained 2012 Dollars, Seasonally Adjusted Annual Rate; Quarterly
rgdp <- fredr(
  series_id = "GDPC1"
)

# Real GDP per Capita
# Chained 2012 Dollars, Seasonally Adjusted Annual Rate; Quarterly
rgdp_pc <- fredr(
  series_id = "A939RX0Q048SBEA"
)

# Real GDP growth rate
# Percent Change, Billions of Chained 2012 Dollars, Seasonally Adjusted Annual Rate
rgdp_growth <- fredr(
  series_id = "GDPC1", units = "pc1"
)

# Labor Markets ------


# Unemployment rate
#  Percent, Seasonally Adjusted 
ur <- fredr(
  series_id = "UNRATE"
)

# Labor force participation rate
# percent, seasonally adjusted

lfpr <- fredr(
  series_id = "CIVPART"
)

# Labor force participation rate, male
# percent, seasonally adjusted

lfpr_m <- fredr(
  series_id = "LNS11300001"
)

# Labor force participation rate, female
# percent, seasonally adjusted

lfpr_f <- fredr(
  series_id = "LNS11300002"
)

# Federal Budget ------

# Federal government budget surplus or deficit
# Quarterly, Billions of Dollars, Not Seasonally Adjusted
# source: Bureau of Economic Analysis, http://www.bea.gov/
budget_deficit <- fredr(
  series_id = "M318501Q027NBEA"
)

# Federal Surplus or Deficit as Percent of Gross Domestic Product
# Annual, Percent of GDP, Not Seasonally Adjusted 
# source: Office of Management and Budget, https://www.whitehouse.gov/omb/

budget_gdp <- fredr(
  series_id = "FYFSGDA188S"
)

# Federal Debt: Total Public Debt as Percent of Gross Domestic Product 
# Quarterly, Percent of GDP, Seasonally Adjusted 
# Source: Office of Management and Budget, https://www.whitehouse.gov/omb/
total_public_debt_pc_gdp <- fredr(
  series_id = "GFDEGDQ188S"
)

# Gross Federal Debt as Percent of Gross Domestic Product
# Quarterly, Percent of GDP, Seasonally Adjusted 
# Source: Office of Management and Budget, https://www.whitehouse.gov/omb/
gross_public_debt_pc_gdp <- fredr(
  series_id = "GFDGDPA188S"
)

# Federal Net Outlays as Percent of Gross Domestic Product
# Annual, Percent of GDP, Seasonally Adjusted 
# Source: Office of Management and Budget, https://www.whitehouse.gov/omb/
net_govt_spending_pc_gdp <- fredr(
  series_id = "FYONGDA188S"
)

# Federal government expenditures: Budget outlays
# Quarterly, Billions of Dollars, Not Seasonally Adjusted
# Source: Bureau of Economic Analysis, http://www.bea.gov/ 
federal_spending <- fredr(
  series_id = "M318191Q027NBEA"
)

# Federal Outlays: Interest
# Annual (Fiscal year), Millions of Dollars, Not Seasonally Adjusted
# Source: Office of Management and Budget, https://www.whitehouse.gov/omb/
total_fed_interest <- fredr(
  series_id = "FYOINT"
)

# Federal Outlays: Interest as Percentage of Gross Domestic Product
# Annual (Fiscal year), Percent of GDP, Not Seasonally Adjusted
# Source: Office of Management and Budget, https://www.whitehouse.gov/omb/
total_fed_interest_pc_gdp <- fredr(
  series_id = "FYOIGDA188S"
)

# Government Bond Yields

# Market Yield on U.S. Treasury Securities at 3-Month Constant Maturity, Quoted on an Investment Basis (DGS3MO) 
treas_1mo <- fredr(
  series_id = "DGS1MO"
)


# Market Yield on U.S. Treasury Securities at 3-Month Constant Maturity, Quoted on an Investment Basis (DGS3MO) 
treas_3mo <- fredr(
  series_id = "DGS3MO"
)

# Market Yield on U.S. Treasury Securities at 6-Month Constant Maturity, Quoted on an Investment Basis (DGS3MO) 
treas_6mo <- fredr(
  series_id = "DGS6MO"
)


#  Market Yield on U.S. Treasury Securities at 1-Year Constant Maturity, Quoted on an Investment Basis (DGS2)
treas_1yr <- fredr(
  series_id = "DGS1"
)

#  Market Yield on U.S. Treasury Securities at 2-Year Constant Maturity, Quoted on an Investment Basis (DGS2)
treas_2yr <- fredr(
  series_id = "DGS2"
)

#  Market Yield on U.S. Treasury Securities at 5-Year Constant Maturity, Quoted on an Investment Basis (DGS2)
treas_5yr <- fredr(
  series_id = "DGS5"
)

#  Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis (DGS10)
treas_10yr <- fredr(
  series_id = "DGS10"
)

#  Market Yield on U.S. Treasury Securities at 20-Year Constant Maturity, Quoted on an Investment Basis (DGS10)
treas_20yr <- fredr(
  series_id = "DGS20"
)

#  Market Yield on U.S. Treasury Securities at 30-Year Constant Maturity, Quoted on an Investment Basis (DGS10)
treas_30yr <- fredr(
  series_id = "DGS30"
)
