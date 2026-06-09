(function () {
  const SESSION_KEY = "tomcodex.authSession.v1";
  const IDENTITY_KEY = "tomcodex.authIdentity.v1";
  const card = document.getElementById("learnerIdentityCard");
  if (!card) return;

  function parse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function metrics() {
    const records = parse("tomcodex.learningRecords.v1", []);
    const interviews = parse("tomcodex.interviewHistory.v1", []);
    const enrollments = parse("tomcodex.courseEnrollments.v1", {});
    return {
      activities: Array.isArray(records) ? records.length : 0,
      interviews: Array.isArray(interviews) ? interviews.length : 0,
      courses: Object.keys(enrollments || {}).length
    };
  }

  function render(student) {
    const summary = metrics();
    const enrolled = student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Recently";
    document.getElementById("learnerAvatar").textContent = String(student.name || "S").trim().slice(0, 1).toUpperCase();
    document.getElementById("learnerWelcome").textContent = `Welcome back, ${student.name || "Student"}`;
    document.getElementById("learnerEmail").textContent = student.email || "Student account";
    document.getElementById("learnerRole").textContent = student.role === "student" ? "Student learner" : student.role;
    document.getElementById("learnerEnrolled").textContent = enrolled;
    document.getElementById("learnerActivityCount").textContent = summary.activities;
    document.getElementById("learnerInterviewCount").textContent = summary.interviews;
    document.getElementById("learnerCourseCount").textContent = summary.courses;
    card.hidden = false;
  }

  async function loadStudent() {
    const session = parse(SESSION_KEY, {});
    const cached = parse(IDENTITY_KEY, {});
    if (session.role !== "student") {
      card.hidden = true;
      return;
    }
    if (cached.role === "student") render(cached);
    try {
      const response = await fetch("/api/student-progress");
      if (!response.ok) throw new Error("Student session unavailable");
      const result = await response.json();
      const identity = { id: result.student.id, name: result.student.name, email: result.student.email, role: "student", enrolledAt: result.student.enrolledAt };
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
      render(identity);
    } catch {
      if (cached.role !== "student") card.hidden = true;
    }
  }

  loadStudent();
})();
