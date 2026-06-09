(function () {
  const SESSION_KEY = "tomcodex.authSession.v1";
  const IDENTITY_KEY = "tomcodex.authIdentity.v1";
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const pages = {
    "index.html": "Login",
    "academy-home.html": "Academy Home",
    "dashboard.html": "Student Dashboard",
    "tutor-dashboard.html": "Tutor Dashboard",
    "course-admin.html": "Admin Course",
    "course-apex.html": "Apex Course",
    "course-flow.html": "Flow Course",
    "course-lwc.html": "LWC Course",
    "personalized-paths.html": "My Learning Path",
    "interview.html": "AI Interviewer",
    "code-review-ai.html": "Code Review AI",
    "study-groups.html": "Study Groups",
    "discussion-forums.html": "Forums",
    "peer-review.html": "Peer Review",
    "analytics.html": "Analytics",
    "analytics-enhanced.html": "Enhanced Analytics",
    "gamification-dashboard.html": "Achievements",
    "access.html": "Login"
  };
  const learnItems = [
    ["course-admin.html", "Salesforce Admin", "Administration, security, data, and reporting"],
    ["course-apex.html", "Apex Development", "Code, triggers, testing, and integrations"],
    ["course-flow.html", "Salesforce Flow", "Low-code automation and delivery"],
    ["course-lwc.html", "Lightning Web Components", "Modern Salesforce user interfaces"]
  ];
  const studentGroups = [
    { label: "Learn", items: learnItems },
    { label: "AI Tools", items: [["personalized-paths.html", "My Learning Path", "Adaptive milestones and skill gaps"], ["interview.html", "AI Interviewer", "Technical and behavioral practice"], ["code-review-ai.html", "Code Review AI", "Review Salesforce implementations"]] },
    { label: "Community", items: [["study-groups.html", "Study Groups", "Learn with focused groups"], ["discussion-forums.html", "Discussion Forums", "Ask questions and share knowledge"], ["peer-review.html", "Peer Review", "Get feedback from other learners"]] },
    { label: "Progress", items: [["analytics.html", "Learning Analytics", "Activity, growth, and interview trends"], ["analytics-enhanced.html", "Skill Insights", "Detailed progress and recommendations"], ["gamification-dashboard.html", "Achievements", "Points, streaks, and badges"]] }
  ];
  const tutorGroups = [
    { label: "Curriculum", items: learnItems },
    { label: "Review Tools", items: [["code-review-ai.html", "AI Code Review", "Evaluate Salesforce implementations"], ["peer-review.html", "Peer Review", "Provide structured technical feedback"], ["discussion-forums.html", "Discussion Forums", "Support curriculum questions"]] }
  ];

  const routeName = location.pathname.split("/").pop() || "index.html";
  const routeAliases = { "learner-dashboard": "dashboard.html", "tutor-dashboard": "tutor-dashboard.html", "tutor-catalog": "tutor-dashboard.html" };
  const current = routeAliases[routeName] || routeName;
  const pageLabel = pages[current] || "AI Academy";
  let authSession = {};
  let authIdentity = {};
  try { authSession = JSON.parse(localStorage.getItem(SESSION_KEY)) || {}; } catch {}
  try { authIdentity = JSON.parse(localStorage.getItem(IDENTITY_KEY)) || {}; } catch {}
  const role = authSession.role;
  const isStudent = role === "student";
  const isTutor = role === "tutor";
  const homeHref = role ? "academy-home.html" : "index.html";
  const dashboardHref = isStudent ? "/learner-dashboard" : isTutor ? "tutor-dashboard.html" : "index.html?next=dashboard";
  const dashboardLabel = isStudent ? "Student Dashboard" : isTutor ? "Tutor Dashboard" : "Sign in to Dashboard";
  const groups = isTutor ? tutorGroups : studentGroups;
  const accountName = isStudent ? authIdentity.name || "Student" : isTutor ? String(authIdentity.email || authSession.identifier || "Tutor").split("@")[0] : "";
  const accountLabel = escapeHtml(isStudent ? `Student: ${accountName}` : isTutor ? `Tutor: ${accountName}` : "Login / Account");
  const accountDetail = escapeHtml(authIdentity.email || authSession.identifier || "Signed-in account");
  if (!role && (current === "index.html" || current === "access.html")) return;
  const oldHeader = document.querySelector("body > header");
  if (oldHeader) oldHeader.remove();

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header-main">
      <a class="site-brand" href="${homeHref}" aria-label="TomCodex AI Academy home">
        <img src="assets/tomcodex-logo.svg" alt="Tom Codex">
        <span><strong>AI Academy</strong><small>${pageLabel}</small></span>
      </a>
      <button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="siteNavigation">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><b>Menu</b>
      </button>
      <nav id="siteNavigation" class="site-navigation" aria-label="Main navigation">
        <a class="site-direct-link" href="${homeHref}">${role ? "Academy Home" : "Login"}</a>
        <a class="site-direct-link" href="${dashboardHref}" data-dashboard-link>${dashboardLabel}</a>
        ${groups.map((group) => `
          <details class="site-nav-group">
            <summary>${group.label}<span aria-hidden="true">&#9662;</span></summary>
            <div class="site-nav-menu">
              ${group.items.map(([href, label, detail]) => `<a href="${href}"><strong>${label}</strong><small>${detail}</small></a>`).join("")}
            </div>
          </details>`).join("")}
        ${role ? `
          <details class="site-nav-group site-account-group">
            <summary class="site-login-link">${accountLabel}<span aria-hidden="true">&#9662;</span></summary>
            <div class="site-nav-menu site-account-menu">
              <a href="${dashboardHref}"><strong>Open ${isTutor ? "tutor" : "student"} dashboard</strong><small>${accountDetail}</small></a>
              <button id="siteLogoutBtn" type="button">Sign out</button>
            </div>
          </details>` : `<a class="site-login-link" href="index.html">${accountLabel}</a>`}
      </nav>
    </div>
  `;
  document.body.prepend(header);

  const navigation = header.querySelector(".site-navigation");
  const toggle = header.querySelector(".site-menu-toggle");
  toggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  header.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || ((current === "dashboard.html" || current === "tutor-dashboard.html") && link.hasAttribute("data-dashboard-link"))) link.setAttribute("aria-current", "page");
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  header.querySelectorAll(".site-nav-group").forEach((group) => {
    if (group.querySelector('[aria-current="page"]')) group.classList.add("current-group");
  });

  header.querySelector("#siteLogoutBtn")?.addEventListener("click", async () => {
    try { await fetch("/api/logout", { method: "POST" }); } catch {}
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(IDENTITY_KEY);
    window.location.href = "index.html";
  });

  document.addEventListener("click", (event) => {
    header.querySelectorAll(".site-nav-group[open]").forEach((group) => {
      if (!group.contains(event.target)) group.removeAttribute("open");
    });
  });
})();
