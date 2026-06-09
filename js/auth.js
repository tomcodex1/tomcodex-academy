const AUTH_SESSION_KEY = "tomcodex.authSession.v1";
const AUTH_IDENTITY_KEY = "tomcodex.authIdentity.v1";
const authMessage = document.getElementById("authMessage");
const learnerAccessBtn = document.getElementById("learnerAccessBtn");
const learnerAuthPanel = document.getElementById("learnerAuthPanel");
const tutorLoginBtn = document.getElementById("tutorLoginBtn");
const tutorLoginPanel = document.getElementById("tutorLoginPanel");
const tutorSubmitBtn = document.getElementById("tutorSubmitBtn");
const accessParams = new URLSearchParams(window.location.search);
const accessReason = accessParams.get("next") || (accessParams.get("student") === "required" ? "dashboard" : "");
const localHostnames = new Set(["localhost", "127.0.0.1"]);
const isStaticLocalPreview = window.location.protocol === "file:"
  || (localHostnames.has(window.location.hostname) && window.location.port !== "3000");
if (isStaticLocalPreview) {
  const localAcademyUrl = new URL(`${window.location.pathname || "/index.html"}${window.location.search}${window.location.hash}`, "http://localhost:3000");
  window.location.replace(localAcademyUrl.href);
}
let existingSession = {};
try { existingSession = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)) || {}; } catch {}

if ((accessParams.get("student") === "required" && existingSession.role === "student")
  || (accessParams.get("tutor") === "required" && existingSession.role === "tutor")) {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_IDENTITY_KEY);
  existingSession = {};
} else if (existingSession.role === "student") {
  window.location.replace("/learner-dashboard");
} else if (existingSession.role === "tutor") {
  window.location.replace("tutor-dashboard.html");
}

function saveSession(role, method, identifier) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
    role,
    method,
    identifier,
    signedInAt: new Date().toISOString()
  }));
}

function saveIdentity(identity) {
  localStorage.setItem(AUTH_IDENTITY_KEY, JSON.stringify(identity));
}

function showMessage(type, message) {
  authMessage.className = `auth-message ${type}`;
  authMessage.textContent = message;
}

if (accessParams.get("tutor") === "required") {
  showRole("tutor", false);
  showMessage("info", "Tutor verification is required to open the tutor dashboard.");
} else if (accessReason === "dashboard") {
  showMessage("info", "The learner dashboard is private. Sign in to open your saved learning workspace.");
}

function showRole(role, focus = true) {
  const isStudent = role === "student";
  learnerAuthPanel.classList.toggle("hidden", !isStudent);
  tutorLoginPanel.classList.toggle("hidden", isStudent);
  learnerAccessBtn.classList.toggle("active", isStudent);
  tutorLoginBtn.classList.toggle("active", !isStudent);
  learnerAccessBtn.setAttribute("aria-selected", String(isStudent));
  tutorLoginBtn.setAttribute("aria-selected", String(!isStudent));
  authMessage.className = "auth-message hidden";
  if (focus) document.getElementById(isStudent ? "studentSignInEmail" : "tutorEmail").focus();
}

function showStudentTab(tabName) {
  document.querySelectorAll("[data-student-tab]").forEach((button) => {
    const active = button.dataset.studentTab === tabName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-student-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.studentPanel !== tabName);
  });
}

