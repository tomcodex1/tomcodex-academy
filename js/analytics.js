const recordsApi = window.TomCodexLearning;
const interviewHistoryKey = "tomcodex.interviewHistory.v1";

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function loadInterviewHistory() {
  try { return JSON.parse(localStorage.getItem(interviewHistoryKey)) || []; } catch { return []; }
}

function calculateStreak(records) {
  const active = new Set(records.map((record) => dateKey(new Date(record.timestamp))));
  let streak = 0;
  const cursor = new Date();
  if (!active.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (active.has(dateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function renderStats(records) {
  const interviews = loadInterviewHistory();
  const points = records.reduce((sum, record) => sum + record.points, 0);
  const activeDays = new Set(records.map((record) => dateKey(new Date(record.timestamp)))).size;
  const bestInterview = interviews.reduce((best, item) => Math.max(best, item.score), 0);
  const stats = [["Learning points", points], ["Active days", activeDays], ["Current streak", `${calculateStreak(records)} days`], ["Best interview", `${bestInterview}%`]];
  document.getElementById("analyticsStats").innerHTML = stats.map(([label, value]) => `<div class="analytics-stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderHeatmap(records) {
  const totals = {};
  records.forEach((record) => { const key = dateKey(new Date(record.timestamp)); totals[key] = (totals[key] || 0) + record.points; });
  const heatmap = document.getElementById("heatmap");
  heatmap.innerHTML = "";
  const start = new Date();
  start.setDate(start.getDate() - 364);
  for (let index = 0; index < 365; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const total = totals[dateKey(date)] || 0;
    const level = total === 0 ? 0 : total < 3 ? 1 : total < 7 ? 2 : total < 13 ? 3 : 4;
    const cell = document.createElement("span");
    cell.className = `heat-cell level-${level}`;
    cell.title = `${date.toLocaleDateString()}: ${total} learning points`;
    heatmap.append(cell);
  }
}

function weeklyPoints(records) {
  return Array.from({ length: 12 }, (_, index) => {
    const end = new Date();
    end.setDate(end.getDate() - (11 - index) * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return records.filter((record) => { const time = new Date(record.timestamp); return time >= start && time <= end; }).reduce((sum, record) => sum + record.points, 0);
  });
}

function lineChart(values, labelPrefix) {
  if (!values.some((value) => value > 0)) return '<div class="empty-chart">Your progress curve will appear as learning records are collected.</div>';
  const width = 520, height = 210, padding = 24, max = Math.max(...values, 10);
  const points = values.map((value, index) => [padding + index * ((width - padding * 2) / Math.max(values.length - 1, 1)), height - padding - (value / max) * (height - padding * 2)]);
  const path = points.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  const area = `${path} L ${points.at(-1)[0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${labelPrefix} progress curve"><defs><linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#eef8ff"/></linearGradient></defs>${[0,1,2,3].map((line) => `<line class="chart-grid" x1="${padding}" y1="${padding + line * 50}" x2="${width-padding}" y2="${padding + line * 50}"/>`).join("")}<path class="chart-area" d="${area}"/><path class="chart-line" d="${path}"/>${points.map(([x,y], index) => `<circle class="chart-point" cx="${x}" cy="${y}" r="4"><title>${labelPrefix} ${index + 1}: ${values[index]}</title></circle>`).join("")}</svg>`;
}

function renderCurves(records) {
  document.getElementById("learningCurve").innerHTML = lineChart(weeklyPoints(records), "Week");
  const interviews = loadInterviewHistory().slice().reverse();
  document.getElementById("interviewCurve").innerHTML = lineChart(interviews.map((item) => item.score), "Interview");
}

function labelForType(type) {
  return ({ task: "Lesson task completed", habit: "Learning habit completed", tutor: "AI tutor question", stage: "Learning stage explored", interview: "AI interview completed", practice: "Practice activity" })[type] || "Learning activity";
}

function renderRecords(records) {
  const recent = records.slice().reverse().slice(0, 12);
  document.getElementById("recordList").innerHTML = recent.length ? recent.map((record) => `<div class="record-item"><span class="record-icon">${record.type.slice(0,2).toUpperCase()}</span><div><strong>${labelForType(record.type)}</strong><span>${record.detail || new Date(record.timestamp).toLocaleString()}</span></div><span class="record-points">+${record.points}</span></div>`).join("") : '<p class="empty-state">Learning records will appear when you complete lessons, practice, and interviews.</p>';
}

function renderMix(records) {
  const totals = {};
  records.forEach((record) => totals[record.type] = (totals[record.type] || 0) + record.points);
  const max = Math.max(...Object.values(totals), 1);
  document.getElementById("activityMix").innerHTML = Object.keys(totals).length ? Object.entries(totals).sort((a,b) => b[1]-a[1]).map(([type, points]) => `<div class="mix-row"><div><span>${labelForType(type)}</span><strong>${points}</strong></div><div class="mix-track"><div class="mix-fill" style="width:${Math.round(points/max*100)}%"></div></div></div>`).join("") : '<p class="empty-state">Complete activities to see your learning mix.</p>';
}

function renderAnalytics() {
  const records = recordsApi.load();
  renderStats(records); renderHeatmap(records); renderCurves(records); renderRecords(records); renderMix(records);
}

document.getElementById("addDemoRecordBtn").addEventListener("click", () => { recordsApi.record("practice", 3, "Self-directed Salesforce practice"); renderAnalytics(); });
renderAnalytics();
