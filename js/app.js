const STORAGE_KEY = "salesforceMasterDashboard.v1";
const ENROLLMENTS_KEY = "tomcodex.courseEnrollments.v1";
const defaultState = {
  selectedDay: 1,
  activeTab: "dashboard",
  completedTasks: {},
  completedHabits: [],
  generatedStages: []
};

let state;

const stats = [
  { label: "Pathways", value: "24+", detail: "Continuously expanding" },
  { label: "Access", value: "Unlimited", detail: "No fixed day limit" },
  { label: "Current", value: "", detail: "" },
  { label: "Growth", value: "Career-long", detail: "Before and after placement" }
];

const skillMeters = [
  ["Admin Foundation", 12],
  ["Security", 8],
  ["Flow Automation", 5],
  ["Apex", 3],
  ["LWC", 2],
  ["Integration", 1],
  ["DevOps", 1]
];

const dailyChecklist = [
  "Learn concept",
  "Build in Salesforce org",
  "Write notes",
  "Answer recall questions",
  "Explain like interview",
  "Update mistake log"
];

const habits = [
  "Wake up on time",
  "15 minutes meditation",
  "Walking / fitness",
  "Salesforce deep work",
  "Hands-on org practice",
  "Notes / flashcards",
  "Interview speaking practice",
  "English communication practice",
  "No distraction block",
  "Sleep discipline"
];

const studyBlocks = [
  "30 min: Revise yesterday",
  "2 hr: Learn new concept",
  "2 hr: Hands-on in org",
  "1 hr: Notes making",
  "1 hr: Interview questions",
  "30 min: Explain like interview"
];

const answerModes = [
  "Simple Mode",
  "Interview Mode",
  "Project Mode",
  "Code Mode",
  "Quiz Mode",
  "Correction Mode"
];

const trainerPrompt = `You are Zentom AI, Vijay's personal Salesforce tutor.

Teach Salesforce from scratch through placement and continue supporting real workplace delivery, certifications, promotions, architecture, and new Salesforce releases.

Answer every doubt in this format:
1. Simple meaning
2. Why it matters in Salesforce
3. Real Salesforce example
4. SentinelFlow project example
5. Common beginner mistake
6. Interview answer in 60 seconds
7. Hands-on task inside Salesforce org
8. 5 recall questions
9. One mini assignment
10. Confidence score: Weak / Medium / Strong

Use simple English. Use Tanglish only when a concept is difficult. Adapt to the student's progress, give instant feedback, and act as the complete AI learning guide.`;

const projectOutputs = [
  "Incident__c object",
  "Incident fields",
  "Permission sets",
  "Validation rules",
  "Critical incident flow",
  "Reports and dashboard",
  "IncidentService Apex class",
  "Incident trigger handler",
  "Test classes",
  "LWC command center",
  "REST integration",
  "Deployment package"
];

const phases = [
  { phase: 1, area: "Org Basics", level: "Admin", goal: "Navigate Salesforce confidently", topics: "Org, Developer Edition, Setup, App Launcher, Object Manager, Quick Find", practice: "Explore your Developer Edition org" },
  { phase: 2, area: "Data Model", level: "Admin", goal: "Understand how Salesforce stores data", topics: "Object, Field, Record, Tab, App, Standard Objects, Custom Objects", practice: "Create Incident__c object" },
  { phase: 3, area: "Relationships", level: "Admin", goal: "Connect objects properly", topics: "Lookup, Master-Detail, Junction Object, Related List, Roll-Up Summary", practice: "Create Account to Incident relationship" },
  { phase: 4, area: "UI Customization", level: "Admin", goal: "Control how users see records", topics: "Page Layout, Compact Layout, Lightning Record Page, Dynamic Forms, List Views", practice: "Create Admin, Operator, Viewer layouts" },
  { phase: 5, area: "Security Model", level: "Admin", goal: "Control access safely", topics: "Users, Profiles, Permission Sets, Roles, OWD, Sharing Rules, FLS", practice: "Create SentinelFlow permission sets" },
  { phase: 6, area: "Data Management", level: "Admin", goal: "Import, export, and clean data", topics: "Data Import Wizard, Data Loader, Duplicate Rules, Validation, Backup", practice: "Import 20 Incident records" },
  { phase: 7, area: "Formula & Validation", level: "Admin", goal: "Build logic without code", topics: "Formula Fields, IF, CASE, ISBLANK, ISPICKVAL, Validation Rules", practice: "Create Incident Age formula" },
  { phase: 8, area: "Flow Builder", level: "Admin", goal: "Automate business process", topics: "Screen Flow, Record-Triggered Flow, Scheduled Flow, Decision, Loop, Fault Path", practice: "Alert admin for Critical Incident" },
  { phase: 9, area: "Reports & Dashboards", level: "Admin", goal: "Analyze Salesforce data", topics: "Report Types, Filters, Charts, Dashboard Components", practice: "Build Incident Dashboard" },
  { phase: 10, area: "App Builder", level: "Admin", goal: "Create complete Salesforce app", topics: "Custom App, Navigation Items, Home Page, Record Page", practice: "Build SentinelFlow App" },
  { phase: 11, area: "SOQL", level: "Developer", goal: "Retrieve Salesforce data", topics: "SELECT, WHERE, ORDER BY, LIMIT, Relationship Query", practice: "Query Incident records" },
  { phase: 12, area: "Apex Basics", level: "Developer", goal: "Write backend logic", topics: "Class, Method, Variables, List, Set, Map, DML", practice: "Create IncidentService class" },
  { phase: 13, area: "Apex Triggers", level: "Developer", goal: "Run code automatically", topics: "Before/After Trigger, Context Variables, Handler Pattern", practice: "Auto-calculate incident risk score" },
  { phase: 14, area: "Apex Testing", level: "Developer", goal: "Deploy code with confidence", topics: "@isTest, Test Data, startTest, stopTest, System.assert", practice: "Write test class" },
  { phase: 15, area: "LWC", level: "Developer", goal: "Build modern Salesforce UI", topics: "HTML, JS, XML, @api, @wire, Events, Toast", practice: "Build Incident Command Center" },
  { phase: 16, area: "Integration", level: "Developer", goal: "Connect Salesforce with external systems", topics: "REST, SOAP, Named Credentials, Apex Callouts, JSON", practice: "Send Incident data to external API" },
  { phase: 17, area: "DevOps", level: "Developer", goal: "Deploy like a real developer", topics: "VS Code, Salesforce CLI, SFDX, GitHub, Package.xml", practice: "Deploy metadata to another org" },
  { phase: 18, area: "Advanced Salesforce", level: "Architect", goal: "Design scalable solutions", topics: "Custom Metadata, Queueable, Batch, Shield, Experience Cloud", practice: "Metadata-driven incident rule engine" },
  { phase: 19, area: "Interview Prep", level: "Career", goal: "Become interview-ready", topics: "Admin, Apex, Trigger, Flow, LWC, Security", practice: "Daily mock interview" },
  { phase: 20, area: "Capstone Project", level: "Career", goal: "Build portfolio product", topics: "SentinelFlow Incident Intelligence App", practice: "Build complete app end-to-end" },
  { phase: 21, area: "Workplace Delivery", level: "Career", goal: "Perform confidently after placement", topics: "User Stories, Estimation, Debugging, Documentation, Code Reviews", practice: "Deliver a simulated sprint feature" },
  { phase: 22, area: "Certification Growth", level: "Career", goal: "Keep advancing your credentials", topics: "Admin, Platform Developer, App Builder, Architect certifications", practice: "Build a personalized certification plan" },
  { phase: 23, area: "Solution Architecture", level: "Architect", goal: "Design enterprise-grade Salesforce solutions", topics: "Tradeoffs, Scale, Security, Integration, Data Strategy", practice: "Create and defend a solution design" },
  { phase: 24, area: "Continuous Release Learning", level: "Career", goal: "Stay current throughout your career", topics: "Salesforce Releases, New Features, Deprecations, Best Practices", practice: "Review each release and update a live project" }
];

