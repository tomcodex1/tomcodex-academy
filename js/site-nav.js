(function () {
  const SESSION_KEY = "tomcodex.authSession.v1";
  const IDENTITY_KEY = "tomcodex.authIdentity.v1";
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const pages = {
    "index.html": "Academy Home",
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
    ["course-flow.html", "Flow Automation", "Low-code automation and delivery"],
    ["course-apex.html", "Apex Development", "Code, triggers, testing, and integrations"],
    ["course-lwc.html", "Lightning Web Components", "Modern Salesforce user interfaces"],
    ["#", "Salesforce Integration", "REST APIs, Named Credentials, OAuth (Coming Soon)"],
    ["#", "Agentforce and AI", "Agents, Topics, Prompt engineering (Coming Soon)"],
    ["#", "Final POC Project", "Build the Student Success CRM project (Coming Soon)"]
  ];
  const studentGroups = [
    { label: "Learn", items: learnItems },
    { label: "AI Lab", items: [
      ["dashboard.html?tab=trainer", "AI Learning Mentor", "Explain doubts and concepts"],
      ["course-admin.html", "Check My Work", "Answer lab questions to verify your Salesforce setup"],
      ["course-admin.html", "AI Mastery Test", "15-question module evaluation"],
      ["interview.html", "AI Interviewer", "Technical and behavioral mock interviews"],
      ["code-review-ai.html", "Code Review AI", "Review Apex/LWC code and flows"],
      ["#", "Resume Project Generator", "Generate project resume points (Coming Soon)"]
    ] },
    { label: "Certification Prep", items: [
      ["#", "Salesforce Administrator", "60 MCQ simulator (Coming Soon)"],
      ["#", "Platform App Builder", "Certification simulator (Coming Soon)"],
      ["#", "Roadmap & Plan", "Certification schedule (Coming Soon)"]
    ] },
    { label: "Progress", items: [
      ["analytics.html", "Learning Analytics", "Consistency heatmap & metrics"],
      ["dashboard.html?tab=roadmap", "Skill Passport", "Verified credentials and passport portfolio"],
      ["gamification-dashboard.html", "Achievements", "Streaks, badges, and leaderboards"]
    ] }
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
  const dashboardHref = isStudent ? "/learner-dashboard" : isTutor ? "tutor-dashboard.html" : "access.html?next=dashboard";
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
      <a class="site-brand" href="${homeHref}" aria-label="TomCodeX AI Academy home">
        <img src="assets/tomcodex-logo.svg" alt="Tom Codex">
        <span><strong>TomCodeX</strong><small>${pageLabel}</small></span>
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
              ${isStudent ? `<div class="site-nav-plan-badge" style="padding: .65rem; border-bottom: 1px solid #e2e8f0; font-size: .7rem; font-weight: 850; color: #526276; text-transform: uppercase; letter-spacing: .05em;">Plan: ${authIdentity.tier === 'founder' ? '<span style="color:#087ea4">★ Founder Access</span>' : '<span style="color:#64748b">Free Starter</span>'}</div>` : ''}
              ${isStudent && authIdentity.tier !== 'founder' ? `<a href="pricing.html" style="background: linear-gradient(135deg, #d8ff5f, #a6ff00); color: #062c3a; text-align: center; font-weight: 800; border-radius: .4rem; padding: .5rem; margin: .5rem; display: block; box-shadow: 0 4px 12px rgba(166,255,0,.3);">Upgrade to Founder</a>` : ''}
              <a href="${dashboardHref}"><strong>Open dashboard</strong><small>${accountDetail}</small></a>
              ${isStudent ? `<a href="dashboard.html?tab=settings"><strong>Account Settings</strong><small>API Keys & Profile</small></a>` : ''}
              <button id="siteLogoutBtn" type="button" style="margin-top: .5rem;">Sign out</button>
            </div>
          </details>` : `<a class="site-login-link" href="access.html">${accountLabel}</a>`}
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
