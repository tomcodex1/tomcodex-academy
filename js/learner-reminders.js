(function () {
  const SENT_KEY = "tomcodex.reminderSlots.v1";
  let reminderData;

  function dateKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function readSentSlots() {
    try { return JSON.parse(localStorage.getItem(SENT_KEY)) || {}; } catch { return {}; }
  }

  function markSent(slot) {
    const sent = readSentSlots();
    sent[slot] = true;
    localStorage.setItem(SENT_KEY, JSON.stringify(sent));
  }

  function reminderSlot(now) {
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes >= 9 * 60 && minutes < 10 * 60) return `${dateKey(now)}-morning`;
    if (minutes >= 18 * 60 && minutes < 19 * 60) return `${dateKey(now)}-evening`;
    return "";
  }

  function reminderMessage() {
    const next = reminderData.incompleteTracks[0];
    return next
      ? `${next.remaining} modules remain in ${next.name}. Continue your learning plan today.`
      : "Your learning plan is complete. Review your roadmap for the next goal.";
  }

  async function checkReminder() {
    if (!reminderData?.settings?.enabled || !reminderData.totalRemaining || Notification.permission !== "granted") return;
    const slot = reminderSlot(new Date());
    if (!slot || readSentSlots()[slot]) return;
    new Notification("TomCodex learning reminder", { body: reminderMessage(), icon: "assets/tomcodex-logo.svg", tag: slot });
    markSent(slot);
  }

  async function updateSettings(enabled) {
    const response = await fetch("/api/student-reminders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled })
    });
    reminderData.settings = (await response.json()).settings;
    render();
  }

  async function enableNotifications() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") await updateSettings(true);
    render();
    checkReminder();
  }

  function render() {
    const host = document.getElementById("learningReminderCard");
    if (!host || !reminderData) return;
    const enabled = reminderData.settings.enabled && Notification.permission === "granted";
    if (!reminderData.incompleteTracks.length) {
      host.innerHTML = `<div><span class="course-tag">Daily accountability</span><h2>Enroll to activate learning reminders</h2><p>Choose a learning track to begin saving course progress and receive daily reminders at <strong>9:00 AM</strong> and <strong>6:00 PM</strong>.</p></div><div class="reminder-control"><strong>No active course</strong><span>Your reminders begin after you enroll in a course.</span><button id="browseTracksBtn" type="button">Browse learning tracks</button></div>`;
      document.getElementById("browseTracksBtn").addEventListener("click", () => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }
    const enrolled = new Date(reminderData.enrolledAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    host.innerHTML = `<div><span class="course-tag">Daily accountability</span><h2>Learning reminders</h2><p>Since enrolling on ${enrolled}, you have <strong>${reminderData.totalRemaining} incomplete modules</strong>. Receive reminders every day at <strong>9:00 AM</strong> and <strong>6:00 PM</strong>.</p><div class="reminder-tracks">${reminderData.incompleteTracks.slice(0, 4).map((track) => `<span>${track.name}: ${track.remaining} remaining</span>`).join("")}</div></div><div class="reminder-control"><strong>${enabled ? "Reminders active" : "Reminders inactive"}</strong><span>${enabled ? "Morning and evening notifications enabled" : "Enable browser notifications to receive reminders"}</span><button id="toggleReminderBtn" type="button">${enabled ? "Turn off reminders" : "Enable reminders"}</button></div>`;
    document.getElementById("toggleReminderBtn").addEventListener("click", () => enabled ? updateSettings(false) : enableNotifications());
  }

  async function init() {
    if (!("Notification" in window)) return;
    try {
      const response = await fetch("/api/student-reminders");
      if (!response.ok) return;
      reminderData = await response.json();
      render();
      checkReminder();
      setInterval(checkReminder, 60000);
    } catch {}
  }

  document.addEventListener("DOMContentLoaded", init);
})();