const days = [
  [1, "Org Navigation", "Setup, App Launcher, Object Manager", "Explore your org"],
  [2, "Objects & Fields", "Standard/custom objects and field types", "Create Incident__c"],
  [3, "Relationships", "Lookup, Master-Detail, Related List", "Account → Incident"],
  [4, "Page Layouts", "Layouts, Compact Layout, Record Page", "Customize Incident page"],
  [5, "Profiles & Users", "User, Profile, access basics", "Check your profile"],
  [6, "Permission Sets", "Object and field permission", "Create Incident Manager"],
  [7, "Week 1 Review", "Explain admin foundation", "Mini interview"],
  [8, "Formula Fields", "IF, CASE, TODAY, NOW", "Incident Age formula"],
  [9, "Validation Rules", "Required logic and errors", "Critical validation"],
  [10, "Screen Flow", "Screen, input, create record", "Create Incident flow"],
  [11, "Record Flow", "Create/update automation", "Auto-set Open status"],
  [12, "Scheduled Flow", "Time-based automation", "Daily critical check"],
  [13, "Reports", "Filters and grouping", "Incident report"],
  [14, "Dashboards", "Charts and dashboard filters", "Incident dashboard"],
  [15, "SOQL", "SELECT, WHERE, ORDER BY", "Query Incident records"],
  [16, "Apex Basics", "Class, method, variables", "IncidentService"],
  [17, "Collections", "List, Set, Map", "Handle records"],
  [18, "DML & SOQL", "Insert, update, query", "CRUD in Apex"],
  [19, "Triggers", "Before/After triggers", "Incident trigger"],
  [20, "Trigger Handler", "Pattern and bulkification", "Handler class"],
  [21, "Test Class", "@isTest and asserts", "Test IncidentService"],
  [22, "LWC Basics", "HTML, JS, XML", "Incident card"],
  [23, "LWC + Apex", "Wire and imperative Apex", "Show incident list"],
  [24, "Datatable", "Table, action buttons", "Incident table"],
  [25, "REST Integration", "Named Credential, callout", "Send Incident API"],
  [26, "Platform Events", "Event-driven design", "Publish Critical event"],
  [27, "VS Code & CLI", "SFDX, authorize org", "Connect org"],
  [28, "Deployment", "Package.xml, deploy, validate", "Deploy metadata"],
  [29, "Interview Prep", "Scenario questions", "Mock interview"],
  [30, "Portfolio Project", "End-to-end revision", "Explain SentinelFlow"],
  [31, "First Project Sprint", "User stories, estimation, delivery", "Deliver a simulated sprint feature"],
  [32, "Production Debugging", "Logs, root-cause analysis, fixes", "Resolve a production-style issue"],
  [33, "Code Review Practice", "Quality, maintainability, security", "Review and improve a pull request"],
  [34, "Certification Planning", "Role-based certification pathways", "Create your next certification plan"],
  [35, "Solution Architecture", "Scale, tradeoffs, integration, security", "Present an architecture design"],
  [36, "Release Readiness", "New features and platform changes", "Apply a release update to your project"]
];

const continuousStageTemplates = [
  ["Workplace Scenario Lab", "Real stakeholder requests, constraints, and tradeoffs", "Solve a new workplace Salesforce scenario"],
  ["Advanced Project Upgrade", "Performance, security, maintainability, and scale", "Upgrade an existing portfolio project"],
  ["Certification Deep Dive", "Advanced exam domains and scenario questions", "Complete a focused certification practice set"],
  ["Release Feature Lab", "Current Salesforce capabilities and best practices", "Test and document a platform feature"],
  ["Architecture Challenge", "Data, automation, integration, and security design", "Create an architecture decision record"],
  ["Career Growth Review", "Impact, communication, leadership, and specialization", "Update your professional growth plan"]
];

state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const generatedStages = Array.isArray(stored?.generatedStages) ? stored.generatedStages : [];
    generatedStages.forEach((stage) => {
      if (Array.isArray(stage) && !days.some(([number]) => number === stage[0])) days.push(stage);
    });
    const selectedDay = Number(stored?.selectedDay);
    return {
      ...defaultState,
      ...stored,
      selectedDay: selectedDay >= 1 && selectedDay <= days.length ? selectedDay : defaultState.selectedDay,
      completedTasks: stored?.completedTasks || {},
      completedHabits: Array.isArray(stored?.completedHabits) ? stored.completedHabits : [],
      generatedStages
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The dashboard remains usable when browser storage is unavailable.
  }
}

function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function getSelectedDay() {
  return days.find(([day]) => day === state.selectedDay) || days[0];
}

function getMission() {
  const [day, focus, topics, practice] = getSelectedDay();
  return {
    day,
    title: focus,
    trainerNote: `Focus on ${focus}. Learn the concepts, complete the hands-on task, and explain the result without reading notes.`,
    mustFinish: [
      `Learn: ${topics}`,
      `Hands-on: ${practice}`,
      "Write concise notes and one flashcard",
      "Explain the topic like an interview answer",
      "Record one mistake or lesson learned"
    ],
    recall: [
      `What is the purpose of ${focus}?`,
      `Explain the key ideas in: ${topics}.`,
      `How would you complete this task: ${practice}?`,
      `What beginner mistake should you avoid in ${focus}?`,
      `How does ${focus} help the SentinelFlow project?`
    ]
  };
}

function renderStats() {
  const grid = document.getElementById("statsGrid");
  const mission = getMission();
  stats[2] = { label: "Current", value: `Stage ${mission.day}`, detail: mission.title };
  grid.replaceChildren();
  stats.forEach((item) => {
    const card = createElement("div", "stat-card");
    card.append(
      createElement("strong", "", item.value),
      createElement("span", "", item.label),
      createElement("p", "tiny-text", item.detail)
    );
    grid.append(card);
  });
}

function updateTodayProgress() {
  const checks = [...document.querySelectorAll(".today-check")];
  const completed = checks.filter((c) => c.checked).length;
  const progress = Math.round((completed / checks.length) * 100) || 0;
  document.getElementById("todayProgressText").textContent = `${progress}%`;
  const progressBar = document.getElementById("todayProgressBar");
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

function renderTodayMission() {
  const mission = getMission();
  const completedTasks = state.completedTasks[mission.day] || [];
  document.getElementById("todayTitle").textContent = `Current Mission: Stage ${mission.day} - ${mission.title}`;
  document.getElementById("trainerNote").textContent = mission.trainerNote;

  const tasks = document.getElementById("todayTasks");
  tasks.replaceChildren();
  mission.mustFinish.forEach((task, index) => {
    const label = createElement("label", "task-item");
    const checkbox = createElement("input", "today-check");
    checkbox.type = "checkbox";
    checkbox.checked = completedTasks.includes(index);
    label.classList.toggle("done", checkbox.checked);
    label.append(checkbox, createElement("span", "", task));
    checkbox.addEventListener("change", () => {
      label.classList.toggle("done", checkbox.checked);
      state.completedTasks[mission.day] = [...document.querySelectorAll(".today-check")]
        .map((check, taskIndex) => (check.checked ? taskIndex : null))
        .filter((taskIndex) => taskIndex !== null);
      saveState();
      if (checkbox.checked) window.TomCodexLearning?.record("task", 3, `${mission.title}: ${task}`);
      updateTodayProgress();
    });
    tasks.append(label);
  });

  const questions = document.getElementById("recallQuestions");
  questions.replaceChildren();
  mission.recall.forEach((question, index) => {
    const item = createElement("div");
    item.append(
      createElement("span", "small-label", `Question ${index + 1}`),
      document.createElement("br"),
      document.createTextNode(question)
    );
    questions.append(item);
  });
  updateTodayProgress();
}

function renderSkillMeters() {
  const list = document.getElementById("skillMeters");
  if (!list) return;
  
  let passport = {};
  try { passport = JSON.parse(localStorage.getItem("tomcodex.skillPassport.v1")) || {}; } catch {}
  
  let adminFoundationScore = 12;
  if (passport["salesforce-platform-foundations"]?.status === "Verified") {
    adminFoundationScore = passport["salesforce-platform-foundations"]?.score || 100;
  }
  if (passport["salesforce-object-modeling"]?.status === "Verified") {
    adminFoundationScore = Math.max(adminFoundationScore, passport["salesforce-object-modeling"]?.score || 100);
  }
  
  let securityScore = 8;
  if (passport["salesforce-security-foundations"]?.status === "Verified") {
    securityScore = passport["salesforce-security-foundations"]?.score || 100;
  }
  
  const dynamicSkillMeters = [
    ["Admin Foundation", adminFoundationScore],
    ["Security", securityScore],
    ["Flow Automation", 5],
    ["Apex", 3],
    ["LWC", 2],
    ["Integration", 1],
    ["DevOps", 1]
  ];
  
  list.innerHTML = "";
  dynamicSkillMeters.forEach(([skill, value]) => {
    list.innerHTML += `
      <div>
        <div class="meter-label"><span>${skill}</span><strong>${value}%</strong></div>
        <div class="meter-track"><div class="meter-fill" style="width:${value}%"></div></div>
      </div>`;
  });
}

function renderSimpleList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  items.forEach((item) => {
    list.innerHTML += `<div>${item}</div>`;
  });
}

