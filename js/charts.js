// ========== Chart & Rendering Utilities ==========

const Charts = {

  // Format a number for display
  formatValue(value, config) {
    if (value == null || isNaN(value)) return '—';
    const d = config.decimals ?? 1;

    if (config.format === 'dollar') {
      if (Math.abs(value) >= 1e6) return '$' + (value / 1e6).toFixed(1) + 'T';
      if (Math.abs(value) >= 1e3) return '$' + (value / 1e3).toFixed(1) + 'B';
      return '$' + value.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    if (config.format === 'percent') {
      return value.toFixed(d) + '%';
    }
    return value.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  },

  // Calculate change between latest and previous observation
  calcChange(observations, config) {
    if (!observations || observations.length < 2) return null;
    const latest = observations[0].value;
    const prev = observations[1].value;

    if (config.yoyDisplay && observations.length >= 13) {
      const yoyPrev = observations[12].value;
      const yoyPct = ((latest - yoyPrev) / Math.abs(yoyPrev)) * 100;
      return { value: yoyPct, display: yoyPct.toFixed(1) + '% YoY', type: 'pct' };
    }

    if (config.changeType === 'diff') {
      const diff = latest - prev;
      const sign = diff >= 0 ? '+' : '';
      return { value: diff, display: sign + diff.toFixed(config.decimals ?? 1), type: 'diff' };
    }
    if (config.changeType === 'pct') {
      const pct = ((latest - prev) / Math.abs(prev)) * 100;
      const sign = pct >= 0 ? '+' : '';
      return { value: pct, display: sign + pct.toFixed(1) + '%', type: 'pct' };
    }
    return null;
  },

  // Determine if change is positive/negative (accounting for inverted series)
  changeDirection(change, config) {
    if (!change) return 'neutral';
    const val = change.value;
    if (Math.abs(val) < 0.001) return 'neutral';
    const positive = val > 0;
    if (config.invert) return positive ? 'negative' : 'positive';
    return positive ? 'positive' : 'negative';
  },

  // Build a KPI card HTML
  buildKpiCard(key, config, observations) {
    const latest = observations?.[0];
    const change = this.calcChange(observations, config);
    const direction = this.changeDirection(change, config);
    const arrow = direction === 'positive' ? '&#9650;' : direction === 'negative' ? '&#9660;' : '&#8212;';

    const valueText = latest ? this.formatValue(latest.value, config) : '—';
    const dateText = latest ? this.formatDate(latest.date) : '';
    const changeHtml = change
      ? `<div class="kpi-change ${direction}">${arrow} ${change.display}</div>`
      : '';

    return `
      <div class="kpi-card" data-series="${key}">
        <div class="kpi-label">${config.name}</div>
        <div class="kpi-value">${valueText}</div>
        ${changeHtml}
        <div class="kpi-meta">
          ${dateText ? `Updated: ${dateText}` : ''}
          ${config.unit ? ` &middot; ${config.unit}` : ''}
        </div>
      </div>
    `;
  },

  // Build skeleton KPI card
  buildSkeletonCard(config) {
    return `
      <div class="kpi-card">
        <div class="kpi-label">${config.name}</div>
        <div class="skeleton skeleton-value"></div>
        <div class="skeleton skeleton-change"></div>
      </div>
    `;
  },

  // Format a date string
  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Render a Plotly time series chart
  renderTimeSeriesChart(containerId, data, title, config = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getPlotlyTheme();
    const dates = data.map(d => d.date);
    const values = data.map(d => d.value);

    const trace = {
      x: dates,
      y: values,
      type: 'scatter',
      mode: 'lines',
      line: { color: config.color || '#4361ee', width: 2 },
      fill: config.fill ? 'tozeroy' : undefined,
      fillcolor: config.fillColor || 'rgba(67, 97, 238, 0.08)',
      hovertemplate: '%{x|%b %d, %Y}<br><b>%{y:,.2f}</b><extra></extra>'
    };

    const layout = {
      ...theme,
      height: config.height || 300,
      xaxis: {
        ...theme.xaxis,
        type: 'date',
        rangeslider: config.rangeslider ? { visible: true } : undefined
      },
      yaxis: {
        ...theme.yaxis,
        title: config.yAxisTitle || '',
        tickformat: config.tickformat || ''
      },
      shapes: config.zeroline ? [{
        type: 'line', x0: dates[0], x1: dates[dates.length - 1],
        y0: 0, y1: 0, line: { color: theme.xaxis.zerolinecolor, width: 1.5, dash: 'dot' }
      }] : []
    };

    Plotly.newPlot(container, [trace], layout, getPlotlyConfig());
  },

  // Create a chart container with title + range selector
  createChartContainer(parentId, chartId, title, subtitle = '') {
    const parent = document.getElementById(parentId);
    if (!parent) return null;

    const div = document.createElement('div');
    div.className = 'chart-container';
    div.innerHTML = `
      <h4>${title}</h4>
      ${subtitle ? `<div class="chart-subtitle">${subtitle}</div>` : ''}
      <div class="range-selector">
        <button class="range-btn" data-range="1">1Y</button>
        <button class="range-btn active" data-range="5">5Y</button>
        <button class="range-btn" data-range="10">10Y</button>
        <button class="range-btn" data-range="20">20Y</button>
        <button class="range-btn" data-range="max">Max</button>
      </div>
      <div id="${chartId}" style="width:100%;height:300px;"></div>
    `;
    parent.appendChild(div);

    // Wire up range buttons
    const buttons = div.querySelectorAll('.range-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const range = btn.dataset.range;
        const fredId = div.dataset.fredId;
        if (fredId) {
          const years = range === 'max' ? 'max' : parseInt(range);
          const data = await API.getChartData(fredId, years);
          Charts.renderTimeSeriesChart(chartId, data, title, div._chartConfig || {});
        }
      });
    });

    return div;
  },

  // Render yield curve snapshot
  renderYieldCurve(containerId, maturities, yields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getPlotlyTheme();

    const trace = {
      x: maturities,
      y: yields,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#4361ee', width: 3 },
      marker: { size: 8, color: '#4361ee' },
      hovertemplate: '<b>%{x}</b><br>Yield: %{y:.2f}%<extra></extra>'
    };

    const layout = {
      ...theme,
      height: 350,
      xaxis: {
        ...theme.xaxis,
        title: 'Maturity',
        type: 'category'
      },
      yaxis: {
        ...theme.yaxis,
        title: 'Yield (%)',
        ticksuffix: '%'
      }
    };

    Plotly.newPlot(container, [trace], layout, getPlotlyConfig());
  },

  // Build yield table
  buildYieldTable(maturities, yields) {
    let html = '<table class="yield-table"><thead><tr>';
    maturities.forEach(m => { html += `<th>${m}</th>`; });
    html += '</tr></thead><tbody><tr>';
    yields.forEach(y => {
      html += `<td>${y != null ? y.toFixed(2) + '%' : '—'}</td>`;
    });
    html += '</tr></tbody></table>';
    return html;
  },

  // Render yield spread (10Y - 2Y) time series
  renderYieldSpreadChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getPlotlyTheme();
    const dates = data.map(d => d.date);
    const values = data.map(d => d.value);

    const colors = values.map(v => v < 0 ? '#ef4444' : '#10b981');

    const trace = {
      x: dates,
      y: values,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#4361ee', width: 1.5 },
      fill: 'tozeroy',
      fillcolor: 'rgba(67, 97, 238, 0.06)',
      hovertemplate: '%{x|%b %d, %Y}<br><b>%{y:.2f}%</b><extra></extra>'
    };

    const layout = {
      ...theme,
      height: 350,
      xaxis: {
        ...theme.xaxis,
        type: 'date'
      },
      yaxis: {
        ...theme.yaxis,
        title: 'Spread (%)',
        ticksuffix: '%'
      },
      shapes: [{
        type: 'line',
        x0: dates[0], x1: dates[dates.length - 1],
        y0: 0, y1: 0,
        line: { color: '#ef4444', width: 1.5, dash: 'dash' }
      }]
    };

    Plotly.newPlot(container, [trace], layout, getPlotlyConfig());
  },

  // Build calendar content
  buildCalendar(releases) {
    // Group by date
    const groups = {};
    releases.forEach(r => {
      r.dates.forEach(dateStr => {
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(r);
      });
    });

    const today = new Date().toISOString().slice(0, 10);
    const sortedDates = Object.keys(groups).sort();

    if (sortedDates.length === 0) {
      return '<div class="panel"><p style="color:var(--text-muted)">No upcoming releases found. The FRED release calendar may not have future dates loaded.</p></div>';
    }

    let html = '';
    sortedDates.forEach(dateStr => {
      const d = new Date(dateStr + 'T00:00:00');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const isToday = dateStr === today;

      html += `<div class="calendar-group ${isToday ? 'calendar-today' : ''}">`;
      html += `<div class="calendar-group-header">${dayLabel}${isToday ? ' — Today' : ''}</div>`;
      groups[dateStr].forEach(r => {
        html += `
          <div class="calendar-item">
            <span class="calendar-time">${r.time}</span>
            <span class="calendar-name">${r.name}</span>
            <span class="calendar-source">${r.source}</span>
          </div>
        `;
      });
      html += '</div>';
    });
    return html;
  }
};
