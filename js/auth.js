const AUTH_SESSION_KEY = "tomcodex.authSession.v1";
const authMessage = document.getElementById("authMessage");

function openPreview(role) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
    role,
    method: "password-free-preview",
    identifier: role === "admin" ? "admin-preview" : "learner-preview",
    signedInAt: new Date().toISOString()
  }));

  authMessage.className = "auth-message success";
  authMessage.textContent = role === "admin"
    ? "Admin curriculum preview enabled. Opening all course modules..."
    : "Learner preview enabled. Opening your dashboard...";

  setTimeout(() => {
    window.location.href = role === "admin" ? "index.html#programs" : "dashboard.html";
  }, 500);
}

document.getElementById("learnerPreviewBtn").addEventListener("click", () => openPreview("user"));
document.getElementById("adminPreviewBtn").addEventListener("click", () => openPreview("admin"));
