// Learning Service - Business Logic Layer
// This service handles all business logic for the Salesforce Master Dashboard

export const STORAGE_KEY = "salesforceMasterDashboard.v1";
export const ENROLLMENTS_KEY = "tomcodex.courseEnrollments.v1";

const defaultState = {
  selectedDay: 1,
  activeTab: "dashboard",
  completedTasks: {},
  completedHabits: [],
  generatedStages: []
};

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

export class LearningService {
  constructor(localStorageService, daysProvider) {
    this.storageKey = "salesforceMasterDashboard.v1";
    this.enrollmentsKey = "tomcodex.courseEnrollments.v1";
    this.defaultState = defaultState;
    this.localStorageService = localStorageService;
    this.daysProvider = daysProvider;
    this.state = this.loadState();
  }

  loadState() {
    try {
      const storedValue = this.localStorageService.getItem(this.storageKey);
      const stored = typeof storedValue === "string" ? JSON.parse(storedValue) : storedValue;
      const generatedStages = Array.isArray(stored?.generatedStages) ? stored.generatedStages : [];
      const selectedDay = Number(stored?.selectedDay);
      const days = this.getDays();

      // Add generated stages to days array
      generatedStages.forEach((stage) => {
        if (Array.isArray(stage) && !days.some(([number]) => number === stage[0])) days.push(stage);
      });

      return {
        ...this.defaultState,
        ...stored,
        selectedDay: selectedDay >= 1 && selectedDay <= days.length ? selectedDay : this.defaultState.selectedDay,
        completedTasks: stored?.completedTasks || {},
        completedHabits: Array.isArray(stored?.completedHabits) ? stored.completedHabits : [],
        generatedStages
      };
    } catch {
      return { ...this.defaultState };
    }
  }

  saveState() {
    try {
      this.localStorageService.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
      // The dashboard remains usable when browser storage is unavailable.
    }
  }

  getDays() {
    return this.daysProvider.getDays();
  }

  getSelectedDay() {
    const days = this.getDays();
    return days.find(([day]) => day === this.state.selectedDay) || days[0];
  }

  getMission() {
    const [day, focus, topics, practice] = this.getSelectedDay();
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

  getStats() {
    const mission = this.getMission();
    const updatedStats = [...stats];
    updatedStats[2] = { label: "Current", value: `Stage ${mission.day}`, detail: mission.title };
    return updatedStats;
  }

  getSkillMeters() {
    return skillMeters;
  }

  getDailyChecklist() {
    return dailyChecklist;
  }

  getHabits() {
    return habits;
  }

  getStudyBlocks() {
    return studyBlocks;
  }

  getAnswerModes() {
    return answerModes;
  }

  getTrainerPrompt() {
    return trainerPrompt;
  }

  getProjectOutputs() {
    return projectOutputs;
  }

  getPhases() {
    return phases;
  }

  getContinuousStageTemplates() {
    return continuousStageTemplates;
  }

  updateCompletedTasks(day, taskIndex, completed) {
    if (!this.state.completedTasks[day]) {
      this.state.completedTasks[day] = [];
    }

    if (completed) {
      // Add task to completed if not already there
      if (!this.state.completedTasks[day].includes(taskIndex)) {
        this.state.completedTasks[day].push(taskIndex);
      }
    } else {
      // Remove task from completed
      this.state.completedTasks[day] = this.state.completedTasks[day].filter(index => index !== taskIndex);
    }

    this.saveState();
  }

  updateCompletedHabits(habitIndex, completed) {
    if (completed) {
      // Add habit to completed if not already there
      if (!this.state.completedHabits.includes(habitIndex)) {
        this.state.completedHabits.push(habitIndex);
      }
    } else {
      // Remove habit from completed
      this.state.completedHabits = this.state.completedHabits.filter(index => index !== habitIndex);
    }

    this.saveState();
  }

  setSelectedDay(day) {
    const days = this.getDays();
    const previousDay = this.state.selectedDay;
    const requestedDay = Number(day);
    this.state.selectedDay = Number.isFinite(requestedDay)
      ? Math.min(days.length, Math.max(1, requestedDay))
      : this.defaultState.selectedDay;
    this.saveState();

    return {
      previousDay,
      newDay: this.state.selectedDay,
      dayChanged: previousDay !== this.state.selectedDay
    };
  }

  setActiveTab(tab) {
    this.state.activeTab = tab;
    this.saveState();
  }

  generateNextStage() {
    const stageNumber = this.getDays().length + 1;
    const templates = this.getContinuousStageTemplates();
    const templateIndex = ((stageNumber - 37) % templates.length + templates.length) % templates.length;
    const template = templates[templateIndex];
    const stage = [stageNumber, ...template];

    this.state.generatedStages.push(stage);
    this.saveState();

    return stage;
  }

  getTodayProgress() {
    const mission = this.getMission();
    const completedTasks = this.state.completedTasks[mission.day] || [];
    const totalTasks = mission.mustFinish.length;
    const completed = completedTasks.length;
    const progress = Math.round((completed / totalTasks) * 100) || 0;

    return {
      progress,
      completed,
      total: totalTasks
    };
  }

  getHabitProgress() {
    const totalHabits = this.getHabits().length;
    const completed = this.state.completedHabits.length;
    const progress = Math.round((completed / totalHabits) * 100) || 0;

    return {
      progress,
      completed,
      total: totalHabits
    };
  }

  getLearningTracks() {
    const definitions = [
      ["admin", "course-admin.html", 14],
      ["apex", "course-apex.html", 12],
      ["flow", "course-flow.html", 12],
      ["lwc", "course-lwc.html", 12],
      ["integration", "course-integration.html", 8],
      ["agentforce", "course-agentforce.html", 6],
      ["poc", "course-poc.html", 4]
    ];

    let enrollments = {};
    try {
      enrollments = JSON.parse(this.localStorageService.getItem(this.enrollmentsKey)) || {};
    } catch {}

    return definitions.map(([track, href, total]) => {
      let scores = {};
      try {
        scores = JSON.parse(this.localStorageService.getItem(`tomcodex.${track}MasteryScores.v1`) || "{}");
      } catch {}

      const completed = Object.values(scores).filter((entry) => Number(entry?.score) >= 80).length;

      if (completed > 0 && !enrollments[track]) {
        enrollments[track] = {
          enrolledAt: new Date().toISOString(),
          lastOpenedAt: null
        };
        this.localStorageService.setItem(this.enrollmentsKey, JSON.stringify(enrollments));
      }

      const enrolled = Boolean(enrollments[track]);
      const percent = Math.round(completed / total * 100);
      const status = percent === 100 ? "Track completed" : completed ? `${completed} of ${total} modules mastered` : enrolled ? "Enrolled and ready to begin" : "Enrollment required";
      const action = percent === 100 ? "Review track →" : enrolled ? "Continue track →" : "Enroll now →";
      const remaining = Math.max(0, total - completed);

      return {
        track,
        href,
        total,
        completed,
        percent,
        enrolled,
        status,
        action,
        remaining
      };
    });
  }

  enrollInTrack(track, href) {
    const enrollments = JSON.parse(this.localStorageService.getItem(this.enrollmentsKey) || "{}");
    const now = new Date().toISOString();
    const isNewEnrollment = !enrollments[track]?.enrolledAt;

    enrollments[track] = {
      enrolledAt: enrollments[track]?.enrolledAt || now,
      lastOpenedAt: now
    };

    this.localStorageService.setItem(this.enrollmentsKey, JSON.stringify(enrollments));
    return {
      enrolled: true,
      isNewEnrollment
    };
  }
}