function updateHabitProgress() {
  const checks = [...document.querySelectorAll(".habit-check")];
  const completed = checks.filter((c) => c.checked).length;
  const progress = Math.round((completed / checks.length) * 100) || 0;
  document.getElementById("habitProgressText").textContent = `${progress}%`;
  const progressBar = document.getElementById("habitProgressBar");
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

function renderHabits() {
  const wrap = document.getElementById("habitTracker");
  wrap.replaceChildren();
  habits.forEach((habit, index) => {
    const label = createElement("label", "task-item");
    const checkbox = createElement("input", "habit-check");
    checkbox.type = "checkbox";
    checkbox.checked = state.completedHabits.includes(index);
    label.classList.toggle("done", checkbox.checked);
    label.append(checkbox, createElement("span", "", habit));
    checkbox.addEventListener("change", () => {
      label.classList.toggle("done", checkbox.checked);
      state.completedHabits = [...document.querySelectorAll(".habit-check")]
        .map((check, habitIndex) => (check.checked ? habitIndex : null))
        .filter((habitIndex) => habitIndex !== null);
      saveState();
      if (checkbox.checked) window.TomCodexLearning?.record("habit", 1, habit);
      updateHabitProgress();
    });
    wrap.append(label);
  });
  updateHabitProgress();
}

function renderProjectOutputs() {
  const wrap = document.getElementById("projectOutputs");
  wrap.innerHTML = "";
  projectOutputs.forEach((item, index) => {
    wrap.innerHTML += `<div class="output-item"><strong>${index + 1}.</strong> ${item}</div>`;
  });
}

function renderModes() {
  const wrap = document.getElementById("answerModes");
  wrap.innerHTML = "";
  answerModes.forEach((mode) => {
    wrap.innerHTML += `<div class="mode-item">${mode}</div>`;
  });
}

function renderPhases() {
  const filter = document.getElementById("phaseFilter").value;
  const search = document.getElementById("phaseSearch").value.toLowerCase();
  const wrap = document.getElementById("phaseCards");
  wrap.innerHTML = "";

  phases
    .filter((p) => filter === "All" || p.level === filter)
    .filter((p) => `${p.area} ${p.goal} ${p.topics} ${p.practice} ${p.level}`.toLowerCase().includes(search))
    .forEach((p) => {
      wrap.innerHTML += `
        <div class="phase-card">
          <span class="level-badge">${p.level}</span>
          <h3>Phase ${p.phase}: ${p.area}</h3>
          <p><strong>Goal:</strong> ${p.goal}</p>
          <p><strong>Topics:</strong> ${p.topics}</p>
          <p><strong>Practice:</strong> ${p.practice}</p>
        </div>`;
    });
}

function renderDays() {
  const tbody = document.getElementById("daysTable");
  tbody.innerHTML = "";
  days.forEach(([day, focus, topic, task]) => {
    tbody.innerHTML += `<tr><td><strong>Stage ${day}</strong></td><td>${focus}</td><td>${topic}</td><td>${task}</td></tr>`;
  });
}

function setupDoubtBox() {
  document.getElementById("trainerPrompt").textContent = trainerPrompt;
  const speedModeSelect = document.getElementById("speedModeSelect");
  const speedModeDescription = document.getElementById("speedModeDescription");
  const speedDescriptions = {
    normal: "Balanced explanations with examples, practice, and interview guidance.",
    flash: "Fast answers for doubt clearing, quick recall, and short interview responses.",
    deep: "Detailed trainer-style explanations, project guidance, practice, and recall."
  };
  speedModeSelect.addEventListener("change", () => {
    speedModeDescription.textContent = speedDescriptions[speedModeSelect.value];
  });

  document.getElementById("askTrainerBtn").addEventListener("click", async () => {
    const topic = document.getElementById("topicSelect").value;
    const mode = document.getElementById("modeSelect").value;
    const speedMode = speedModeSelect.value;
    const doubt = document.getElementById("doubtInput").value.trim();
    const answer = document.getElementById("mockAnswer");

    if (!doubt) {
      answer.classList.remove("hidden");
      answer.textContent = "Please type one Salesforce doubt first.";
      return;
    }

    window.TomCodexLearning?.record("tutor", 2, `${topic}: ${doubt}`);
    answer.classList.remove("hidden");
    answer.textContent = "Zentom AI is preparing your answer...";
    const result = await window.TomCodexAI.askTrainer({ topic, answerMode: mode, speedMode, doubt });
    if (!result.connected) {
      answer.replaceChildren(
        createElement("strong", "", "Zentom AI is offline"),
        createElement("p", "", result.error),
        createElement("p", "", "Zentom AI is temporarily unavailable. Please try again after the service is connected.")
      );
      return;
    }
    const heading = createElement("strong", "", `${speedModeSelect.options[speedModeSelect.selectedIndex].text} Response`);
    const bodyContainer = createElement("div", "rich-text-content");
    answer.replaceChildren(heading, bodyContainer);
    window.TomCodexAI.typeWriterEffect(bodyContainer, result.answer);
  });
}

function createLabeledParagraph(label, value) {
  const paragraph = createElement("p");
  paragraph.append(createElement("b", "", label), document.createTextNode(` ${value}`));
  return paragraph;
}

function setupDayNavigation() {
  const select = document.getElementById("daySelect");
  const appendStageOption = ([day, focus]) => {
    const option = createElement("option", "", `Stage ${day}: ${focus}`);
    option.value = day;
    select.append(option);
  };
  days.forEach(appendStageOption);
  select.value = state.selectedDay;

  const generateNextStage = () => {
    const stageNumber = days.length + 1;
    const template = continuousStageTemplates[(stageNumber - 37) % continuousStageTemplates.length];
    const stage = [stageNumber, ...template];
    days.push(stage);
    state.generatedStages.push(stage);
    appendStageOption(stage);
    renderDays();
    return stageNumber;
  };

  const setDay = (day) => {
    const previousStage = state.selectedDay;
    state.selectedDay = Math.min(days.length, Math.max(1, Number(day)));
    saveState();
    select.value = state.selectedDay;
    document.getElementById("previousDayBtn").disabled = state.selectedDay === 1;
    const nextButton = document.getElementById("nextDayBtn");
    nextButton.disabled = false;
    nextButton.textContent = state.selectedDay === days.length ? "Generate next topic" : "Next topic";
    renderStats();
    renderTodayMission();
    if (state.selectedDay !== previousStage) window.TomCodexLearning?.record("stage", 1, getSelectedDay()[1]);
  };

  select.addEventListener("change", () => setDay(select.value));
  document.getElementById("previousDayBtn").addEventListener("click", () => setDay(state.selectedDay - 1));
  document.getElementById("nextDayBtn").addEventListener("click", () => {
    const nextStage = state.selectedDay === days.length ? generateNextStage() : state.selectedDay + 1;
    setDay(nextStage);
  });
  setDay(state.selectedDay);
}

function setupTabs() {
  const buttons = [...document.querySelectorAll("[data-tab-target]")];
  const panels = [...document.querySelectorAll("[data-tab-panel]")];
  const availableTabs = buttons.map((button) => button.dataset.tabTarget);

  const showTab = (tabName, moveFocus = false, scrollToContent = false) => {
    const activeTab = availableTabs.includes(tabName) ? tabName : "dashboard";
    state.activeTab = activeTab;
    saveState();

    buttons.forEach((button) => {
      const isActive = button.dataset.tabTarget === activeTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive);
      button.tabIndex = isActive ? 0 : -1;
      if (isActive && moveFocus) button.focus();
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== activeTab;
    });

    if (activeTab === "poc") {
      renderPocTracker();
    } else if (activeTab === "passport") {
      renderSkillPassport();
    } else if (activeTab === "settings") {
      renderSettingsForm();
    }

    if (scrollToContent) {
      document.getElementById("tabContent").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => showTab(button.dataset.tabTarget, false, true));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      showTab(buttons[nextIndex].dataset.tabTarget, true, true);
    });
  });

  document.querySelectorAll("[data-go-tab]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.goTab, false, true));
  });

  // Support URL tab parameter overriding stored tab
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get("tab");
  showTab(requestedTab || state.activeTab);
}

