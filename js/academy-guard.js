(function () {
  // Hide page immediately to prevent flash of protected content before auth check
  document.documentElement.style.visibility = "hidden";

  fetch("/api/auth-session")
    .then((response) => {
      if (!response.ok) throw new Error("Authentication required");
      return response.json();
    })
    .then((result) => {
      if (!result.authenticated || !["student", "tutor"].includes(result.role)) throw new Error("Authentication required");
      localStorage.setItem("tomcodex.authSession.v1", JSON.stringify({ role: result.role, method: "server-session", identifier: result.identity?.email, signedInAt: new Date().toISOString() }));
      localStorage.setItem("tomcodex.authIdentity.v1", JSON.stringify(result.identity || {}));
      if (result.identity) {
        localStorage.setItem("tomcodex.auth.user.v1", JSON.stringify({
          userId: result.identity.id,
          name: result.identity.name,
          tier: result.identity.tier || "free",
          upgradedAt: result.identity.upgradedAt || null
        }));
      }
      // Auth confirmed — reveal page
      document.documentElement.style.visibility = "";
    })
    .catch(() => {
      localStorage.removeItem("tomcodex.authSession.v1");
      localStorage.removeItem("tomcodex.authIdentity.v1");
      localStorage.removeItem("tomcodex.auth.user.v1");
      window.location.replace("access.html");
    });
})();
