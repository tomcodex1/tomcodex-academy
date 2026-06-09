(function () {
  fetch("/api/auth-session")
    .then((response) => {
      if (!response.ok) throw new Error("Authentication required");
      return response.json();
    })
    .then((result) => {
      if (!result.authenticated || !["student", "tutor"].includes(result.role)) throw new Error("Authentication required");
      localStorage.setItem("tomcodex.authSession.v1", JSON.stringify({ role: result.role, method: "server-session", identifier: result.identity?.email, signedInAt: new Date().toISOString() }));
      localStorage.setItem("tomcodex.authIdentity.v1", JSON.stringify(result.identity || {}));
    })
    .catch(() => {
      localStorage.removeItem("tomcodex.authSession.v1");
      localStorage.removeItem("tomcodex.authIdentity.v1");
      window.location.replace("index.html");
    });
})();
