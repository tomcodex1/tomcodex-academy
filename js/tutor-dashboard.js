(function () {
  const SESSION_KEY = "tomcodex.authSession.v1";
  const IDENTITY_KEY = "tomcodex.authIdentity.v1";
  const status = document.getElementById("studentRecordsStatus");
  const table = document.getElementById("studentRecordsTable");
  const body = document.getElementById("studentRecordsBody");
  const search = document.getElementById("studentRecordSearch");
  let students = [];
  let session = {};
  let identity = {};
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)) || {}; } catch {}
  try { identity = JSON.parse(localStorage.getItem(IDENTITY_KEY)) || {}; } catch {}

  if (session.role !== "tutor") {
    window.location.replace("index.html?tutor=required");
    return;
  }

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Not available";
  const formatActivity = (value) => {
    if (!value) return "No activity";
    const elapsed = Date.now() - new Date(value).getTime();
    if (elapsed < 60000) return "Just now";
    if (elapsed < 3600000) return `${Math.floor(elapsed / 60000)} min ago`;
    if (elapsed < 86400000) return `${Math.floor(elapsed / 3600000)} hr ago`;
    if (elapsed < 604800000) return `${Math.floor(elapsed / 86400000)} days ago`;
    return formatDate(value);
  };

  document.getElementById("tutorIdentity").textContent = identity.name || "Academy Tutor";
  document.getElementById("tutorEmail").textContent = identity.email || session.identifier || "Verified curriculum access";

  function renderRows(list) {
    if (!list.length) {
      table.hidden = true;
      status.hidden = false;
      status.textContent = students.length ? "No students match this search." : "No registered student accounts yet. New learner registrations will appear here automatically.";
      return;
    }
    status.hidden = true;
    table.hidden = false;
    body.innerHTML = list.map((student) => {
      const enrolledTracks = student.tracks.filter((track) => track.enrolled);
      const trackLabels = enrolledTracks.length
        ? enrolledTracks.map((track) => `<span class="${track.complete ? "complete" : ""}">${escapeHtml(track.name)} ${track.completed}/${track.total}</span>`).join("")
        : "<span>Not enrolled</span>";
      const tierBadge = student.tier === "founder"
        ? `<span class="student-tier-badge founder">Founder Access</span>`
        : `<span class="student-tier-badge free">Free Starter</span>`;
      return `<tr>
        <td><div class="student-name"><strong><a href="learner-profile.html?id=${encodeURIComponent(student.id)}" class="tutor-student-link" target="_blank" title="View Student Skill Passport">${escapeHtml(student.name)} ↗</a></strong><small>${escapeHtml(student.email)}</small>${tierBadge}</div></td>
        <td><span class="student-phase">${escapeHtml(student.phase)}</span><div class="student-track-list"><span>${escapeHtml(student.currentCourse)}</span></div></td>
        <td><div class="student-progress-line"><span>${student.completedModules}/${student.totalModules || 0} modules</span><strong>${student.progressPercent}%</strong></div><div class="student-progress-track"><div class="student-progress-fill" style="width:${student.progressPercent}%"></div></div><div class="student-track-list">${trackLabels}</div></td>
        <td><div class="student-activity"><strong>${student.activityCount} activities</strong><span>Last active ${escapeHtml(formatActivity(student.lastActiveAt))}</span></div></td>
        <td class="student-joined">${escapeHtml(formatDate(student.joinedAt))}</td>
      </tr>`;
    }).join("");
  }

  async function loadStudents() {
    try {
      const response = await fetch("/api/tutor-students");
      if (!response.ok) throw new Error(response.status === 401 ? "Tutor session expired. Sign in again." : "Student records could not be loaded.");
      const result = await response.json();
      students = result.students || [];
      document.getElementById("registeredStudentCount").textContent = result.totals.registered;
      document.getElementById("activeStudentCount").textContent = result.totals.active;
      document.getElementById("completedStudentCount").textContent = result.totals.completed;
      document.getElementById("studentActivityCount").textContent = result.totals.activities;
      renderRows(students);
    } catch (error) {
      table.hidden = true;
      status.hidden = false;
      status.textContent = error.message;
    }
  }

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    renderRows(students.filter((student) => [student.name, student.email, student.phase, student.currentCourse, student.tier].some((value) => String(value).toLowerCase().includes(query))));
  });

  loadStudents();
})();
