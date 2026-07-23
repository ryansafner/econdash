// ========== API Layer ==========
// API key is injected server-side by the Netlify function (or server.py locally).
// The client never sees or sends the FRED API key.

const API = {
  cache: new Map(),
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes

  getCacheKey(endpoint, params) {
    return `${endpoint}?${new URLSearchParams(params).toString()}`;
  },

  getFromCache(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.ts < this.CACHE_TTL) return entry.data;
    return null;
  },

  async fetchJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status}: ${resp.statusText} — ${text.slice(0, 200)}`);
    }
    return resp.json();
  },

  async getSeriesObservations(seriesId, opts = {}) {
    const params = {
      series_id: seriesId,
      file_type: 'json',
      sort_order: 'desc',
      ...opts
    };
    const cacheKey = this.getCacheKey('observations', params);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const url = `${FRED_BASE}/series/observations?${new URLSearchParams(params)}`;
    const data = await this.fetchJSON(url);
    const observations = (data.observations || [])
      .filter(o => o.value !== '.')
      .map(o => ({
        date: o.date,
        value: parseFloat(o.value)
      }));

    this.cache.set(cacheKey, { data: observations, ts: Date.now() });
    return observations;
  },

  async getSeriesInfo(seriesId) {
    const params = {
      series_id: seriesId,
      file_type: 'json'
    };
    const cacheKey = this.getCacheKey('series', params);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const url = `${FRED_BASE}/series?${new URLSearchParams(params)}`;
    const data = await this.fetchJSON(url);
    const info = data.seriess?.[0] || {};
    this.cache.set(cacheKey, { data: info, ts: Date.now() });
    return info;
  },

  async getReleaseDates(releaseId, limit = 3) {
    const now = new Date();
    const params = {
      release_id: releaseId,
      file_type: 'json',
      include_release_dates_with_no_data: 'true',
      sort_order: 'asc',
      realtime_start: now.toISOString().slice(0, 10),
      limit
    };
    const cacheKey = this.getCacheKey('release_dates', params);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const url = `${FRED_BASE}/release/dates?${new URLSearchParams(params)}`;
      const data = await this.fetchJSON(url);
      const dates = (data.release_dates || []).map(d => d.date);
      this.cache.set(cacheKey, { data: dates, ts: Date.now() });
      return dates;
    } catch {
      return [];
    }
  },

  async getLatest(seriesId, count = 2) {
    return this.getSeriesObservations(seriesId, { limit: count, sort_order: 'desc' });
  },

  async getHistory(seriesId, startDate) {
    const params = {};
    if (startDate) params.observation_start = startDate;
    params.sort_order = 'asc';
    return this.getSeriesObservations(seriesId, params);
  },

  async getMultipleLatest(seriesIds) {
    const results = {};
    const promises = seriesIds.map(async (id) => {
      try {
        const obs = await this.getLatest(id, 13);
        results[id] = obs;
      } catch (e) {
        console.warn(`Failed to fetch ${id}:`, e.message);
        results[id] = [];
      }
    });
    await Promise.all(promises);
    return results;
  },

  async getChartData(seriesId, years = 5) {
    let startDate = null;
    if (years !== 'max') {
      const d = new Date();
      d.setFullYear(d.getFullYear() - years);
      startDate = d.toISOString().slice(0, 10);
    }
    return this.getHistory(seriesId, startDate);
  }
};