async function readJsonResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!text) throw new Error(fallbackMessage);
  if (!contentType.includes("application/json")) {
    throw new Error(response.ok ? fallbackMessage : `Server returned ${response.status}. ${fallbackMessage}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(fallbackMessage);
  }
}

async function postJson(url, body) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error("Cannot reach the academy server. Open http://localhost:3000 and try again.");
  }
  const result = await readJsonResponse(response, "Student account login requires the TomCodex academy server. Start it with npm start.");
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}

function openLearnerWorkspace(student) {
  Object.entries(student.progress || {}).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  saveSession("student", "student-account", student.email);
  saveIdentity({ id: student.id, name: student.name, email: student.email, role: "student", enrolledAt: student.enrolledAt });
  showMessage("success", `Welcome, ${student.name}. Opening your learner workspace...`);
  setTimeout(() => { window.location.href = "/learner-dashboard"; }, 500);
}

learnerAccessBtn.addEventListener("click", () => showRole("student"));
document.querySelectorAll("[data-student-tab]").forEach((button) => button.addEventListener("click", () => showStudentTab(button.dataset.studentTab)));
document.querySelectorAll("[data-open-student-tab]").forEach((button) => button.addEventListener("click", () => showStudentTab(button.dataset.openStudentTab)));

document.getElementById("studentSignInForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("info", "Signing in securely...");
  try {
    const student = await postJson("/api/student-login", {
      email: document.getElementById("studentSignInEmail").value.trim(),
      password: document.getElementById("studentSignInPassword").value
    });
    openLearnerWorkspace(student);
  } catch (error) { showMessage("error", error.message); }
});

document.getElementById("studentSignUpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("info", "Creating your student account...");
  try {
    const student = await postJson("/api/student-signup", {
      name: document.getElementById("studentName").value.trim(),
      email: document.getElementById("studentSignUpEmail").value.trim(),
      password: document.getElementById("studentSignUpPassword").value
    });
    openLearnerWorkspace(student);
  } catch (error) { showMessage("error", error.message); }
});

document.getElementById("requestResetBtn").addEventListener("click", async () => {
  showMessage("info", "Preparing a password reset code...");
  try {
    const result = await postJson("/api/student-forgot-password", { email: document.getElementById("studentResetEmail").value.trim() });
    document.getElementById("resetCodeFields").classList.remove("hidden");
    showMessage("success", result.resetCode ? `Your local reset code is ${result.resetCode}.` : result.message);
  } catch (error) { showMessage("error", error.message); }
});

document.getElementById("studentResetForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("info", "Updating your password...");
  try {
    await postJson("/api/student-reset-password", {
      email: document.getElementById("studentResetEmail").value.trim(),
      resetCode: document.getElementById("studentResetCode").value.trim(),
      newPassword: document.getElementById("studentNewPassword").value
    });
    showMessage("success", "Password updated. You can now sign in.");
    showStudentTab("signin");
  } catch (error) { showMessage("error", error.message); }
});

tutorLoginBtn.addEventListener("click", () => showRole("tutor"));

tutorLoginPanel.addEventListener("submit", async (event) => {
  event.preventDefault();
  tutorSubmitBtn.disabled = true;
  tutorSubmitBtn.textContent = "Verifying tutor access...";
  authMessage.className = "auth-message info";
  authMessage.textContent = "Securely verifying tutor credentials...";

  try {
    const response = await fetch("/api/tutor-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("tutorEmail").value.trim(),
        accessCode: document.getElementById("tutorAccessCode").value
      })
    });
    const result = await readJsonResponse(response, "Tutor login requires the TomCodex academy server. Start it with npm start.");
    if (!response.ok) throw new Error(result.error || "Tutor verification failed.");

    saveSession("tutor", "tutor-credentials", result.email);
    saveIdentity({ name: "Academy Tutor", email: result.email, role: "tutor" });
    authMessage.className = "auth-message success";
    authMessage.textContent = "Tutor verified. Opening the tutor dashboard...";
    setTimeout(() => {
      window.location.href = "tutor-dashboard.html";
    }, 500);
  } catch (error) {
    authMessage.className = "auth-message error";
    authMessage.textContent = error.message === "Failed to fetch"
      ? "Tutor login requires the TomCodex academy server. Start it with npm start."
      : error.message;
  } finally {
    tutorSubmitBtn.disabled = false;
    tutorSubmitBtn.textContent = "Verify and open curriculum";
  }
});
