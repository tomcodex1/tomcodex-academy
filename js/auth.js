const authTabs = [...document.querySelectorAll("[data-auth-tab]")];
const authPanels = [...document.querySelectorAll("[data-auth-panel]")];
const authMessage = document.getElementById("authMessage");
const otpArea = document.getElementById("otpArea");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");
const otpTimer = document.getElementById("otpTimer");
let otpInterval;
let createAccountMode = new URLSearchParams(window.location.search).get("mode") === "signup";

function showMessage(message, type = "info") {
  authMessage.className = `auth-message ${type}`;
  authMessage.textContent = message;
}

function selectAuthTab(tabName) {
  authTabs.forEach((tab) => {
    const active = tab.dataset.authTab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active);
  });
  authPanels.forEach((panel) => panel.classList.toggle("hidden", panel.dataset.authPanel !== tabName));
  authMessage.className = "auth-message hidden";
}

function setAccountMode(signup) {
  createAccountMode = signup;
  document.getElementById("authTitle").textContent = signup ? "Create your free account" : "Welcome back";
  document.getElementById("authSubtitle").textContent = signup ? "Choose a secure method to begin your AI learning journey." : "Choose a secure method to continue learning.";
  document.getElementById("accountQuestion").textContent = signup ? "Already have an account?" : "New to TomCodex Academy?";
  document.getElementById("accountModeBtn").textContent = signup ? "Log in" : "Create free account";
  document.querySelector("#credentialsForm .auth-primary-button").textContent = signup ? "Create account" : "Log in to academy";
}

function startOtpTimer() {
  clearInterval(otpInterval);
  let remaining = 30;
  resendOtpBtn.disabled = true;
  otpTimer.textContent = `Resend in ${remaining}s`;
  otpInterval = setInterval(() => {
    remaining -= 1;
    otpTimer.textContent = remaining > 0 ? `Resend in ${remaining}s` : "OTP can be resent";
    if (remaining <= 0) {
      clearInterval(otpInterval);
      resendOtpBtn.disabled = false;
    }
  }, 1000);
}

function sendOtp() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!/^\d{10}$/.test(phone)) {
    showMessage("Enter a valid 10-digit mobile number.", "error");
    return;
  }
  otpArea.classList.remove("hidden");
  startOtpTimer();
  showMessage("Demo OTP sent successfully. Use 123456 to continue.", "success");
  document.getElementById("otpInput").focus();
}

authTabs.forEach((tab) => tab.addEventListener("click", () => selectAuthTab(tab.dataset.authTab)));
document.getElementById("accountModeBtn").addEventListener("click", () => setAccountMode(!createAccountMode));
document.getElementById("togglePasswordBtn").addEventListener("click", (event) => {
  const password = document.getElementById("password");
  password.type = password.type === "password" ? "text" : "password";
  event.currentTarget.textContent = password.type === "password" ? "Show" : "Hide";
});
document.getElementById("forgotPasswordBtn").addEventListener("click", () => showMessage("Password reset requires a verified email service. This demo has not sent an email.", "info"));
document.getElementById("googleLoginBtn").addEventListener("click", () => showMessage("Google sign-in is ready for OAuth integration. No account data was sent in this demo.", "info"));
document.getElementById("credentialsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  showMessage(`${createAccountMode ? "Account creation" : "User ID login"} validated. Connecting a secure authentication backend will complete this flow.`, "success");
});
sendOtpBtn.addEventListener("click", sendOtp);
resendOtpBtn.addEventListener("click", sendOtp);
document.getElementById("phoneForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.getElementById("otpInput").value.trim() !== "123456") {
    showMessage("Incorrect demo OTP. Enter 123456.", "error");
    return;
  }
  showMessage("Phone number verified. Redirecting to the student dashboard...", "success");
  setTimeout(() => window.location.href = "dashboard.html", 800);
});

setAccountMode(createAccountMode);