function renderLearningTracks() {
  const definitions = [
    ["admin", "course-admin.html", 10],
    ["apex", "course-apex.html", 13],
    ["flow", "course-flow.html", 12],
    ["lwc", "course-lwc.html", 12]
  ];
  let enrollments = {};
  try { enrollments = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY)) || {}; } catch {}

  const enrollAndOpen = async (track, href) => {
    const now = new Date().toISOString();
    const isNewEnrollment = !enrollments[track]?.enrolledAt;
    enrollments[track] = {
      enrolledAt: enrollments[track]?.enrolledAt || now,
      lastOpenedAt: now
    };
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    window.TomCodexLearning?.record(isNewEnrollment ? "course-enrollment" : "course-continue", 1, track);
    await window.TomCodexLearnerSync?.flush?.();
    window.location.href = href;
  };

  const cards = [...document.querySelectorAll("#programs .course-card")].slice(0, definitions.length);
  const tracks = cards.map((card, index) => {
    const [track, href, total] = definitions[index];
    let scores = {};
    try { scores = JSON.parse(localStorage.getItem(`tomcodex.${track}MasteryScores.v1`)) || {}; } catch {}
    
    let completed = 0;
    if (track === "admin") {
      let attempts = {};
      try { attempts = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}
      let adminScores = {};
      try { adminScores = JSON.parse(localStorage.getItem("tomcodex.adminMasteryScores.v1")) || {}; } catch {}
      for (let i = 1; i <= total; i++) {
        const bestScore = attempts[`admin-${i}:summary`]?.bestScore || attempts[`admin-module-${i}:summary`]?.bestScore || 0;
        const quizScore = adminScores[i - 1]?.score || 0;
        if (bestScore >= 80 || quizScore >= 80) {
          completed++;
        }
      }
    } else {
      completed = Object.values(scores).filter((entry) => Number(entry?.score) >= 80).length;
    }

    if (completed > 0 && !enrollments[track]) {
      enrollments[track] = { enrolledAt: new Date().toISOString(), lastOpenedAt: null };
      localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    }
    const enrolled = Boolean(enrollments[track]);
    const percent = Math.round(completed / total * 100);
    const status = percent === 100 ? "Track completed" : completed ? `${completed} of ${total} modules ${track === 'admin' ? 'verified' : 'mastered'}` : enrolled ? "Enrolled and ready to begin" : "Enrollment required";
    const action = percent === 100 ? "Review track →" : enrolled ? "Continue track →" : "Enroll now →";
    const title = card.querySelector("h3").textContent;
    const remaining = Math.max(0, total - completed);

    card.classList.add("learning-track-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${action.replace(" →", "")}: ${title}`);
    card.addEventListener("click", () => enrollAndOpen(track, href));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        enrollAndOpen(track, href);
      }
    });
    card.innerHTML = `<div class="track-summary">
      <div class="track-summary-heading"><span class="track-course-icon">${track === "admin" ? "SF" : track === "apex" ? "&lt;/&gt;" : track === "flow" ? "FL" : "UI"}</span><div><span class="course-tag">${percent === 100 ? "Completed" : completed ? "In progress" : enrolled ? "Enrolled" : "Available"}</span><h3>${title}</h3></div><strong>${percent}%</strong></div>
      <div class="track-progress-bar"><span style="width:${percent}%"></span></div>
      <div class="track-metrics"><div><strong>${completed}</strong><span>${track === 'admin' ? 'Verified' : 'Mastered'}</span></div><div><strong>${remaining}</strong><span>Remaining</span></div><div><strong>${total}</strong><span>Total modules</span></div></div>
      <div class="track-next-action"><div><span>Current status</span><strong>${status}</strong></div><b>${action}</b></div>
    </div>`;
    return { track, href, title, completed, percent, enrolled };
  });

  // Dynamic progress summary cards on dashboard
  const TOTAL_ADMIN_MODULES = definitions[0][2];
  let adminVerifiedCount = 0;
  let adminAttempts = {};
  try { adminAttempts = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}
  let adminScores = {};
  try { adminScores = JSON.parse(localStorage.getItem("tomcodex.adminMasteryScores.v1")) || {}; } catch {}
  for (let i = 1; i <= TOTAL_ADMIN_MODULES; i++) {
    const bestScore = adminAttempts[`admin-${i}:summary`]?.bestScore || adminAttempts[`admin-module-${i}:summary`]?.bestScore || 0;
    const quizScore = adminScores[i - 1]?.score || 0;
    if (bestScore >= 80 || quizScore >= 80) {
      adminVerifiedCount++;
    }
  }

  let verifiedSkillsCount = 0;
  try {
    const passport = JSON.parse(localStorage.getItem("tomcodex.skillPassport.v1") || "{}");
    verifiedSkillsCount = Object.values(passport).filter(s => s.status === "Verified").length;
  } catch {}

  let maxBestScore = 0;
  try {
    Object.keys(adminAttempts).forEach(key => {
      if (key.endsWith(":summary")) {
        const score = Number(adminAttempts[key]?.bestScore) || 0;
        if (score > maxBestScore) {
          maxBestScore = score;
        }
      }
    });
    Object.values(adminScores).forEach(entry => {
      const score = Number(entry?.score) || 0;
      if (score > maxBestScore) {
        maxBestScore = score;
      }
    });
  } catch {}

  let authUser = {};
  try {
    authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
  } catch {}
  const currentTier = authUser.tier || "free";

  let nextActionText = "";
  let nextActionLink = "course-admin.html";
  
  if (adminVerifiedCount === 0) {
    nextActionText = "Continue Admin Module 1 - Salesforce Platform Foundations";
    nextActionLink = "course-admin.html?module=0";
  } else if (adminVerifiedCount === 1) {
    if (currentTier !== "founder") {
      nextActionText = "Upgrade to Founder Access to continue Admin Module 2";
      nextActionLink = "pricing.html";
    } else {
      nextActionText = "Continue Admin Module 2 - Student Success CRM Object Model";
      nextActionLink = "course-admin.html?module=1";
    }
  } else if (adminVerifiedCount === 2) {
    nextActionText = "Continue Admin Module 3 - Security and Access Control";
    nextActionLink = "course-admin.html?module=2";
  } else if (adminVerifiedCount === 3) {
    nextActionText = "Continue Admin Module 4 - Page Layouts, Lightning App, and User Experience";
    nextActionLink = "course-admin.html?module=3";
  } else if (adminVerifiedCount === 4) {
    nextActionText = "Continue Admin Module 5 - Validation Rules and Data Quality";
    nextActionLink = "course-admin.html?module=4";
  } else if (adminVerifiedCount === 5) {
    nextActionText = "Continue Admin Module 6 - Reports and Dashboards";
    nextActionLink = "course-admin.html?module=5";
  } else if (adminVerifiedCount === 6) {
    nextActionText = "Continue Admin Module 7 - Flow Automation Foundations";
    nextActionLink = "course-admin.html?module=6";
  } else if (adminVerifiedCount === 7) {
    nextActionText = "Continue Admin Module 8 - Flow Automation Intermediate";
    nextActionLink = "course-admin.html?module=7";
  } else if (adminVerifiedCount === 8) {
    nextActionText = "Continue Admin Module 9 - Approval Processes and Advanced Automation";
    nextActionLink = "course-admin.html?module=8";
  } else if (adminVerifiedCount === 9) {
    nextActionText = "Continue Admin Module 10 - Data Management and Import Tools";
    nextActionLink = "course-admin.html?module=9";
  } else {
    nextActionText = "All 10 modules verified! View your certificate eligibility.";
    nextActionLink = "dashboard.html?tab=passport";
  }

  const recommendationElement = document.getElementById("trackRecommendation");
  if (recommendationElement) {
    recommendationElement.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-xs bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Active Track</span>
            <span class="text-slate-500 text-xs font-semibold">Salesforce Admin Track</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <span class="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">Admin Track Progress</span>
              <strong class="text-sm text-slate-800 font-extrabold">Admin Track Progress: ${adminVerifiedCount} / ${TOTAL_ADMIN_MODULES} modules verified</strong>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">Verified Skills</span>
              <strong class="text-sm text-slate-800 font-extrabold">Verified Skills: ${verifiedSkillsCount}</strong>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">Best Score</span>
              <strong class="text-sm text-slate-800 font-extrabold">Best Score: ${maxBestScore > 0 ? maxBestScore + '%' : '0%'}</strong>
            </div>
          </div>
          <div class="pt-2">
            <span class="text-[11px] text-slate-400 block uppercase font-bold tracking-wider font-semibold">Next Action</span>
            <span class="text-xs font-bold text-brand-650" style="color: #056b8d;">Next Action: ${nextActionText.replace("Next Action: ", "").replace("Upgrade to Founder Access to continue Admin Module 2", "Upgrade to Founder Access to continue Admin Module 2").replace("Continue Admin Module 2 - Student Success CRM Object Model", "Continue Admin Module 2 - Student Success CRM Object Model")}</span>
          </div>
        </div>
        <a href="${nextActionLink}" class="shrink-0 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700 transition text-sm inline-block text-center whitespace-nowrap">
          ${nextActionText.includes("Upgrade") ? "Upgrade to Founder" : "Continue Path"} &rarr;
        </a>
      </div>
    `;
  }
}

const crmStages = [
  {
    stage: 1,
    name: "Platform & Core Objects",
    desc: "Provision a Salesforce Developer Org and create the Student custom object to track learners.",
    course: "admin",
    moduleIndex: 0,
    moduleName: "Admin Module 1",
    url: "course-admin.html?module=0"
  },
  {
    stage: 2,
    name: "Data Modeling & Relationships",
    desc: "Build Master-Detail relationships to track Course Enrollments and relate Students to Accounts.",
    course: "admin",
    moduleIndex: 1,
    moduleName: "Admin Module 2",
    url: "course-admin.html?module=1"
  },
  {
    stage: 3,
    name: "Access Control & Security",
    desc: "Create Profiles, OWD, and Permission Sets to restrict access to sensitive student profile details.",
    course: "admin",
    moduleIndex: 2,
    moduleName: "Admin Module 3",
    url: "course-admin.html?module=2"
  },
  {
    stage: 4,
    name: "Flow Process Automation",
    desc: "Design screen flows and record-triggered flows to automate student onboarding and email alerts.",
    course: "flow",
    moduleIndex: 0,
    moduleName: "Flow Module 1",
    url: "course-flow.html?module=0"
  },
  {
    stage: 5,
    name: "Apex Trigger Logic",
    desc: "Build trigger handlers to calculate student completion metrics and auto-grade screenshot labs.",
    course: "apex",
    moduleIndex: 0,
    moduleName: "Apex Module 1",
    url: "course-apex.html?module=0"
  },
  {
    stage: 6,
    name: "LWC Student Dashboard",
    desc: "Implement a responsive Lightning Web Component that queries student progress and displays earned skills.",
    course: "lwc",
    moduleIndex: 0,
    moduleName: "LWC Module 1",
    url: "course-lwc.html?module=0"
  },
  {
    stage: 7,
    name: "Agentforce Copilot Integration",
    desc: "Configure an Agentforce Agent to serve as a curriculum copilot for live students.",
    course: "lwc",
    moduleIndex: 4,
    moduleName: "Final Capstone POC",
    url: "course-lwc.html?module=4"
  }
];

function renderPocTracker() {
  const grid = document.getElementById("pocStagesGrid");
  if (!grid) return;
  grid.replaceChildren();

  let foundInProgress = false;
  let completedCount = 0;

  let authUser = {};
  try {
    authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
  } catch {}
  const isFree = (authUser.tier || "free") === "free";

  crmStages.forEach((stage) => {
    let isCompleted = false;
    let score = 0;

    if (stage.course === "admin") {
      let attempts = {};
      try { attempts = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}
      const moduleId = `admin-${stage.moduleIndex + 1}`;
      const legacyId = `admin-module-${stage.moduleIndex + 1}`;
      const bestScore = attempts[`${moduleId}:summary`]?.bestScore || attempts[`${legacyId}:summary`]?.bestScore || 0;
      
      let adminScores = {};
      try { adminScores = JSON.parse(localStorage.getItem("tomcodex.adminMasteryScores.v1")) || {}; } catch {}
      const quizScore = adminScores[stage.moduleIndex]?.score || 0;
      
      const maxScore = Math.max(bestScore, quizScore);
      if (maxScore >= 80) {
        isCompleted = true;
        score = maxScore;
      }
    } else {
      try {
        const scores = JSON.parse(localStorage.getItem(`tomcodex.${stage.course}MasteryScores.v1`)) || {};
        if (scores[stage.moduleIndex]?.score >= 80) {
          isCompleted = true;
          score = Math.max(score, scores[stage.moduleIndex].score);
        }
      } catch {}

      try {
        const screenshots = JSON.parse(localStorage.getItem(`tomcodex.${stage.course}MasteryScores.v1.screenshots`)) || {};
        if (screenshots[stage.moduleIndex]?.score >= 80) {
          isCompleted = true;
          score = Math.max(score, screenshots[stage.moduleIndex].score);
        }
      } catch {}
    }

    let status = "locked";
    if (isCompleted) {
      status = "completed";
      completedCount++;
    } else {
      const isLockedByTier = isFree && (stage.course !== "admin" || stage.moduleIndex > 0);
      if (isLockedByTier) {
        status = "locked";
      } else if (!foundInProgress) {
        status = "in-progress";
        foundInProgress = true;
      } else {
        status = "locked";
      }
    }

    const card = document.createElement("div");
    card.className = `p-5 bg-white border rounded-2xl flex flex-col justify-between gap-4 transition duration-200 hover:shadow-md ${
      status === "completed" ? "border-emerald-250 bg-emerald-50/10" :
      status === "in-progress" ? "border-brand-500 ring-1 ring-brand-500" :
      "border-slate-200 opacity-70"
    }`;

    let badgeHtml = "";
    if (status === "completed") {
      badgeHtml = `<span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Completed (${score}%)</span>`;
    } else if (status === "in-progress") {
      badgeHtml = `<span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 animate-pulse">In Progress</span>`;
    } else {
      badgeHtml = `<span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">🔒 Locked</span>`;
    }

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Stage ${stage.stage}</span>
          <h4 class="font-extrabold text-sm text-slate-800 mt-1">${stage.name}</h4>
        </div>
        ${badgeHtml}
      </div>
      <p class="text-slate-500 text-xs leading-relaxed">${stage.desc}</p>
      <div class="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-semibold">
        <span class="text-slate-400">${stage.moduleName}</span>
        ${status !== "locked" 
          ? `<a href="${stage.url}" class="text-brand-600 hover:underline">View lab &rarr;</a>` 
          : `<span class="text-slate-300">Unlock track</span>`
        }
      </div>
    `;
    grid.appendChild(card);
  });

  const progressPercent = Math.round((completedCount / crmStages.length) * 100);
  const progressText = document.getElementById("pocOverallProgress");
  if (progressText) progressText.textContent = `${progressPercent}%`;
}

async function renderSkillPassport() {
  let authUser = {};
  try {
    authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
  } catch {}
  const isFounder = authUser.tier === "founder";
  const tierName = isFounder ? "★ Founder Access" : "Free Starter";

  let totalLabs = 0;
  let totalLabScoreSum = 0;
  let totalQuizzes = 0;
  const evaluationHistory = [];

  const courses = ["admin", "apex", "flow", "lwc"];
  
  courses.forEach((course) => {
    let quizScores = {};
    let screenshotScores = {};
    
    try { quizScores = JSON.parse(localStorage.getItem(`tomcodex.${course}MasteryScores.v1`)) || {}; } catch {}
    try { screenshotScores = JSON.parse(localStorage.getItem(`tomcodex.${course}MasteryScores.v1.screenshots`)) || {}; } catch {}
    
    Object.entries(quizScores).forEach(([modIndex, entry]) => {
      if (entry?.score >= 80) {
        totalQuizzes++;
      }
    });

    Object.entries(screenshotScores).forEach(([modIndex, entry]) => {
      const idx = Number(modIndex);
      const scoreVal = Number(entry?.score) || 0;
      if (scoreVal > 0) {
        totalLabs++;
        totalLabScoreSum += scoreVal;
        
        let modTitle = `${course.toUpperCase()} Module ${idx + 1}`;
        if (course === "admin" && idx === 0) modTitle = "Salesforce Platform Foundations";
        
        evaluationHistory.push({
          course,
          moduleIndex: idx,
          title: modTitle,
          score: scoreVal,
          passed: Boolean(entry.passed),
          feedback: entry.feedback || "Lab evaluation complete.",
          timestamp: entry.timestamp || new Date().toISOString()
        });
      }
    });
  });

  // Load dynamic skill passport and attempts history
  let dynamicAttempts = {};
  try { dynamicAttempts = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}

  // Process dynamic attempts history
  Object.entries(dynamicAttempts).forEach(([key, val]) => {
    if (Array.isArray(val) && (key.startsWith("admin-") || key.startsWith("admin-module-"))) {
      if (key.startsWith("admin-module-")) return; // Avoid processing both formats to prevent duplicates

      val.forEach((attempt) => {
        const scoreVal = Number(attempt.score) || 0;
        totalLabs++;
        totalLabScoreSum += scoreVal;
        
        let modTitle = `Admin Module`;
        if (key === "admin-1") modTitle = "Salesforce Platform Foundations";
        else if (key === "admin-2") modTitle = "Student Success CRM Object Model";
        else if (key === "admin-3") modTitle = "Security and Access Control";
        else {
          const modNum = key.split("-")[1];
          modTitle = `Admin Module ${modNum}`;
        }

        evaluationHistory.push({
          course: "admin",
          moduleIndex: key,
          title: modTitle,
          score: scoreVal,
          passed: attempt.status === "Verified",
          feedback: attempt.feedback || "Lab verification complete.",
          timestamp: attempt.createdAt || new Date().toISOString()
        });
      });
    }
  });

  const avgLabScore = totalLabs > 0 ? Math.round(totalLabScoreSum / totalLabs) : 0;

  const labsCompletedEl = document.getElementById("passportLabsCompleted");
  if (labsCompletedEl) labsCompletedEl.textContent = totalLabs;

  const avgLabScoreEl = document.getElementById("passportAverageScore");
  if (avgLabScoreEl) avgLabScoreEl.textContent = `${avgLabScore}%`;

  const quizzesPassedEl = document.getElementById("passportQuizzesPassed");
  if (quizzesPassedEl) quizzesPassedEl.textContent = totalQuizzes;

  const tierStatusEl = document.getElementById("passportTierStatus");
  if (tierStatusEl) {
    tierStatusEl.textContent = tierName;
    tierStatusEl.className = `block text-lg font-bold ${isFounder ? "text-brand-600" : "text-slate-600"}`;
  }

  // --- Cert status (existing hero card) ---
  let adminScores = {};
  try { adminScores = JSON.parse(localStorage.getItem("tomcodex.adminMasteryScores.v1")) || {}; } catch {}

  // Count verified admin modules from lab attempts (primary) and quiz scores (secondary)
  const TOTAL_CERT_MODULES = 10;
  let adminAttemptsCert = {};
  try { adminAttemptsCert = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}
  let adminVerifiedForCert = 0;
  for (let i = 1; i <= TOTAL_CERT_MODULES; i++) {
    const bestLab = adminAttemptsCert[`admin-${i}:summary`]?.bestScore || adminAttemptsCert[`admin-module-${i}:summary`]?.bestScore || 0;
    const quizScore = adminScores[i - 1]?.score || 0;
    if (bestLab >= 80 || quizScore >= 80) adminVerifiedForCert++;
  }

  const certTitleEl = document.getElementById("passportCertTitle");
  const certStatusEl = document.getElementById("passportCertStatus");
  
  if (adminVerifiedForCert >= TOTAL_CERT_MODULES && isFounder) {
    if (certTitleEl) certTitleEl.textContent = "✓ Verified Salesforce Admin Foundation Graduate";
    if (certStatusEl) {
      certStatusEl.className = "mt-6 w-full p-4 rounded-2xl bg-lime/20 border border-lime text-lime text-xs font-bold text-center";
      certStatusEl.innerHTML = `★ Certificate Eligible! ${adminVerifiedForCert}/${TOTAL_CERT_MODULES} modules verified`;
    }
  } else {
    if (certTitleEl) certTitleEl.textContent = "Salesforce Admin Foundation Graduate";
    if (certStatusEl) {
      certStatusEl.className = "mt-6 w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold text-center";
      certStatusEl.textContent = `Status: Locked (${adminVerifiedForCert} of ${TOTAL_CERT_MODULES} modules verified)`;
    }
  }

  // --- Certificate Eligibility Engine Card ---
  await renderCertificateEligibilityCard();

  const historyList = document.getElementById("passportHistoryList");
  if (historyList) {
    historyList.replaceChildren();
    if (evaluationHistory.length === 0) {
      const emptyItem = document.createElement("div");
      emptyItem.className = "text-center py-8 text-slate-400 text-xs";
      emptyItem.textContent = "No screenshot lab proofs uploaded yet. Go to your courses to submit your first lab screenshot.";
      historyList.appendChild(emptyItem);
    } else {
      evaluationHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      evaluationHistory.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = `p-4 border rounded-2xl ${
          item.passed ? "bg-emerald-50/30 border-emerald-100 text-slate-700" : "bg-rose-50/30 border-rose-100 text-slate-700"
        }`;
        
        const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        itemEl.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <div>
              <h4 class="font-extrabold text-xs text-slate-800">${item.title}</h4>
              <span class="text-[10px] text-slate-400">${formattedDate}</span>
            </div>
            <strong class="text-xs ${item.passed ? "text-emerald-700" : "text-rose-700"} bg-white px-2 py-0.5 rounded-full border border-slate-100">
              Grade: ${item.score}%
            </strong>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed font-mono bg-white/50 p-2 rounded-xl border border-slate-100/50">${item.feedback}</p>
        `;
        historyList.appendChild(itemEl);
      });
    }
  }
}

