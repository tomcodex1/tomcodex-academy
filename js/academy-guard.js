(function () {
  let session = {};
  try { session = JSON.parse(localStorage.getItem("tomcodex.authSession.v1")) || {}; } catch {}
  if (session.role !== "student" && session.role !== "tutor") {
    window.location.replace("index.html");
  }
})();
