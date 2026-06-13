(function () {
  const STORAGE_KEY = "tomcodex.personalizedPath.v1";
  const masteryKeys = {
    admin: "tomcodex.adminMasteryScores.v1",
    apex: "tomcodex.apexMasteryScores.v1",
    flow: "tomcodex.flowMasteryScores.v1",
    lwc: "tomcodex.lwcMasteryScores.v1",
    integration: "tomcodex.integrationMasteryScores.v1",
    agentforce: "tomcodex.agentforceMasteryScores.v1",
    poc: "tomcodex.pocMasteryScores.v1"
  };
  const goalLabels = {
    admin: "Salesforce Admin",
    developer: "Salesforce Developer",
    automation: "Automation Specialist",
    architect: "Solution Architect",
    career: "Interview and Delivery Ready"
  };
  const catalog = {
    foundations: { title: "Confirm Salesforce foundations", description: "Strengthen org navigation, data modeling, access, and platform vocabulary.", hours: 6, skill: "Admin", href: "course-admin.html" },
    security: { title: "Design secure user access", description: "Practice profiles, permission sets, sharing, CRUD, and field access.", hours: 8, skill: "Security", href: "course-admin.html" },
    reporting: { title: "Build decision-ready analytics", description: "Create reports and dashboards that prove business outcomes.", hours: 5, skill: "Analytics", href: "analytics.html" },
    flow: { title: "Deliver reliable Flow automation", description: "Build record-triggered and screen flows with tests and fault paths.", hours: 10, skill: "Flow", href: "course-flow.html" },
    apex: { title: "Master scalable Apex", description: "Develop bulk-safe classes, triggers, tests, and asynchronous processing.", hours: 14, skill: "Apex", href: "course-apex.html" },
    lwc: { title: "Build a production-ready LWC", description: "Connect a responsive component to Salesforce data and Apex.", hours: 12, skill: "LWC", href: "course-lwc.html" },
    integration: { title: "Connect Salesforce securely", description: "Practice REST, Named Credentials, callouts, and resilient error handling.", hours: 10, skill: "Integration", href: "course-integration.html" },
    agentforce: { title: "Configure Salesforce Agentforce", description: "Design autonomous AI agents, actions, system prompts, and custom topics.", hours: 10, skill: "Agentforce", href: "course-agentforce.html" },
    architecture: { title: "Defend a solution architecture", description: "Document tradeoffs across data, security, automation, scale, and integration.", hours: 12, skill: "Architecture", href: "dashboard.html" },
    project: { title: "Ship a portfolio capstone", description: "Combine your strongest skills in a complete Salesforce delivery.", hours: 16, skill: "Project", href: "course-poc.html" },
    interview: { title: "Prove your knowledge in interviews", description: "Practice scenario answers and turn weak responses into concise explanations.", hours: 6, skill: "Career", href: "interview.html" },
    review: { title: "Get implementation feedback", description: "Request a structured peer review and improve the solution from feedback.", hours: 4, skill: "Quality", href: "peer-review.html" }
  };
  const paths = {
    admin: ["foundations", "security", "flow", "reporting", "project", "interview"],
    developer: ["foundations", "apex", "lwc", "integration", "agentforce", "review", "project", "interview"],
    automation: ["foundations", "security", "flow", "apex", "agentforce", "review", "project"],
    architect: ["security", "flow", "apex", "integration", "agentforce", "architecture", "review", "interview"],
    career: ["foundations", "agentforce", "project", "review", "interview", "architecture"]
  };

  let state = loadState();

  function parse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function loadState() {
    const saved = parse(STORAGE_KEY, {});
    return {
      goal: paths[saved.goal] ? saved.goal : "developer",
      experience: ["beginner", "intermediate", "advanced"].includes(saved.experience) ? saved.experience : "beginner",
      weeklyHours: Math.min(20, Math.max(2, Number(saved.weeklyHours) || 5)),
      style: ["balanced", "project", "interview"].includes(saved.style) ? saved.style : "balanced",
      completed: Array.isArray(saved.completed) ? saved.completed : []
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function masterySummary() {
    return Object.entries(masteryKeys).reduce((summary, [track, key]) => {
      const scores = Object.values(parse(key, {})).filter((item) => item && typeof item === "object");
      summary[track] = scores.length ? Math.round(scores.reduce((total, item) => total + (Number(item.score) || 0), 0) / scores.length) : 0;
      return summary;
    }, {});
  }

  function progressSignals() {
    const mastery = masterySummary();
    const records = parse("tomcodex.learningRecords.v1", []);
    const interviews = parse("tomcodex.interviewHistory.v1", []);
    const dashboard = parse("salesforceMasterDashboard.v1", {});
    const activeMastery = Object.values(mastery).filter(Boolean);
    return {
      mastery,
      records: records.length,
      interviews: Array.isArray(interviews) ? interviews.length : 0,
      stage: Number(dashboard.selectedDay) || 1,
      readiness: activeMastery.length ? Math.round(activeMastery.reduce((sum, score) => sum + score, 0) / activeMastery.length) : 8
    };
  }

  function renderSignals(signals) {
    const activeTracks = Object.values(signals.mastery).filter(Boolean).length;
    const items = [
      ["Course mastery", `${activeTracks} active tracks`, activeTracks > 0],
      ["Learning activity", `${signals.records} recorded actions`, signals.records > 0],
      ["Dashboard roadmap", `Stage ${signals.stage} reached`, signals.stage > 1],
      ["Interview practice", `${signals.interviews} completed sessions`, signals.interviews > 0]
    ];
    document.getElementById("signalCount").textContent = items.filter(([, , active]) => active).length;
    document.getElementById("signalList").replaceChildren(...items.map(([label, value, active]) => {
      const row = document.createElement("div");
      row.className = "path-signal";
      const dot = document.createElement("i");
      if (!active) dot.style.background = "#94a3b8";
      const copy = document.createElement("div");
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      strong.textContent = label;
      small.textContent = value;
      copy.append(strong, small);
      row.append(dot, copy);
      return row;
    }));
  }

  function orderedMilestones(signals) {
    const items = paths[state.goal].map((id) => ({ id, ...catalog[id] }));
    const weakTrack = Object.entries(signals.mastery).filter(([, score]) => score > 0).sort((a, b) => a[1] - b[1])[0]?.[0];
    const weakId = weakTrack === "admin" ? "foundations" : weakTrack;
    if (weakId && items.some((item) => item.id === weakId)) {
      items.sort((a, b) => (a.id === weakId ? -1 : b.id === weakId ? 1 : 0));
    }
    if (state.experience === "advanced") items.sort((a, b) => (a.id === "foundations" ? 1 : b.id === "foundations" ? -1 : 0));
    if (state.style === "project") items.sort((a, b) => (a.id === "project" ? -1 : b.id === "project" ? 1 : 0));
    if (state.style === "interview") items.sort((a, b) => (a.id === "interview" ? -1 : b.id === "interview" ? 1 : 0));
    return items;
  }

  function renderInsights(signals, milestones) {
    const masteryEntries = Object.entries(signals.mastery).filter(([, score]) => score > 0).sort((a, b) => b[1] - a[1]);
    const strongest = masteryEntries[0];
    const weakest = masteryEntries[masteryEntries.length - 1];
    const insights = [
      ["Detected strength", strongest ? `${strongest[0].toUpperCase()} at ${strongest[1]}%` : "Start with guided foundations", strongest ? "Your path preserves momentum in this track." : "Complete a mastery test to improve future recommendations."],
      ["Priority gap", weakest ? `${weakest[0].toUpperCase()} at ${weakest[1]}%` : milestones[0].skill, weakest ? "The weakest measured track is moved earlier when relevant." : "This is the first skill required for your selected goal."]
    ];
    document.getElementById("gapInsights").innerHTML = insights.map(([label, title, detail]) => `<article class="path-insight"><span>${label}</span><strong>${title}</strong><p>${detail}</p></article>`).join("");
  }

  function renderPath() {
    const signals = progressSignals();
    const milestones = orderedMilestones(signals);
    const completed = milestones.filter((item) => state.completed.includes(item.id)).length;
    const progress = Math.round(completed / milestones.length * 100);
    const hoursLeft = milestones.filter((item) => !state.completed.includes(item.id)).reduce((sum, item) => sum + item.hours, 0);
    const weeksLeft = Math.max(1, Math.ceil(hoursLeft / state.weeklyHours));
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + weeksLeft * 7);
    const next = milestones.find((item) => !state.completed.includes(item.id));

    renderSignals(signals);
    renderInsights(signals, milestones);
    document.getElementById("pathTitle").textContent = `${goalLabels[state.goal]} path`;
    document.getElementById("pathSummary").textContent = `${milestones.length} adaptive milestones at ${state.weeklyHours} hours per week. Recommendations update as your academy progress changes.`;
    document.getElementById("readinessScore").textContent = `${signals.readiness}%`;
    document.getElementById("pathProgressStat").textContent = `${progress}%`;
    document.getElementById("weeklyPaceStat").textContent = `${state.weeklyHours} hrs`;
    document.getElementById("milestoneStat").textContent = milestones.length;
    document.getElementById("finishStat").textContent = finishDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    document.getElementById("pathProgressText").textContent = `${completed} of ${milestones.length} complete`;
    document.getElementById("pathProgressBar").style.width = `${progress}%`;
    document.getElementById("pathProgressBar").setAttribute("aria-valuenow", progress);
    document.getElementById("nextActionText").textContent = next ? `Recommended next: ${next.title}. Estimated path time remaining: ${weeksLeft} week${weeksLeft === 1 ? "" : "s"}.` : "Path complete. Rebuild it with a new goal to keep growing.";

    const list = document.getElementById("milestoneList");
    list.replaceChildren(...milestones.map((item, index) => {
      const done = state.completed.includes(item.id);
      const card = document.createElement("article");
      card.className = `milestone-card${done ? " done" : item.id === next?.id ? " current" : ""}`;
      const label = document.createElement("label");
      label.className = "milestone-check";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = done;
      checkbox.setAttribute("aria-label", `Mark ${item.title} complete`);
      checkbox.addEventListener("change", () => {
        state.completed = checkbox.checked ? [...new Set([...state.completed, item.id])] : state.completed.filter((id) => id !== item.id);
        saveState();
        if (checkbox.checked) window.TomCodexLearning?.record("task", 20, `Completed personalized milestone: ${item.title}`);
        renderPath();
      });
      label.append(checkbox);
      const body = document.createElement("div");
      body.innerHTML = `<h3>${index + 1}. ${item.title}</h3><p>${item.description}</p><div class="milestone-meta"><span>${item.skill}</span><span>${item.hours} hours</span><span>${state.style} plan</span></div>`;
      const action = document.createElement("a");
      action.className = "milestone-action";
      action.href = item.href;
      action.textContent = done ? "Review milestone →" : "Start milestone →";
      card.append(label, body, action);
      return card;
    }));
  }

  function initializeForm() {
    const form = document.getElementById("pathPreferencesForm");
    document.getElementById("pathGoal").value = state.goal;
    document.getElementById("experienceLevel").value = state.experience;
    document.getElementById("weeklyHours").value = state.weeklyHours;
    document.querySelector(`input[name="learningStyle"][value="${state.style}"]`).checked = true;
    document.getElementById("weeklyHoursValue").textContent = `${state.weeklyHours} hours`;
    document.getElementById("weeklyHours").addEventListener("input", (event) => {
      document.getElementById("weeklyHoursValue").textContent = `${event.target.value} hours`;
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      state.goal = document.getElementById("pathGoal").value;
      state.experience = document.getElementById("experienceLevel").value;
      state.weeklyHours = Number(document.getElementById("weeklyHours").value);
      state.style = document.querySelector('input[name="learningStyle"]:checked').value;
      saveState();
      renderPath();
      document.getElementById("recommendedPath").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  initializeForm();
  renderPath();
})();