async function renderCertificateEligibilityCard() {
  const verifiedModulesEl = document.getElementById("certVerifiedModules");
  const progressBarEl = document.getElementById("certProgressBar");
  const founderStatusEl = document.getElementById("certFounderStatus");
  const eligibilityStatusEl = document.getElementById("certEligibilityStatus");
  const missingListEl = document.getElementById("certMissingList");

  if (!eligibilityStatusEl) return;

  // Set loading state
  eligibilityStatusEl.textContent = "Checking eligibility…";
  eligibilityStatusEl.className = "mt-2 w-full p-3 rounded-2xl text-center text-[11px] font-bold bg-slate-100 text-slate-400";
  if (missingListEl) missingListEl.classList.add("hidden");

  let result = null;

  // Try backend engine first
  try {
    const resp = await fetch("/api/academy/certificate-eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (resp.ok) {
      result = await resp.json();
    }
  } catch {
    // Backend offline — fall through to local calculation
  }

  // Local fallback calculation
  if (!result) {
    let authUser = {};
    try { authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {}; } catch {}
    const tier = authUser.tier || "free";
    const TOTAL = 10;
    const MIN_SCORE = 80;

    let adminAttempts = {};
    try { adminAttempts = JSON.parse(localStorage.getItem("tomcodex.adminLabAttempts.v1")) || {}; } catch {}
    let adminScores = {};
    try { adminScores = JSON.parse(localStorage.getItem("tomcodex.adminMasteryScores.v1")) || {}; } catch {}
    let passport = {};
    try { passport = JSON.parse(localStorage.getItem("tomcodex.skillPassport.v1")) || {}; } catch {}

    const missingRequirements = [];
    const verifiedSkills = [];
    let verifiedModules = 0;

    if (tier !== "founder") missingRequirements.push("Upgrade to Founder tier required.");

    const skillNames = [
      "Salesforce Platform Foundations", "Salesforce Object Modeling",
      "Salesforce Security Foundations", "Page Layouts & App UX",
      "Validation Rules & Data Quality", "Reports & Dashboards",
      "Flow Automation Foundations", "Flow Automation Intermediate",
      "Salesforce Approval Processes", "Salesforce Data Management"
    ];
    const skillIds = [
      "salesforce-platform-foundations", "salesforce-object-modeling",
      "salesforce-security-foundations", "salesforce-app-user-experience",
      "salesforce-data-quality-rules", "salesforce-reporting-dashboards",
      "salesforce-flow-automation", "salesforce-flow-automation-intermediate",
      "salesforce-approval-processes", "salesforce-data-management"
    ];

    for (let i = 1; i <= TOTAL; i++) {
      const bestLab = adminAttempts[`admin-${i}:summary`]?.bestScore || adminAttempts[`admin-module-${i}:summary`]?.bestScore || 0;
      const quizScore = adminScores[i - 1]?.score || 0;
      const passportSkill = passport[skillIds[i - 1]];
      const isVerified = passportSkill?.status === "Verified";
      const finalScore = passportSkill?.score || bestLab || 0;

      if ((finalScore >= MIN_SCORE || bestLab >= MIN_SCORE || quizScore >= MIN_SCORE) && isVerified) {
        verifiedModules++;
        verifiedSkills.push(skillNames[i - 1]);
      } else {
        missingRequirements.push(`Complete Admin Module ${i} (${skillNames[i - 1]}) with ≥${MIN_SCORE}%.`);
      }
    }

    result = {
      eligible: missingRequirements.length === 0,
      verifiedModules,
      requiredModules: TOTAL,
      minimumScore: MIN_SCORE,
      verifiedSkills,
      missingRequirements,
      certificateName: "TomCodeX Academy Course Completion Certificate"
    };
  }

  const { eligible, verifiedModules, requiredModules, missingRequirements } = result;
  const percent = Math.round((verifiedModules / requiredModules) * 100);

  // Get tier info
  let authUser = {};
  try { authUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {}; } catch {}
  const isFounder = authUser.tier === "founder";

  // Update verified modules counter
  if (verifiedModulesEl) verifiedModulesEl.textContent = `${verifiedModules} / ${requiredModules}`;

  // Update progress bar
  if (progressBarEl) {
    progressBarEl.style.width = `${percent}%`;
    progressBarEl.className = `h-full rounded-full transition-all duration-700 ${eligible ? "bg-emerald-500" : percent >= 50 ? "bg-amber-400" : "bg-brand-500"}`;
  }

  // Update founder status
  if (founderStatusEl) {
    if (isFounder) {
      founderStatusEl.textContent = "✓ Active";
      founderStatusEl.className = "text-xs text-emerald-600";
    } else {
      founderStatusEl.textContent = "✗ Required";
      founderStatusEl.className = "text-xs text-rose-500";
    }
  }

  // Update main status badge
  if (eligibilityStatusEl) {
    if (eligible) {
      eligibilityStatusEl.className = "mt-2 w-full p-3 rounded-2xl text-center text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700";
      eligibilityStatusEl.innerHTML = `🏆 Certificate Eligible! All ${requiredModules} modules verified.`;
    } else {
      eligibilityStatusEl.className = "mt-2 w-full p-3 rounded-2xl text-center text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-700";
      eligibilityStatusEl.innerHTML = `${verifiedModules}/${requiredModules} modules verified — ${requiredModules - verifiedModules} remaining`;
    }
  }

  // Render missing requirements
  if (missingListEl) {
    if (!eligible && missingRequirements.length > 0) {
      missingListEl.classList.remove("hidden");
      missingListEl.innerHTML = `
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 mb-1">Remaining Requirements</p>
        ${missingRequirements.slice(0, 5).map(r =>
          `<div class="flex items-start gap-1.5 text-[11px] text-rose-600 font-medium"><span class="mt-px shrink-0">✗</span><span>${r}</span></div>`
        ).join("")}
        ${missingRequirements.length > 5 ? `<p class="text-[10px] text-slate-400">+ ${missingRequirements.length - 5} more requirements</p>` : ""}
      `;
    } else {
      missingListEl.classList.add("hidden");
    }
  }

  // Show / wire download buttons when eligible
  const downloadWrap = document.getElementById("certDownloadWrap");
  if (downloadWrap) {
    if (eligible) {
      downloadWrap.classList.remove("hidden");
      wireCertificateButtons(result);
    } else {
      downloadWrap.classList.add("hidden");
    }
  }
}

