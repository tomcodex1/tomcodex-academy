(function () {
  const STORAGE_KEY = "tomcodex.learningRecords.v1";

  function load() {
    try {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(records) ? records : [];
    } catch {
      return [];
    }
  }

  function record(type, points = 1, detail = "") {
    const records = load();
    records.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      points: Math.max(0, Number(points) || 0),
      detail,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-1500)));
  }

  window.TomCodexLearning = { load, record };
})();
