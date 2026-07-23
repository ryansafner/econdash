// ========== Series Configuration ==========
// Each series: { id, name, unit, format, fredId, source, category, changeType, invert? }
// changeType: 'diff' (absolute), 'pct' (percent change), 'level' (show level only), 'bps' (basis points)
// source: 'fred' | 'yahoo' | 'coingecko'

const FRED_BASE = '/fred';

const SERIES = {
  // ===== Overview (cherry-picked from other categories) =====
  overview: [
    'GDP_GROWTH', 'UNRATE', 'CPI_YOY', 'PCE_CORE_YOY', 'FEDFUNDS', 'SP500',
    'MORTGAGE30', 'GAS_PRICE', 'CONSUMER_SENT', 'INITIAL_CLAIMS'
  ],

  // ===== GDP & Growth =====
  gdp: {
    label: 'GDP & Growth',
    series: {
      GDP: {
        fredId: 'GDP', name: 'Real GDP', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 1
      },
      GDP_GROWTH: {
        fredId: 'A191RL1Q225SBEA', name: 'Real GDP Growth Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      INDPRO: {
        fredId: 'INDPRO', name: 'Industrial Production Index', unit: 'Index 2017=100', format: 'number',
        changeType: 'pct', decimals: 1
      },
      TCU: {
        fredId: 'TCU', name: 'Capacity Utilization', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      LEI: {
        fredId: 'USSLIND', name: 'Leading Economic Index', unit: 'Index 2016=100', format: 'number',
        changeType: 'pct', decimals: 1
      },
      REAL_DISP_INCOME: {
        fredId: 'DSPIC96', name: 'Real Disposable Personal Income', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 1
      }
    }
  },

  // ===== Labor Markets =====
  labor: {
    label: 'Labor Markets',
    series: {
      UNRATE: {
        fredId: 'UNRATE', name: 'Unemployment Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      PAYEMS: {
        fredId: 'PAYEMS', name: 'Nonfarm Payrolls', unit: 'Thousands', format: 'number',
        changeType: 'diff', decimals: 0, diffLabel: 'change'
      },
      CIVPART: {
        fredId: 'CIVPART', name: 'Labor Force Participation Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      JOLTS_OPENINGS: {
        fredId: 'JTSJOL', name: 'Job Openings (JOLTS)', unit: 'Thousands', format: 'number',
        changeType: 'pct', decimals: 0
      },
      JOLTS_QUITS: {
        fredId: 'JTSQUR', name: 'Quits Rate (JOLTS)', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      INITIAL_CLAIMS: {
        fredId: 'ICSA', name: 'Initial Jobless Claims', unit: 'Thousands', format: 'number',
        changeType: 'diff', decimals: 0, invert: true
      },
      CONTINUED_CLAIMS: {
        fredId: 'CCSA', name: 'Continued Claims', unit: 'Thousands', format: 'number',
        changeType: 'diff', decimals: 0, invert: true
      },
      AVG_HOURLY_EARN: {
        fredId: 'CES0500000003', name: 'Avg Hourly Earnings', unit: '$', format: 'dollar',
        changeType: 'pct', decimals: 2
      }
    }
  },

  // ===== Prices & Inflation =====
  prices: {
    label: 'Prices & Inflation',
    series: {
      CPI_YOY: {
        fredId: 'CPIAUCSL', name: 'CPI (All Items)', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1, yoyDisplay: true
      },
      CPI_CORE_YOY: {
        fredId: 'CPILFESL', name: 'Core CPI (ex Food & Energy)', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1, yoyDisplay: true
      },
      PCE_YOY: {
        fredId: 'PCEPI', name: 'PCE Price Index', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1, yoyDisplay: true
      },
      PCE_CORE_YOY: {
        fredId: 'PCEPILFE', name: 'Core PCE Price Index', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1, yoyDisplay: true
      },
      PPI: {
        fredId: 'PPIACO', name: 'PPI (All Commodities)', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1
      },
      GAS_PRICE: {
        fredId: 'GASREGW', name: 'Regular Gas Price', unit: '$/gallon', format: 'dollar',
        changeType: 'pct', decimals: 2
      },
      GOLD: {
        fredId: 'GOLDAMGBD228NLBM', name: 'Gold Price', unit: '$/oz', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      SP500: {
        fredId: 'SP500', name: 'S&P 500', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 0
      },
      BTC: {
        fredId: 'CBBTCUSD', name: 'Bitcoin (USD)', unit: '$', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      BREAKEVEN_5Y: {
        fredId: 'T5YIE', name: '5-Year Breakeven Inflation', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      }
    }
  },

  // ===== Housing =====
  housing: {
    label: 'Housing',
    series: {
      CASE_SHILLER: {
        fredId: 'CSUSHPINSA', name: 'Case-Shiller Home Price Index', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1
      },
      MEDIAN_HOME_PRICE: {
        fredId: 'MSPUS', name: 'Median Home Sale Price', unit: '$', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      HOUSING_STARTS: {
        fredId: 'HOUST', name: 'Housing Starts', unit: 'Thousands', format: 'number',
        changeType: 'pct', decimals: 0
      },
      EXISTING_HOME_SALES: {
        fredId: 'EXHOSLUSM495S', name: 'Existing Home Sales', unit: 'Millions', format: 'number',
        changeType: 'pct', decimals: 2
      },
      NEW_HOME_SALES: {
        fredId: 'HSN1F', name: 'New Home Sales', unit: 'Thousands', format: 'number',
        changeType: 'pct', decimals: 0
      },
      MORTGAGE30: {
        fredId: 'MORTGAGE30US', name: '30-Year Mortgage Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      },
      PRICE_TO_INCOME: {
        fredId: 'FIXHAI', name: 'Housing Affordability Index', unit: 'Index', format: 'number',
        changeType: 'diff', decimals: 1
      },
      HOMEOWNERSHIP: {
        fredId: 'RHORUSQ156N', name: 'Homeownership Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      }
    }
  },

  // ===== Consumer & Sentiment =====
  consumer: {
    label: 'Consumer & Sentiment',
    series: {
      CONSUMER_SENT: {
        fredId: 'UMCSENT', name: 'Michigan Consumer Sentiment', unit: 'Index', format: 'number',
        changeType: 'diff', decimals: 1
      },
      CONSUMER_CONF: {
        fredId: 'CSCICP03USM665S', name: 'Consumer Confidence (OECD)', unit: 'Index', format: 'number',
        changeType: 'diff', decimals: 2
      },
      PERSONAL_SAVINGS: {
        fredId: 'PSAVERT', name: 'Personal Savings Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      RETAIL_SALES: {
        fredId: 'RSAFS', name: 'Retail Sales', unit: 'Millions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      PCE_REAL: {
        fredId: 'PCEC96', name: 'Real Personal Consumption', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 1
      },
      CONSUMER_CREDIT: {
        fredId: 'TOTALSL', name: 'Consumer Credit Outstanding', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 1
      }
    }
  },

  // ===== Yield Curve =====
  yieldcurve: {
    maturities: [
      { label: '1M',  fredId: 'DGS1MO',  months: 1 },
      { label: '3M',  fredId: 'DGS3MO',  months: 3 },
      { label: '6M',  fredId: 'DGS6MO',  months: 6 },
      { label: '1Y',  fredId: 'DGS1',    months: 12 },
      { label: '2Y',  fredId: 'DGS2',    months: 24 },
      { label: '3Y',  fredId: 'DGS3',    months: 36 },
      { label: '5Y',  fredId: 'DGS5',    months: 60 },
      { label: '7Y',  fredId: 'DGS7',    months: 84 },
      { label: '10Y', fredId: 'DGS10',   months: 120 },
      { label: '20Y', fredId: 'DGS20',   months: 240 },
      { label: '30Y', fredId: 'DGS30',   months: 360 }
    ],
    spread: {
      long: 'DGS10',
      short: 'DGS2',
      label: '10Y - 2Y Spread'
    }
  },

  // ===== Money & Credit =====
  money: {
    label: 'Money & Credit',
    series: {
      FEDFUNDS: {
        fredId: 'FEDFUNDS', name: 'Federal Funds Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      },
      M2: {
        fredId: 'M2SL', name: 'M2 Money Supply', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      PRIME: {
        fredId: 'DPRIME', name: 'Bank Prime Loan Rate', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      },
      LENDING_STANDARDS: {
        fredId: 'DRTSCLCC', name: 'Bank Lending Standards (Consumer)', unit: 'Net %', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      EXCESS_RESERVES: {
        fredId: 'IORB', name: 'Interest on Reserve Balances', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      },
      TREASURY_10Y: {
        fredId: 'DGS10', name: '10-Year Treasury Yield', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 2
      }
    }
  },

  // ===== Federal Budget & Debt =====
  budget: {
    label: 'Federal Budget & Debt',
    series: {
      FED_SURPLUS: {
        fredId: 'MTSDS133FMS', name: 'Monthly Treasury Statement (Surplus/Deficit)', unit: 'Millions $', format: 'dollar',
        changeType: 'diff', decimals: 0
      },
      FED_DEBT: {
        fredId: 'GFDEBTN', name: 'Federal Debt: Total Public', unit: 'Millions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      DEBT_TO_GDP: {
        fredId: 'GFDEGDQ188S', name: 'Federal Debt to GDP', unit: '%', format: 'percent',
        changeType: 'diff', decimals: 1
      },
      FED_RECEIPTS: {
        fredId: 'W006RC1Q027SBEA', name: 'Federal Govt Receipts', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      FED_EXPENDITURES: {
        fredId: 'W019RCQ027SBEA', name: 'Federal Govt Expenditures', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      INTEREST_PAYMENTS: {
        fredId: 'A091RC1Q027SBEA', name: 'Federal Interest Payments', unit: 'Billions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      }
    }
  },

  // ===== Trade =====
  trade: {
    label: 'International Trade',
    series: {
      TRADE_BALANCE: {
        fredId: 'BOPGSTB', name: 'Trade Balance (Goods & Services)', unit: 'Millions $', format: 'dollar',
        changeType: 'diff', decimals: 0
      },
      EXPORTS: {
        fredId: 'BOPTEXP', name: 'Exports of Goods & Services', unit: 'Millions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      IMPORTS: {
        fredId: 'BOPTIMP', name: 'Imports of Goods & Services', unit: 'Millions $', format: 'dollar',
        changeType: 'pct', decimals: 0
      },
      NET_EXPORTS_GDP: {
        fredId: 'NETEXP', name: 'Net Exports (GDP Component)', unit: 'Billions $', format: 'dollar',
        changeType: 'diff', decimals: 1
      },
      TRADE_WEIGHTED_USD: {
        fredId: 'DTWEXBGS', name: 'Trade-Weighted U.S. Dollar Index', unit: 'Index', format: 'number',
        changeType: 'pct', decimals: 1
      },
      CURRENT_ACCOUNT: {
        fredId: 'NETFI', name: 'Net Foreign Investment', unit: 'Billions $', format: 'dollar',
        changeType: 'diff', decimals: 1
      }
    }
  }
};

// ===== Release Calendar (curated) =====
const RELEASE_CALENDAR = [
  { name: 'Employment Situation (Jobs Report)', source: 'BLS', fredReleaseId: 50, time: '8:30 AM ET', frequency: 'Monthly (1st Friday)' },
  { name: 'Consumer Price Index (CPI)', source: 'BLS', fredReleaseId: 10, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'Personal Income & Outlays (incl. PCE)', source: 'BEA', fredReleaseId: 54, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'Producer Price Index (PPI)', source: 'BLS', fredReleaseId: 46, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'GDP (Advance/Second/Third Estimate)', source: 'BEA', fredReleaseId: 53, time: '8:30 AM ET', frequency: 'Quarterly' },
  { name: 'FOMC Meeting Minutes / Rate Decision', source: 'Federal Reserve', fredReleaseId: 21, time: '2:00 PM ET', frequency: '~8x/year' },
  { name: 'Retail Sales', source: 'Census Bureau', fredReleaseId: 11, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'Consumer Confidence / Sentiment', source: 'U of Michigan', fredReleaseId: 72, time: '10:00 AM ET', frequency: 'Monthly' },
  { name: 'JOLTS (Job Openings)', source: 'BLS', fredReleaseId: 132, time: '10:00 AM ET', frequency: 'Monthly' },
  { name: 'Weekly Jobless Claims', source: 'DOL', fredReleaseId: 31, time: '8:30 AM ET', frequency: 'Weekly (Thursday)' },
  { name: 'Housing Starts & Building Permits', source: 'Census Bureau', fredReleaseId: 12, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'Existing Home Sales', source: 'NAR', fredReleaseId: 91, time: '10:00 AM ET', frequency: 'Monthly' },
  { name: 'New Home Sales', source: 'Census Bureau', fredReleaseId: 13, time: '10:00 AM ET', frequency: 'Monthly' },
  { name: 'Case-Shiller Home Price Index', source: 'S&P', fredReleaseId: 199, time: '9:00 AM ET', frequency: 'Monthly' },
  { name: 'Industrial Production & Capacity Utilization', source: 'Federal Reserve', fredReleaseId: 14, time: '9:15 AM ET', frequency: 'Monthly' },
  { name: 'Trade Balance (International Trade)', source: 'Census/BEA', fredReleaseId: 15, time: '8:30 AM ET', frequency: 'Monthly' },
  { name: 'Treasury Budget Statement', source: 'Treasury', fredReleaseId: 17, time: '2:00 PM ET', frequency: 'Monthly' },
  { name: 'Beige Book', source: 'Federal Reserve', fredReleaseId: 22, time: '2:00 PM ET', frequency: '~8x/year' },
];

// Plotly theme config
function getPlotlyTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: "'Inter', sans-serif",
      color: isDark ? '#9aa0b0' : '#5f6577',
      size: 12
    },
    xaxis: {
      gridcolor: isDark ? '#2d3244' : '#eef0f4',
      linecolor: isDark ? '#2d3244' : '#e2e5eb',
      zerolinecolor: isDark ? '#3d4258' : '#d0d5de'
    },
    yaxis: {
      gridcolor: isDark ? '#2d3244' : '#eef0f4',
      linecolor: isDark ? '#2d3244' : '#e2e5eb',
      zerolinecolor: isDark ? '#3d4258' : '#d0d5de'
    },
    colorway: ['#4361ee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'],
    margin: { l: 50, r: 20, t: 10, b: 40 },
    hoverlabel: {
      bgcolor: isDark ? '#1a1d27' : '#fff',
      bordercolor: isDark ? '#3d4258' : '#e2e5eb',
      font: { family: "'Inter', sans-serif", size: 13, color: isDark ? '#e8eaed' : '#1a1d23' }
    }
  };
}

function getPlotlyConfig() {
  return {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
    displaylogo: false
  };
}
