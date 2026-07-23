// ========== Main Application ==========

const App = {
  currentTab: 'highlights',
  loadedTabs: new Set(),

  init() {
    this.initTheme();
    this.bindEvents();
    this.loadCurrentTab();
  },

  // ===== Theme =====
  initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.updateThemeIcon();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        this.updateThemeIcon();
        this.replotCharts();
      }
    });
  },

  updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.getElementById('theme-icon-light').style.display = isDark ? 'none' : 'block';
    document.getElementById('theme-icon-dark').style.display = isDark ? 'block' : 'none';
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this.updateThemeIcon();
    this.replotCharts();
  },

  replotCharts() {
    this.loadedTabs.clear();
    this.loadCurrentTab();
  },

  // ===== Events =====
  bindEvents() {
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('refresh-btn').addEventListener('click', () => {
      API.cache.clear();
      this.loadedTabs.clear();
      this.loadCurrentTab();
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
    this.loadCurrentTab();
  },

  async loadCurrentTab() {
    const tab = this.currentTab;
    if (this.loadedTabs.has(tab)) return;

    try {
      switch (tab) {
        case 'highlights': await this.loadOverview(); break;
        case 'gdp': await this.loadCategory('gdp'); break;
        case 'labor': await this.loadCategory('labor'); break;
        case 'prices': await this.loadCategory('prices'); break;
        case 'housing': await this.loadCategory('housing'); break;
        case 'consumer': await this.loadCategory('consumer'); break;
        case 'yieldcurve': await this.loadYieldCurve(); break;
        case 'money': await this.loadCategory('money'); break;
        case 'budget': await this.loadCategory('budget'); break;
        case 'trade': await this.loadCategory('trade'); break;
        case 'calendar': await this.loadCalendar(); break;
      }
      this.loadedTabs.add(tab);
      this.updateRefreshTime();
    } catch (e) {
      console.error(`Error loading ${tab}:`, e);
    }
  },

  updateRefreshTime() {
    const el = document.getElementById('last-refresh');
    el.textContent = 'Refreshed ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  },

  // ===== Overview Tab =====
  async loadOverview() {
    const kpiContainer = document.getElementById('overview-kpis');
    const overviewKeys = SERIES.overview;

    // Resolve overview keys to configs
    const resolved = this.resolveOverviewSeries(overviewKeys);

    // Show skeletons
    kpiContainer.innerHTML = resolved.map(({ config }) => Charts.buildSkeletonCard(config)).join('');

    // Fetch all data
    const fredIds = resolved.map(r => r.config.fredId);

    try {
      const allData = await API.getMultipleLatest(fredIds);

      // Render KPIs
      kpiContainer.innerHTML = resolved.map(({ key, config }) => {
        return Charts.buildKpiCard(key, config, allData[config.fredId] || []);
      }).join('');
    } catch (e) {
      kpiContainer.innerHTML = `<div class="error-msg">Failed to load data: ${e.message}. Check your API key and network connection.</div>`;
    }

    // Yield curve status
    await this.loadYieldCurveStatus();

    // Mini SP500 chart
    await this.loadMiniChart();
  },

  resolveOverviewSeries(keys) {
    const result = [];
    for (const key of keys) {
      for (const cat of ['gdp', 'labor', 'prices', 'housing', 'consumer', 'money', 'budget', 'trade']) {
        const catDef = SERIES[cat];
        if (catDef?.series?.[key]) {
          result.push({ key, config: catDef.series[key] });
          break;
        }
      }
    }
    return result;
  },

  async loadYieldCurveStatus() {
    const container = document.getElementById('yield-curve-status');
    try {
      const data10 = await API.getLatest('DGS10', 1);
      const data2 = await API.getLatest('DGS2', 1);
      const y10 = data10[0]?.value;
      const y2 = data2[0]?.value;

      if (y10 == null || y2 == null) {
        container.innerHTML = '<p style="color:var(--text-muted)">Yield data unavailable</p>';
        return;
      }

      const spread = y10 - y2;
      let status, statusClass, desc;

      if (spread < -0.05) {
        status = 'Inverted';
        statusClass = 'inverted';
        desc = `The 10-year yield (${y10.toFixed(2)}%) is below the 2-year yield (${y2.toFixed(2)}%). Spread: ${spread.toFixed(2)}%. An inverted curve has historically preceded recessions.`;
      } else if (spread < 0.10) {
        status = 'Flat';
        statusClass = 'flat';
        desc = `The 10-year yield (${y10.toFixed(2)}%) and 2-year yield (${y2.toFixed(2)}%) are nearly equal. Spread: ${spread.toFixed(2)}%. A flat curve signals economic uncertainty.`;
      } else {
        status = 'Normal';
        statusClass = 'normal';
        desc = `The 10-year yield (${y10.toFixed(2)}%) exceeds the 2-year yield (${y2.toFixed(2)}%). Spread: ${spread.toFixed(2)}%. A normal upward-sloping curve.`;
      }

      container.innerHTML = `
        <div class="yield-status-badge ${statusClass}">
          ${status === 'Normal' ? '&#10003;' : status === 'Inverted' ? '&#9888;' : '&#8212;'} ${status}
        </div>
        <p class="yield-status-detail">${desc}</p>
      `;
    } catch (e) {
      container.innerHTML = '<p style="color:var(--text-muted)">Could not load yield curve status</p>';
    }
  },

  async loadMiniChart() {
    try {
      const data = await API.getChartData('SP500', 1);
      Charts.renderTimeSeriesChart('overview-mini-chart', data, 'S&P 500', {
        height: 200, fill: true, color: '#4361ee'
      });
    } catch (e) {
      document.getElementById('overview-mini-chart').innerHTML =
        '<p style="color:var(--text-muted);padding:1rem">Could not load chart</p>';
    }
  },

  // ===== Generic Category Tab =====
  async loadCategory(catKey) {
    const catDef = SERIES[catKey];
    if (!catDef) return;

    const kpiContainer = document.getElementById(`${catKey}-kpis`);
    const chartsContainer = document.getElementById(`${catKey}-charts`);
    const seriesEntries = Object.entries(catDef.series);

    // Show skeletons
    kpiContainer.innerHTML = seriesEntries.map(([, cfg]) => Charts.buildSkeletonCard(cfg)).join('');
    chartsContainer.innerHTML = '';

    // Fetch all latest values
    const fredIds = seriesEntries.map(([, cfg]) => cfg.fredId);
    const allData = await API.getMultipleLatest(fredIds);

    // Render KPIs
    kpiContainer.innerHTML = seriesEntries.map(([key, cfg]) => {
      return Charts.buildKpiCard(key, cfg, allData[cfg.fredId] || []);
    }).join('');

    // Render charts (load in parallel, render sequentially)
    const chartPromises = seriesEntries.map(async ([key, cfg]) => {
      const chartId = `chart-${catKey}-${key}`;
      const wrapper = Charts.createChartContainer(`${catKey}-charts`, chartId, cfg.name, cfg.unit);
      if (!wrapper) return;

      wrapper.dataset.fredId = cfg.fredId;
      const chartConfig = {
        color: cfg.invert ? '#ef4444' : '#4361ee',
        fill: true,
        zeroline: cfg.format === 'dollar' && cfg.changeType === 'diff'
      };
      wrapper._chartConfig = chartConfig;

      try {
        const data = await API.getChartData(cfg.fredId, 5);
        Charts.renderTimeSeriesChart(chartId, data, cfg.name, chartConfig);
      } catch (e) {
        document.getElementById(chartId).innerHTML =
          `<p style="color:var(--text-muted);padding:1rem">Could not load data for ${cfg.name}</p>`;
      }
    });

    await Promise.all(chartPromises);
  },

  // ===== Yield Curve Tab =====
  async loadYieldCurve() {
    const mats = SERIES.yieldcurve.maturities;

    // Fetch latest yield for each maturity
    const yieldPromises = mats.map(async (m) => {
      try {
        const data = await API.getLatest(m.fredId, 1);
        return { label: m.label, value: data[0]?.value ?? null, date: data[0]?.date };
      } catch {
        return { label: m.label, value: null, date: null };
      }
    });

    const yields = await Promise.all(yieldPromises);
    const labels = yields.map(y => y.label);
    const values = yields.map(y => y.value);
    const latestDate = yields.find(y => y.date)?.date;

    // Date display
    document.getElementById('yield-curve-date').textContent =
      latestDate ? `As of ${Charts.formatDate(latestDate)}` : '';

    // Curve chart
    Charts.renderYieldCurve('yield-curve-chart', labels, values);

    // Yield table
    document.getElementById('yield-curve-table-container').innerHTML =
      Charts.buildYieldTable(labels, values);

    // Spread history
    await this.loadYieldSpread();
  },

  async loadYieldSpread() {
    try {
      const [data10, data2] = await Promise.all([
        API.getChartData('DGS10', 5),
        API.getChartData('DGS2', 5)
      ]);

      // Align dates and compute spread
      const map2 = new Map(data2.map(d => [d.date, d.value]));
      const spreadData = data10
        .filter(d => map2.has(d.date))
        .map(d => ({ date: d.date, value: d.value - map2.get(d.date) }));

      Charts.renderYieldSpreadChart('yield-spread-chart', spreadData);
    } catch (e) {
      document.getElementById('yield-spread-chart').innerHTML =
        '<p style="color:var(--text-muted);padding:1rem">Could not load spread data</p>';
    }
  },

  // ===== Release Calendar Tab =====
  async loadCalendar() {
    const container = document.getElementById('calendar-content');
    container.innerHTML = '<div class="panel"><div class="spinner" style="margin:2rem auto"></div><p style="text-align:center;color:var(--text-muted)">Loading release dates...</p></div>';

    const releases = [];
    const promises = RELEASE_CALENDAR.map(async (rel) => {
      const dates = await API.getReleaseDates(rel.fredReleaseId, 3);
      releases.push({ ...rel, dates });
    });

    await Promise.all(promises);

    // Flatten and filter to only future/today
    const today = new Date().toISOString().slice(0, 10);
    const withDates = releases.filter(r => r.dates.length > 0);

    if (withDates.length === 0) {
      container.innerHTML = Charts.buildCalendar([]);
      return;
    }

    container.innerHTML = Charts.buildCalendar(withDates);
  }
};

// ===== Bootstrap =====
document.addEventListener('DOMContentLoaded', () => App.init());