function buildCertOptions(result) {
  let identity = {};
  try {
    identity = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1"))
      || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1"))
      || {};
  } catch {}

  const studentName = identity.name || identity.email?.split("@")[0] || "Academy Graduate";
  const issueDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const raw = `${studentName}-cert-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  const certId = `TCX-${Math.abs(hash).toString(16).toUpperCase().padStart(8, "0").slice(0, 4)}-${Math.abs(hash).toString(16).toUpperCase().padStart(8, "0").slice(4)}`;

  return {
    studentName,
    courseName: result.certificateName || "Salesforce Admin Foundation",
    verifiedSkills: result.verifiedSkills || [],
    issueDate,
    certId
  };
}

function wireCertificateButtons(result) {
  const previewBtn = document.getElementById("certPreviewBtn");
  const downloadBtn = document.getElementById("certDownloadBtn");
  const modal = document.getElementById("certModal");
  const modalClose = document.getElementById("certModalClose");
  const modalDownload = document.getElementById("certModalDownload");
  const modalCanvas = document.getElementById("certModalCanvas");

  async function generateAndShow() {
    if (!window.__certGen) {
      try {
        const mod = await import("./certificate-generator.js");
        window.__certGen = mod;
      } catch (e) {
        alert("Certificate generator failed to load. Please try refreshing.");
        return null;
      }
    }
    const opts = buildCertOptions(result);
    return { mod: window.__certGen, opts };
  }

  if (previewBtn) {
    previewBtn.onclick = async () => {
      previewBtn.textContent = "Generating…";
      previewBtn.disabled = true;
      const loaded = await generateAndShow();
      previewBtn.textContent = "🏆 Preview Certificate";
      previewBtn.disabled = false;
      if (!loaded) return;
      await loaded.mod.showCertificatePreview(loaded.opts, "certModalCanvas");
      if (modal) modal.classList.remove("hidden");
    };
  }

  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      downloadBtn.textContent = "Generating…";
      downloadBtn.disabled = true;
      const loaded = await generateAndShow();
      downloadBtn.textContent = "⬇ Download Certificate (.PNG)";
      downloadBtn.disabled = false;
      if (!loaded) return;
      await loaded.mod.downloadCertificate(loaded.opts);
    };
  }

  if (modalClose && modal) {
    modalClose.onclick = () => modal.classList.add("hidden");
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
  }

  if (modalDownload) {
    modalDownload.onclick = async () => {
      const loaded = await generateAndShow();
      if (!loaded) return;
      await loaded.mod.downloadCertificate(loaded.opts);
    };
  }
}


function renderSettingsForm() {
  let identity = {};
  try {
    identity = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {};
  } catch {}

  const settingsName = document.getElementById("settingsName");
  const settingsEmail = document.getElementById("settingsEmail");
  const settingsApiKey = document.getElementById("settingsApiKey");
  const settingsTierText = document.getElementById("settingsTierText");

  if (settingsName) settingsName.value = identity.name || "";
  if (settingsEmail) settingsEmail.value = identity.email || "";
  if (settingsApiKey) settingsApiKey.value = identity.personalApiKey || "";
  if (settingsTierText) {
    const isFounder = identity.tier === "founder";
    settingsTierText.innerHTML = isFounder 
      ? `<span class="text-brand-600">★ Founder Access ($19/mo)</span>` 
      : `<span class="text-slate-500">Free Starter Access ($0/mo)</span>`;
  }

  // Quota Visualization
  const quotaLabel = document.getElementById("settingsQuotaLabel");
  const quotaBar = document.getElementById("settingsQuotaBar");
  const quotaHelpText = document.getElementById("settingsQuotaHelpText");

  if (quotaLabel && quotaBar) {
    const usage = identity.usage || { requestsToday: 0, dailyLimit: 50 };
    const requestsToday = usage.requestsToday || 0;
    const dailyLimit = usage.dailyLimit || 50;
    const hasPersonalKey = !!identity.personalApiKey;

    if (hasPersonalKey) {
      quotaLabel.textContent = "Unlimited requests";
      quotaLabel.className = "text-xs font-bold text-emerald-600";
      quotaBar.style.width = "100%";
      quotaBar.className = "bg-emerald-500 h-full rounded-full transition-all duration-500";
      if (quotaHelpText) quotaHelpText.textContent = "Your personal API Key is configured. You have unlimited requests.";
    } else {
      quotaLabel.textContent = `${requestsToday} / ${dailyLimit} requests used`;
      const percent = Math.min(100, Math.round((requestsToday / dailyLimit) * 100));
      quotaBar.style.width = `${percent}%`;
      
      if (percent >= 90) {
        quotaLabel.className = "text-xs font-bold text-red-650";
        quotaBar.className = "bg-red-500 h-full rounded-full transition-all duration-500";
      } else if (percent >= 70) {
        quotaLabel.className = "text-xs font-bold text-amber-600";
        quotaBar.className = "bg-amber-500 h-full rounded-full transition-all duration-500";
      } else {
        quotaLabel.className = "text-xs font-bold text-brand-700";
        quotaBar.className = "bg-brand-600 h-full rounded-full transition-all duration-500";
      }

      if (quotaHelpText) quotaHelpText.textContent = "Quota resets daily. Setting a personal API key above unlocks unlimited requests.";
    }
  }
}

function setupSettingsForm() {
  const settingsForm = document.getElementById("settingsForm");
  if (!settingsForm) return;

  settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const settingsMessage = document.getElementById("settingsMessage");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    
    if (settingsMessage) {
      settingsMessage.className = "p-3.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-250 block";
      settingsMessage.textContent = "Updating settings on the server...";
      settingsMessage.classList.remove("hidden");
    }
    if (saveSettingsBtn) saveSettingsBtn.disabled = true;

    const name = document.getElementById("settingsName").value.trim();
    const personalApiKey = document.getElementById("settingsApiKey").value.trim();

    try {
      const response = await fetch("/api/student-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, personalApiKey })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update settings.");
      }

      const result = await response.json();
      
      let cachedIdentity = {};
      try { cachedIdentity = JSON.parse(localStorage.getItem("tomcodex.authIdentity.v1")) || {}; } catch {}
      const updatedIdentity = {
        ...cachedIdentity,
        name: result.student.name,
        personalApiKey: result.student.personalApiKey,
        usage: result.student.usage
      };
      localStorage.setItem("tomcodex.authIdentity.v1", JSON.stringify(updatedIdentity));

      let cachedUser = {};
      try { cachedUser = JSON.parse(localStorage.getItem("tomcodex.auth.user.v1")) || {}; } catch {}
      const updatedUser = {
        ...cachedUser,
        name: result.student.name,
        userId: result.student.id,
        tier: result.student.tier || "free",
        upgradedAt: result.student.upgradedAt || null
      };
      localStorage.setItem("tomcodex.auth.user.v1", JSON.stringify(updatedUser));

      const welcomeEl = document.getElementById("learnerWelcome");
      if (welcomeEl) welcomeEl.textContent = `Welcome back, ${result.student.name}`;
      
      const avatarEl = document.getElementById("learnerAvatar");
      if (avatarEl) avatarEl.textContent = String(result.student.name || "S").trim().slice(0, 1).toUpperCase();

      if (settingsMessage) {
        settingsMessage.className = "p-3.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-250 block";
        settingsMessage.textContent = "Settings saved successfully!";
        setTimeout(() => { settingsMessage.classList.add("hidden"); }, 3000);
      }
      renderSettingsForm();
    } catch (err) {
      if (settingsMessage) {
        settingsMessage.className = "p-3.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-250 block";
        settingsMessage.textContent = err.message || "Failed to update settings.";
      }
    } finally {
      if (saveSettingsBtn) saveSettingsBtn.disabled = false;
    }
  });
}

function init() {
  renderLearningTracks();
  renderSkillMeters();
  renderSimpleList("dailyChecklist", dailyChecklist);
  renderSimpleList("studyBlocks", studyBlocks);
  renderHabits();
  renderProjectOutputs();
  renderModes();
  renderPhases();
  renderDays();
  setupDoubtBox();
  setupDayNavigation();
  setupTabs();
  setupSettingsForm();

  document.getElementById("phaseFilter").addEventListener("change", renderPhases);
  document.getElementById("phaseSearch").addEventListener("input", renderPhases);
}

document.addEventListener("DOMContentLoaded", init);
