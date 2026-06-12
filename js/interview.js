const INTERVIEW_HISTORY_KEY = "tomcodex.interviewHistory.v1";
const INTERVIEW_REVIEW_KEY = "tomcodex.interviewReview.v1";
const INTERVIEW_QUESTION_ENDPOINT = "/api/ai/interview-questions";
const INTERVIEW_ROUNDS = {
  screening: { label: "Recruiter Screening", format: "behavioral", difficulty: "Beginner", focus: "motivation, communication, role fit, and concise experience examples" },
  technical: { label: "Technical Round", format: "technical", difficulty: "Intermediate", focus: "Salesforce knowledge, platform decisions, limits, security, and implementation reasoning" },
  scenario: { label: "Scenario Round", format: "technical", difficulty: "Advanced", focus: "real-world troubleshooting, design tradeoffs, stakeholder constraints, and verification" },
  manager: { label: "Hiring Manager Round", format: "behavioral", difficulty: "Intermediate", focus: "ownership, collaboration, prioritization, delivery, and measurable outcomes" }
};
const INTERVIEW_ROUND_QUESTIONS = {
  screening: [
    ["Walk me through your Salesforce background and the work most relevant to this role.", ["salesforce", "role", "project", "result"], "Give a concise career summary, connect relevant Salesforce work to the target role, and finish with measurable impact."],
    ["Why are you interested in this Salesforce role and this type of organization?", ["role", "organization", "value", "growth"], "Connect your motivation to the role, the business domain, the value you can add, and how you want to grow."],
    ["Which Salesforce project best demonstrates your readiness for this position?", ["project", "responsibility", "action", "result"], "Use a focused STAR story showing your responsibility, key decisions, and business result."],
    ["How do you explain a complex Salesforce concept to a non-technical stakeholder?", ["stakeholder", "simple", "business", "confirm"], "Explain how you translate technical choices into business impact, use examples, and confirm understanding."],
    ["What are you looking for in your next Salesforce opportunity?", ["ownership", "team", "impact", "growth"], "Describe the responsibilities, team environment, impact, and learning opportunities that match your goals."],
    ["What Salesforce strengths would your previous team highlight?", ["strength", "example", "team", "result"], "Name two relevant strengths and support each with a brief example and outcome."],
    ["How do you keep your Salesforce knowledge current?", ["trailhead", "release", "practice", "community"], "Describe a repeatable learning process using release notes, Trailhead, hands-on practice, and trusted community resources."],
    ["What questions would you ask before deciding whether this role is a good fit?", ["success", "team", "expectation", "challenge"], "Ask thoughtful questions about success measures, team practices, immediate challenges, and role expectations."]
  ],
  manager: [
    ["Tell me about a Salesforce delivery you personally owned from requirement through release.", ["situation", "ownership", "action", "result"], "Use STAR and show ownership across discovery, design, testing, release, and measurable outcome."],
    ["Describe a time you disagreed with a stakeholder or teammate about a Salesforce solution.", ["stakeholder", "tradeoff", "decision", "result"], "Explain the disagreement, evidence and tradeoffs, how you aligned the group, and the result."],
    ["How do you prioritize Salesforce requests when several teams say their work is urgent?", ["priority", "impact", "risk", "communicate"], "Describe transparent criteria, business impact, risk, dependencies, stakeholder communication, and review."],
    ["Tell me about a Salesforce mistake or failed assumption and what you changed afterward.", ["mistake", "ownership", "learned", "improved"], "Show accountability, corrective action, communication, and the process improvement that prevented recurrence."],
    ["How do you ensure a Salesforce solution remains successful after release?", ["adoption", "monitor", "support", "measure"], "Cover adoption, support, monitoring, metrics, feedback, documentation, and continuous improvement."],
    ["Describe a time you helped another team member improve their Salesforce work.", ["coach", "feedback", "team", "result"], "Use STAR to show respectful coaching, practical support, and the improvement achieved."],
    ["How do you balance delivery speed with Salesforce security and quality?", ["risk", "security", "test", "scope"], "Explain minimum safety controls, scope decisions, testing, approvals, rollback, and communication."],
    ["What would your first 90 days in this Salesforce role look like?", ["learn", "relationship", "priority", "deliver"], "Structure the answer around learning, stakeholder relationships, priority assessment, early delivery, and measurable progress."]
  ]
};
const extraAdminModules = [
  {
    title: "Sales Cloud Administration",
    description: "Configure and govern lead-to-revenue processes for sales teams.",
    points: [
      "Design lead assignment, conversion, and duplicate-management processes.",
      "Configure opportunity stages, products, price books, forecasting, and sales productivity.",
      "Measure pipeline quality, activity, conversion, and revenue outcomes."
    ],
    practice: [
      "Design a lead qualification and assignment process for regional sales teams.",
      "Configure an opportunity process with products, approvals, and forecasting.",
      "Build a pipeline health dashboard for sales leadership."
    ]
  },
  {
    title: "Service Cloud Administration",
    description: "Design scalable customer-service operations across cases, channels, knowledge, and entitlements.",
    points: [
      "Configure case intake, queues, assignment, escalation, and service console productivity.",
      "Use Knowledge, Omni-Channel, macros, quick text, and digital engagement effectively.",
      "Design entitlements, milestones, service metrics, and support governance."
    ],
    practice: [
      "Create a case-routing design for email, web, and priority customers.",
      "Configure a support console with Omni-Channel and agent productivity tools.",
      "Build an SLA monitoring dashboard using entitlements and milestones."
    ]
  },
  {
    title: "Experience Cloud and External Access",
    description: "Build secure partner and customer experiences with governed external-user access.",
    points: [
      "Choose external-user licenses, sharing models, audiences, and login experiences.",
      "Design secure partner and customer record access using external sharing features.",
      "Manage content, moderation, branding, adoption, and external-user lifecycle."
    ],
    practice: [
      "Design a customer portal where users can view only their own cases.",
      "Configure partner access to opportunities while protecting internal data.",
      "Plan external-user onboarding, moderation, and access reviews."
    ]
  },
  {
    title: "Integrations, AppExchange, and Connected Apps",
    description: "Administer integrations and third-party solutions safely across their lifecycle.",
    points: [
      "Evaluate integration requirements, data ownership, frequency, volume, and failure handling.",
      "Govern connected apps, OAuth policies, named credentials, permissions, and secrets.",
      "Assess, install, test, upgrade, and retire AppExchange packages safely."
    ],
    practice: [
      "Document requirements and controls for an ERP-to-Salesforce integration.",
      "Review connected-app access and tighten OAuth policies.",
      "Evaluate and safely deploy an AppExchange package."
    ]
  }
];
const adminModules = [...(window.TomCodexAdminModules || []), ...extraAdminModules];
const realWorldInterviewBank = window.TomCodexRealWorldInterviewBank || { admin: [], roles: {} };
const communityInterviewBank = window.TomCodexCommunityInterviewBank || { resources: [], admin: [], roles: {} };
const developerInterviewTopics = (window.TomCodexDeveloperInterviewTopics || []).map((topic, topicIndex) => ({
  id: String(topicIndex),
  title: topic.title,
  description: topic.description,
  questions: topic.questions.map(([question, keywords, guide, sourceIndex]) => {
    const [label, url] = communityInterviewBank.resources[sourceIndex] || ["Salesforce Developer Documentation", "https://developer.salesforce.com/docs/"];
    return { question, keywords, guide, coaching: "Explain the technical choice, limits, security, testing, and a practical example.", provenance: "community", source: { label, url }, topic: topic.title, type: "technical" };
  }),
  practiceQuestions: (topic.practiceQuestions || []).map((item) => ({ ...item }))
}));

function canonicalQuestionKey(question) {
  return String(question)
    .toLowerCase()
    .replace(/\[practice\s+\d+\]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeRepeatedQuestions(topics, listNames) {
  const seen = new Set();
  topics.forEach((topic) => listNames.forEach((listName) => {
    topic[listName] = topic[listName].filter((item) => {
      const key = canonicalQuestionKey(item.question);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }));
}

removeRepeatedQuestions(developerInterviewTopics, ["questions", "practiceQuestions"]);
const officialSalesforceSources = {
  "Salesforce Platform Foundations": ["Salesforce CRM Basics", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics"],
  "Data Modeling and Relationships": ["Salesforce Data Modeling", "https://trailhead.salesforce.com/content/learn/modules/data_modeling"],
  "User Access and Security": ["Salesforce Data Security", "https://trailhead.salesforce.com/content/learn/modules/data_security"],
  "Data Management and Quality": ["Salesforce Data Management", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management"],
  "Forms, Validation, and User Experience": ["Formulas and Validations", "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic"],
  "Flow Automation": ["Record-Triggered Automation Decision Guide", "https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered"],
  "Advanced Flow Architecture": ["Record-Triggered Automation Decision Guide", "https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered"],
  "Reports and Dashboards": ["Reports and Dashboards", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards"],
  "Advanced Security and Identity": ["Salesforce Data Security", "https://trailhead.salesforce.com/content/learn/modules/data_security"],
  "Sales Cloud Administration": ["Sales Cloud Basics", "https://trailhead.salesforce.com/content/learn/modules/lex_salesforce_basics"],
  "Service Cloud Administration": ["Service Cloud Basics", "https://trailhead.salesforce.com/content/learn/modules/service_basics"],
  "Experience Cloud and External Access": ["Experience Cloud Basics", "https://trailhead.salesforce.com/content/learn/modules/community_cloud_basics"],
  "Integrations, AppExchange, and Connected Apps": ["Salesforce Integration Patterns", "https://developer.salesforce.com/docs/atlas.en-us.integration_patterns_and_practices.meta/integration_patterns_and_practices/integ_pat_intro_overview.htm"],
  "Release Management and DevOps for Admins": ["Application Lifecycle Management", "https://trailhead.salesforce.com/content/learn/modules/application-lifecycle-and-development-models"],
  "Org Governance and Center of Excellence": ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"],
  "Org Health, Scale, and Performance": ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"],
  "Senior Admin Leadership and Strategy": ["Salesforce Admin Career Path", "https://trailhead.salesforce.com/career-path/admin"],
  "Workplace Admin and Continuous Growth": ["Salesforce Admin Career Path", "https://trailhead.salesforce.com/career-path/admin"]
};

function sourceForTopic(topic) {
  const [label, url] = officialSalesforceSources[topic] || ["Salesforce Help", "https://help.salesforce.com/"];
  return { label, url };
}

function communityQuestion(item) {
  const [topic, bank, question, keywords, guide, sourceIndex] = item;
  const [label, url] = communityInterviewBank.resources[sourceIndex] || ["Salesforce Community Resource", "https://trailhead.salesforce.com/"];
  return { topic, bank, question, keywords, guide, coaching: "Confirm the answer against current Salesforce documentation and support it with a practical example.", verified: false, provenance: "community", source: { label, url }, type: "technical" };
}

const communityAdminQuestions = communityInterviewBank.admin.map(communityQuestion);

function adminKeywords(module, index) {
  return String(module.points[index % module.points.length]).toLowerCase().match(/[a-z]{4,}/g)?.slice(0, 7) || [];
}

function cleanObjective(value) {
  return String(value)
    .replace(/^(explain|understand|navigate|design|configure|use|build|create|choose|compare|manage|measure|establish|lead|review|plan|track|investigate|apply|protect|turn)\s+/i, "")
    .replace(/[.!?]+$/, "")
    .trim();
}

function lowerFirst(value) {
  const text = String(value).replace(/[.!?]+$/, "").trim();
  const properName = /^(CRM|Salesforce|AppExchange|OAuth|Omni-Channel|Experience Cloud|Service Cloud|Sales Cloud|Flow|Apex|SOQL|DML)\b/;
  if (properName.test(text) || /^[A-Z]{2,}\b/.test(text)) return text;
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function upperFirst(value) {
  const text = String(value).replace(/[.!?]+$/, "").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function adminGuidelines(module) {
  const title = module.title.toLowerCase();
  const general = "Follow a standard-first design, use least privilege, build and test in a sandbox, test with representative users, document the decision, deploy through change control, and verify the outcome after release.";
  if (/security|identity|external access/.test(title)) return "Start with least privilege. Use profiles mainly for defaults and permission sets or permission set groups for additional access. Set organization-wide defaults as the record-access baseline, then open access with the role hierarchy and sharing mechanisms only where required. Test object, field, and record access with real user personas.";
  if (/data modeling/.test(title)) return "Use standard objects and fields when they meet the requirement. Select field types and relationships based on ownership, deletion behavior, reporting, and roll-up needs. Document the model and validate it against reporting, security, automation, and future-scale requirements.";
  if (/data management/.test(title)) return "Profile and back up data before bulk operations. Test a small sample first, use external IDs where appropriate, control duplicates with matching and duplicate rules, review validation and automation impacts, and reconcile results after the operation.";
  if (/flow/.test(title)) return "Choose the simplest suitable Flow type, prefer before-save record-triggered Flow for same-record updates, avoid database operations inside loops, add fault handling, prevent recursion, and test positive, negative, bulk, and permission-sensitive paths.";
  if (/reports|dashboard/.test(title)) return "Confirm the business question first, verify report type and record visibility, apply clear filters and groupings, select actionable metrics, design for the intended audience, and validate results with source records.";
  if (/release|devops/.test(title)) return "Use source control and a defined environment strategy, validate dependencies, test with representative users, obtain approval, document rollback steps, deploy through a controlled release, and perform post-deployment verification.";
  if (/governance|leadership|growth/.test(title)) return "Use a governed intake and prioritization process, define ownership and standards, document decisions, align the roadmap to measurable business outcomes, manage technical debt, and review adoption and value regularly.";
  if (/sales cloud/.test(title)) return "Align configuration to the documented sales process, define clear stage and conversion criteria, protect data quality, use standard lead and opportunity capabilities first, and measure pipeline accuracy, conversion, activity, and revenue outcomes.";
  if (/service cloud/.test(title)) return "Design case intake and routing around service priorities, use queues and Omni-Channel appropriately, define escalation and SLA behavior, protect customer data, support agents with Knowledge and productivity tools, and measure resolution and service outcomes.";
  if (/integration|appexchange|connected apps/.test(title)) return "Define system ownership, data flow, frequency, volume, security, and failure handling before implementation. Apply least privilege to connected apps, protect credentials, assess package trust and dependencies, test upgrades, monitor failures, and maintain a retirement plan.";
  return general;
}

function buildAdminInterviewQuestions(module) {
  const templates = [
    (concept, topic) => `What should a Salesforce Administrator know about ${concept} in the context of ${topic}?`,
    (concept) => `When making decisions about ${concept}, what criteria and Salesforce alternatives should an administrator consider?`,
    (concept) => `How would you implement requirements related to ${concept} while following Salesforce best practices?`,
    (concept) => `How would you test, secure, and validate a Salesforce solution involving ${concept}?`,
    (concept) => `What risks and common mistakes should an administrator watch for when working with ${concept}?`
  ];
  return Array.from({ length: 15 }, (_, index) => {
    const point = module.points[index % module.points.length];
    const concept = cleanObjective(point);
    const practice = module.practice[index % module.practice.length];
    const questionType = Math.floor(index / module.points.length);
    const candidateAnswer = [
      `In Salesforce, ${lowerFirst(concept)} helps connect the platform to a specific business process and user outcome. As an administrator, I would first understand who uses it, what data it affects, and how success will be measured. For example, I would ${lowerFirst(practice)} and confirm that the result works for the intended users.`,
      `I would begin by clarifying the requirement and comparing the standard Salesforce options that support ${lowerFirst(concept)}. I would choose the simplest option that meets the need, explain the tradeoffs to stakeholders, and avoid unnecessary customization. I would then validate the decision with a small prototype or representative use case.`,
      `I would implement ${lowerFirst(concept)} in a sandbox after documenting the requirement and acceptance criteria. I would use standard Salesforce functionality where possible, review dependencies and user access, and keep the configuration clearly named and documented. For example, I would ${lowerFirst(practice)} before moving the change through the approved release process.`,
      `I would test ${lowerFirst(concept)} with representative data and user personas. My test plan would include the expected path, negative cases, access restrictions, and any automation or reporting dependencies. I would confirm the acceptance criteria before deployment and verify the result again after release.`,
      `The main risks with ${lowerFirst(concept)} are giving too much access, creating unnecessary complexity, missing dependencies, and testing only as an administrator. I would reduce those risks by using standard features, least privilege, sandbox testing, documentation, and a controlled deployment with post-release checks.`
    ][questionType];
    return {
      question: templates[questionType](concept, module.title),
      keywords: adminKeywords(module, index),
      guide: candidateAnswer,
      coaching: adminGuidelines(module),
      verified: false,
      provenance: "generated",
      source: sourceForTopic(module.title),
      type: "technical",
      bank: "interview",
      topic: module.title
    };
  });
}

function buildAdminScenarioQuestions(module) {
  const templates = [
    (task) => `A business team needs to ${task}. How would you take this request from discovery through a safe Salesforce release?`,
    (task) => `Users report that the solution used to ${task} is producing incorrect or unexpected results. How would you troubleshoot it?`,
    (task) => `An urgent request requires your team to ${task}. How would you deliver quickly without bypassing Salesforce governance?`,
    (task) => `Two stakeholder groups disagree about the best way to ${task}. How would you evaluate the options and recommend a solution?`,
    (task) => `An audit identifies security, data-quality, or maintainability risk in the process used to ${task}. What would you do?`
  ];
  return Array.from({ length: 15 }, (_, index) => {
    const practice = module.practice[index % module.practice.length];
    const point = module.points[index % module.points.length];
    const task = lowerFirst(practice);
    const scenarioType = Math.floor(index / module.practice.length);
    const candidateAnswer = [
      `I would start by meeting the business team to understand the outcome, affected users, data, access requirements, and acceptance criteria. I would review the standard Salesforce options, recommend the simplest maintainable solution, and build it in a sandbox. After testing with representative users, I would deploy it through change control and verify the agreed result.`,
      `I would first reproduce the issue using an affected user and record so I can confirm the scope. Then I would review recent changes, permissions, data, automation, and dependencies to identify the root cause. I would fix and regression-test the solution in a sandbox, communicate the impact, and verify the behavior after deployment.`,
      `I would acknowledge the urgency but keep the minimum safety controls. I would agree on the smallest viable scope, assess security and data impact, build and test in an approved environment, document rollback steps, and obtain the required approval. After deployment, I would monitor the result and communicate completion to stakeholders.`,
      `I would bring both groups back to the shared business outcome and agree on decision criteria such as user impact, security, maintainability, and reporting. I would compare standard Salesforce options, demonstrate tradeoffs with a prototype if needed, and document the approved decision before implementation.`,
      `I would contain the immediate risk first, then determine the affected users, records, and configuration. I would correct the root cause using least privilege and standard Salesforce controls, test the remediation, document the evidence, and add preventive monitoring or periodic review so the issue does not return.`
    ][scenarioType];
    return {
      question: templates[scenarioType](task),
      keywords: [...adminKeywords(module, index), "requirement", "test", "result"],
      guide: candidateAnswer,
      coaching: `${upperFirst(cleanObjective(point))}. ${adminGuidelines(module)}`,
      verified: false,
      provenance: "generated",
      source: sourceForTopic(module.title),
      type: "technical",
      bank: "scenario",
      topic: module.title
    };
  });
}

const adminTopicBank = adminModules.map((module, moduleIndex) => ({
  id: String(moduleIndex),
  title: module.title,
  description: module.description,
  interviewQuestions: [
    ...realWorldInterviewBank.admin.filter((item) => item.topic === module.title && item.bank === "interview").map((item) => ({ ...item, verified: true, source: sourceForTopic(module.title) })),
    ...communityAdminQuestions.filter((item) => item.topic === module.title && item.bank === "interview"),
    ...buildAdminInterviewQuestions(module)
  ],
  scenarioQuestions: [
    ...realWorldInterviewBank.admin.filter((item) => item.topic === module.title && item.bank === "scenario").map((item) => ({ ...item, verified: true, source: sourceForTopic(module.title) })),
    ...communityAdminQuestions.filter((item) => item.topic === module.title && item.bank === "scenario"),
    ...buildAdminScenarioQuestions(module)
  ]
}));
removeRepeatedQuestions(adminTopicBank, ["interviewQuestions", "scenarioQuestions"]);
const questionBank = {
  "Salesforce Administrator": [
    ["Explain the difference between a Profile and a Permission Set.", ["profile", "permission set", "access", "user"], "Start with base access versus additional access, explain assignment flexibility, and finish with a real security example."],
    ["How would you design record access for a private sales organization?", ["owd", "role", "sharing", "private"], "Explain OWD as the baseline, then roles, sharing rules, teams, and manual sharing based on business needs."],
    ["When would you use Flow instead of a validation rule?", ["flow", "validation", "automation", "record"], "Compare preventing invalid data with automating actions, then provide one example for each."],
    ["How do you safely import and clean Salesforce data?", ["import", "duplicate", "validation", "backup"], "Describe preparation, backups, unique identifiers, validation, duplicate management, testing, and verification."],
    ["What steps do you take before changing a page layout in production?", ["requirement", "sandbox", "test", "deploy"], "Mention requirements, user impact, sandbox testing, permissions, deployment, and post-release validation."]
  ],
  "Salesforce Developer": [
    ["What does bulkification mean in Apex, and why is it important?", ["bulk", "governor", "collection", "query"], "Define bulk processing, explain governor limits, and mention collections plus avoiding SOQL and DML inside loops."],
    ["Explain the difference between before and after triggers.", ["before", "after", "trigger", "record"], "Compare changing the same record before save with using saved IDs and related records after save."],
    ["How would you test an Apex service class?", ["test", "assert", "data", "starttest"], "Cover isolated test data, positive and negative cases, startTest/stopTest, assertions, and bulk scenarios."],
    ["When would you use an imperative Apex call instead of @wire in LWC?", ["imperative", "wire", "control", "mutation"], "Explain reactive read operations versus controlled execution and data-changing actions."],
    ["How do Named Credentials improve callout security?", ["credential", "authentication", "endpoint", "secret"], "Explain centralized endpoints and authentication, secret protection, and simpler maintainable callout code."]
  ],
  "Salesforce Consultant": [
    ["How do you turn a vague stakeholder request into a Salesforce solution?", ["question", "requirement", "process", "validate"], "Discuss discovery, current process, measurable outcomes, constraints, options, prototype, and validation."],
    ["How would you handle conflicting requirements from two departments?", ["stakeholder", "priority", "impact", "decision"], "Explain alignment on outcomes, impact analysis, facilitated decisions, documentation, and phased delivery."],
    ["What makes a Salesforce implementation successful after go-live?", ["adoption", "training", "support", "measure"], "Cover adoption, enablement, governance, support, metrics, feedback, and continuous improvement."],
    ["How do you decide between configuration and custom development?", ["configuration", "custom", "maintain", "requirement"], "Compare fit, complexity, maintenance, scalability, user experience, and total cost."],
    ["Describe how you would plan a Salesforce rollout.", ["phase", "risk", "test", "adoption"], "Explain scope, phases, data, testing, change management, training, deployment, and hypercare."]
  ],
  "Salesforce Architect": [
    ["How would you design Salesforce for high data volume?", ["volume", "selective", "index", "archive"], "Discuss data model, selective queries, indexing, sharing, async processing, archival, and monitoring."],
    ["How do you evaluate an integration architecture?", ["integration", "latency", "volume", "failure"], "Cover business needs, direction, latency, volume, security, reliability, retries, monitoring, and ownership."],
    ["How would you design a scalable Salesforce security model?", ["owd", "role", "sharing", "scale"], "Start with least privilege and OWD, then evaluate hierarchy, sharing mechanisms, performance, and governance."],
    ["When should a solution use asynchronous Apex?", ["async", "queueable", "batch", "limit"], "Compare transaction needs, limits, volume, chaining, scheduling, monitoring, and failure handling."],
    ["How do you document and defend an architecture decision?", ["option", "tradeoff", "risk", "decision"], "State context and constraints, compare options, document tradeoffs and risks, then define the decision and review plan."]
  ]
};

const behavioralBank = {
  "Salesforce Administrator": [
    ["Tell me about a time you improved a Salesforce process for users.", ["situation", "task", "action", "result", "user"], "Use STAR: explain the user problem, your responsibility, the actions you owned, and the measurable result."],
    ["Describe a time you protected data while meeting an urgent business request.", ["situation", "action", "security", "result", "stakeholder"], "Use STAR and explain how you balanced least privilege, urgency, communication, and the outcome."]
  ],
  "Salesforce Developer": [
    ["Tell me about a difficult Salesforce defect you diagnosed and fixed.", ["situation", "task", "action", "result", "debug"], "Use STAR: explain the impact, your debugging responsibility, your evidence-led actions, and the verified result."],
    ["Describe a time you improved the quality of a Salesforce solution.", ["situation", "action", "test", "result", "quality"], "Use STAR and highlight your contribution, technical tradeoffs, tests, collaboration, and result."]
  ],
  "Salesforce Consultant": [
    ["Tell me about a time you handled conflicting stakeholder requirements.", ["situation", "task", "action", "result", "stakeholder"], "Use STAR: describe the conflict, your role, how you facilitated a decision, and the business result."],
    ["Describe a Salesforce rollout where you improved user adoption.", ["situation", "action", "adoption", "result", "user"], "Use STAR and include discovery, enablement actions, feedback, and measurable adoption impact."]
  ],
  "Salesforce Architect": [
    ["Tell me about a time you defended a difficult architecture decision.", ["situation", "task", "action", "result", "tradeoff"], "Use STAR and explain constraints, options, your recommendation, stakeholder alignment, and the outcome."],
    ["Describe a time an architecture assumption proved wrong and how you responded.", ["situation", "action", "risk", "result", "learn"], "Use STAR and show ownership, evidence, correction, communication, and what changed afterward."]
  ]
};

let session = null;
let timerInterval = null;
let speechRecognition = null;
let speechIsListening = false;
let speechFinalTranscript = "";
let speechStartingText = "";
let speechLatestInterim = "";
let speechShouldListen = false;
let speechRestartTimer = null;
let interviewMediaRecorder = null;
let interviewMediaStream = null;
let interviewAudioChunks = [];
let interviewRecordingStartedAt = 0;
let lastFeedbackSpeech = "";
let activeVoiceAudio = null;
let activeVoiceUrl = "";
const el = (id) => document.getElementById(id);
const interviewVocabulary = ["Salesforce", "CRM", "Trailhead", "Apex", "SOQL", "SOSL", "LWC", "Flow", "Flow Builder", "Lightning", "AppExchange", "OAuth", "permission set", "profile", "sharing rule", "organization-wide default", "sandbox", "DevOps", "Opportunity", "Account", "Contact"];
const interviewSpeechCorrections = [
  [/\bsales force\b/gi, "Salesforce"], [/\bsalesforce\b/gi, "Salesforce"], [/\btrail head\b/gi, "Trailhead"],
  [/\ba pecs\b/gi, "Apex"], [/\bapex\b/gi, "Apex"], [/\bso q l\b/gi, "SOQL"], [/\bs o q l\b/gi, "SOQL"],
  [/\bsequel\b/gi, "SOQL"], [/\bso s l\b/gi, "SOSL"], [/\bl w c\b/gi, "LWC"], [/\bcrm\b/gi, "CRM"],
  [/\bapp exchange\b/gi, "AppExchange"], [/\bo auth\b/gi, "OAuth"], [/\bdev ops\b/gi, "DevOps"]
];

function scoreBand(score) {
  return score >= 75 ? "score-green" : score >= 50 ? "score-yellow" : "score-red";
}

function setInterviewerActivity(mode, message) {
  document.querySelectorAll(".ai-orb").forEach((orb) => {
    orb.classList.toggle("speaking", mode === "speaking");
    orb.classList.toggle("listening", mode === "listening");
  });
  el("questionState")?.classList.toggle("interviewer-speaking", mode === "speaking");
  el("questionState")?.classList.toggle("interviewer-listening", mode === "listening");
  if (el("interviewerActivity")) el("interviewerActivity").textContent = message || (mode === "speaking" ? "Asking your question" : mode === "listening" ? "Listening to your answer" : "Waiting for your answer");
}

function browserSpeak(text, afterSpeak) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window) || !text) {
    afterSpeak?.();
    return;
  }
  stopVoiceInput();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = el("speechLanguage")?.value || "en-IN";
  utterance.rate = 0.95;
  utterance.pitch = 0.92;
  utterance.onstart = () => setInterviewerActivity("speaking");
  utterance.onend = () => {
    setInterviewerActivity("idle");
    afterSpeak?.();
  };
  utterance.onerror = () => setInterviewerActivity("idle");
  window.speechSynthesis.speak(utterance);
}

function stopSpokenAudio() {
  window.speechSynthesis?.cancel();
  if (activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio = null;
  }
  if (activeVoiceUrl) {
    URL.revokeObjectURL(activeVoiceUrl);
    activeVoiceUrl = "";
  }
  setInterviewerActivity("idle");
}

async function speak(text, afterSpeak) {
  if (!text) {
    afterSpeak?.();
    return;
  }
  stopVoiceInput();
  stopSpokenAudio();
  try {
    const response = await fetch("/api/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error("ElevenLabs voice unavailable");
    activeVoiceUrl = URL.createObjectURL(await response.blob());
    activeVoiceAudio = new Audio(activeVoiceUrl);
    activeVoiceAudio.onplay = () => setInterviewerActivity("speaking");
    activeVoiceAudio.onended = () => {
      stopSpokenAudio();
      afterSpeak?.();
    };
    activeVoiceAudio.onerror = () => {
      stopSpokenAudio();
      browserSpeak(text, afterSpeak);
    };
    await activeVoiceAudio.play();
  } catch {
    stopSpokenAudio();
    browserSpeak(text, afterSpeak);
  }
}

function showState(id) {
  stopVoiceInput();
  ["welcomeState", "questionState", "feedbackState", "resultState"].forEach((stateId) => el(stateId).classList.toggle("hidden", stateId !== id));
}

function updateWordCount() {
  const words = el("answerInput").value.trim() ? el("answerInput").value.trim().split(/\s+/).length : 0;
  el("wordCount").textContent = `${words} words`;
}

function setVoiceStatus(message, type = "") {
  el("voiceStatus").className = `voice-status ${type}`.trim();
  el("voiceStatus").textContent = message;
}

function joinSpeechText(...parts) {
  return parts.filter(Boolean).join(" ").replace(/ +\n/g, "\n").replace(/\n +/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
}

function normalizeInterviewTranscript(text) {
  let normalized = String(text)
    .replace(/\b(new line|next line)\b/gi, "\n")
    .replace(/\b(full stop|period)\b/gi, ".")
    .replace(/\bcomma\b/gi, ",");
  interviewSpeechCorrections.forEach(([pattern, replacement]) => { normalized = normalized.replace(pattern, replacement); });
  return normalized.replace(/\s+([.,?!])/g, "$1").replace(/[ \t]{2,}/g, " ").trim();
}

function bestSpeechAlternative(result) {
  let best = result[0];
  let bestScore = -1;
  for (let index = 0; index < result.length; index += 1) {
    const alternative = result[index];
    const lower = alternative.transcript.toLowerCase();
    const vocabularyMatches = interviewVocabulary.filter((term) => lower.includes(term.toLowerCase())).length;
    const score = (Number(alternative.confidence) || 0) + vocabularyMatches * 0.18;
    if (score > bestScore) {
      best = alternative;
      bestScore = score;
    }
  }
  return best;
}

function renderSpeechTranscript(interim = "") {
  const transcript = normalizeInterviewTranscript(joinSpeechText(speechFinalTranscript, interim));
  el("answerInput").value = joinSpeechText(speechStartingText, transcript);
  updateWordCount();
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function transcribeRecordedAnswer(blob) {
  if (!blob.size || blob.size < 500) return;
  setVoiceStatus("Improving the transcript from the recorded microphone audio...", "processing");
  try {
    const response = await fetch("/api/ai/transcribe-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: await blobToBase64(blob),
        mimeType: blob.type || "audio/webm",
        language: el("speechLanguage").value,
        question: session?.questions?.[session.index]?.question || ""
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.transcript) throw new Error(result.error || "Accurate transcription was unavailable.");
    el("answerInput").value = joinSpeechText(speechStartingText, normalizeInterviewTranscript(result.transcript));
    updateWordCount();
    setVoiceStatus("High-accuracy transcript completed from the recorded audio.", "success");
  } catch (error) {
    setVoiceStatus(`${error.message} The live preview text was kept so you can edit it.`, "error");
  }
}

let visualizerAudioCtx = null;
let visualizerAnalyser = null;
let visualizerSource = null;
let visualizerAnimationFrame = null;
let visualizerIsActive = false;

function startAudioVisualizer(stream) {
  const canvas = el("interviewerVisualizer");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 160;
  canvas.height = 40;
  const wave = document.querySelector(".interviewer-wave");
  if (wave) wave.classList.add("hidden");
  canvas.classList.remove("hidden");
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    visualizerAudioCtx = new AudioContextClass();
    visualizerSource = visualizerAudioCtx.createMediaStreamSource(stream);
    visualizerAnalyser = visualizerAudioCtx.createAnalyser();
    visualizerAnalyser.fftSize = 64;
    visualizerSource.connect(visualizerAnalyser);
    const bufferLength = visualizerAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    visualizerIsActive = true;
    function draw() {
      if (!visualizerIsActive) return;
      visualizerAnimationFrame = requestAnimationFrame(draw);
      visualizerAnalyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 0.95;
      let barHeight;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const factor = i > 3 && i < 15 ? 1.4 : 1.0;
        barHeight = (dataArray[i] / 255) * canvas.height * 0.85 * factor;
        barHeight = Math.max(3, Math.min(canvas.height, barHeight));
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "rgba(8, 126, 164, 0.25)");
        grad.addColorStop(0.5, "#67d4f5");
        grad.addColorStop(1, "#d8ff5f");
        ctx.fillStyle = grad;
        const y = (canvas.height - barHeight) / 2;
        if (typeof ctx.roundRect === "function") {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 1.5, barHeight, 2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth - 1.5, barHeight);
        }
        x += barWidth;
      }
    }
    draw();
  } catch (e) {
    console.error("Audio visualizer failed to start", e);
    stopAudioVisualizer();
  }
}

function stopAudioVisualizer() {
  visualizerIsActive = false;
  if (visualizerAnimationFrame) {
    cancelAnimationFrame(visualizerAnimationFrame);
    visualizerAnimationFrame = null;
  }
  if (visualizerAudioCtx) {
    if (visualizerAudioCtx.state !== "closed") {
      visualizerAudioCtx.close();
    }
    visualizerAudioCtx = null;
  }
  visualizerSource = null;
  visualizerAnalyser = null;
  const canvas = el("interviewerVisualizer");
  const wave = document.querySelector(".interviewer-wave");
  if (canvas) canvas.classList.add("hidden");
  if (wave) wave.classList.remove("hidden");
}

async function startHighAccuracyRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return false;
  try {
    interviewMediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
    const preferredType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find((type) => MediaRecorder.isTypeSupported(type));
    interviewMediaRecorder = new MediaRecorder(interviewMediaStream, preferredType ? { mimeType: preferredType, audioBitsPerSecond: 128000 } : undefined);
    interviewAudioChunks = [];
    interviewMediaRecorder.ondataavailable = (event) => { if (event.data.size) interviewAudioChunks.push(event.data); };
    interviewMediaRecorder.onstop = () => {
      stopAudioVisualizer();
      const blob = new Blob(interviewAudioChunks, { type: interviewMediaRecorder?.mimeType || "audio/webm" });
      interviewMediaStream?.getTracks().forEach((track) => track.stop());
      interviewMediaStream = null;
      interviewMediaRecorder = null;
      interviewAudioChunks = [];
      if (Date.now() - interviewRecordingStartedAt > 700) transcribeRecordedAnswer(blob);
    };
    interviewRecordingStartedAt = Date.now();
    interviewMediaRecorder.start(1000);
    startAudioVisualizer(interviewMediaStream);
    return true;
  } catch {
    interviewMediaStream?.getTracks().forEach((track) => track.stop());
    interviewMediaStream = null;
    interviewMediaRecorder = null;
    return false;
  }
}

function stopHighAccuracyRecording() {
  stopAudioVisualizer();
  if (interviewMediaRecorder?.state === "recording") interviewMediaRecorder.stop();
  else interviewMediaStream?.getTracks().forEach((track) => track.stop());
}

function stopVoiceInput() {
  speechShouldListen = false;
  clearTimeout(speechRestartTimer);
  if (speechRecognition && speechIsListening) speechRecognition.stop();
  stopHighAccuracyRecording();
  el("voiceInputBtn")?.classList.remove("listening");
  el("voiceInputBtn")?.setAttribute("aria-pressed", "false");
  if (el("voiceButtonText")) el("voiceButtonText").textContent = "Start voice answer";
  if (!el("questionState")?.classList.contains("hidden")) setInterviewerActivity("idle");
}

function setupVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    el("voiceInputBtn").disabled = true;
    setVoiceStatus("Voice-to-text is not supported in this browser. Use Chrome or Edge, or type your answer.", "error");
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.maxAlternatives = 5;

  speechRecognition.onstart = () => {
    speechIsListening = true;
    el("voiceInputBtn").classList.add("listening");
    el("voiceInputBtn").setAttribute("aria-pressed", "true");
    el("voiceButtonText").textContent = "Stop listening";
    setVoiceStatus(interviewMediaRecorder ? "Recording high-quality audio. Live text is only a rough preview." : "Listening continuously. Speak naturally and pause when needed.", "listening");
    setInterviewerActivity("listening");
  };

  speechRecognition.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = bestSpeechAlternative(event.results[index]).transcript.trim();
      if (event.results[index].isFinal) final = joinSpeechText(final, transcript);
      else interim = joinSpeechText(interim, transcript);
    }
    if (final) speechFinalTranscript = joinSpeechText(speechFinalTranscript, final);
    speechLatestInterim = interim;
    renderSpeechTranscript(interim);
    setVoiceStatus(interim ? "Listening and processing your current sentence..." : "Sentence captured. Keep speaking or press Stop listening.", "listening");
  };

  speechRecognition.onerror = (event) => {
    const messages = { "not-allowed": "Microphone permission was denied. Allow microphone access to use voice-to-text.", "no-speech": "No speech detected yet. Listening will resume automatically.", "audio-capture": "No microphone was found on this device.", network: "Voice recognition had a network interruption. Listening will resume automatically." };
    if (["not-allowed", "service-not-allowed", "audio-capture"].includes(event.error)) speechShouldListen = false;
    setVoiceStatus(messages[event.error] || "Voice recognition stopped because of a browser error.", "error");
  };

  speechRecognition.onend = () => {
    speechIsListening = false;
    if (speechLatestInterim) {
      speechFinalTranscript = joinSpeechText(speechFinalTranscript, speechLatestInterim);
      speechLatestInterim = "";
      renderSpeechTranscript();
    }
    if (!speechShouldListen) setInterviewerActivity("idle");
    if (speechShouldListen) {
      setVoiceStatus("Brief pause detected. Resuming listening...", "listening");
      speechRestartTimer = setTimeout(() => {
        if (!speechShouldListen) return;
        try { speechRecognition.start(); } catch { setVoiceStatus("Could not resume voice recognition. Press Start voice answer.", "error"); }
      }, 250);
      return;
    }
    el("voiceInputBtn").classList.remove("listening");
    el("voiceInputBtn").setAttribute("aria-pressed", "false");
    el("voiceButtonText").textContent = "Start voice answer";
    if (!el("voiceStatus").classList.contains("error")) setVoiceStatus("Voice-to-text stopped. You can edit the transcript or submit your answer.");
  };

  async function startListening() {
    if (speechShouldListen || speechIsListening) {
      stopVoiceInput();
      return;
    }
    speechStartingText = el("answerInput").value.trim();
    speechFinalTranscript = "";
    speechLatestInterim = "";
    speechShouldListen = true;
    const recordingReady = await startHighAccuracyRecording();
    if (!speechShouldListen) {
      stopHighAccuracyRecording();
      return;
    }
    speechRecognition.lang = el("speechLanguage").value;
    try { speechRecognition.start(); } catch {
      speechShouldListen = false;
      stopHighAccuracyRecording();
      setVoiceStatus("Voice recognition is already starting. Please wait a moment.", "error");
    }
    if (!recordingReady) setVoiceStatus("High-accuracy recording is unavailable. Using browser live recognition.", "error");
  }

  el("voiceInputBtn").addEventListener("click", startListening);
  window.startInterviewListening = startListening;
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(INTERVIEW_HISTORY_KEY)) || []; } catch { return []; }
}

function saveHistory(item) {
  const history = [item, ...loadHistory()].slice(0, 8);
  localStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(history));
  renderHistory();
  renderWeaknessDashboard();
}

function renderHistory() {
  const history = loadHistory();
  el("heroSessionCount").textContent = history.length;
  el("heroBestScore").textContent = `${history.reduce((best, item) => Math.max(best, item.score), 0)}%`;
  el("historyList").innerHTML = history.length ? history.map((item) => `<div class="history-item"><div><strong>${item.role}</strong><span>${item.score}%</span></div><p>${item.difficulty} · ${item.format || "mixed"} · ${item.questions} questions · ${item.date}</p></div>`).join("") : '<p class="empty-state">Complete an interview to see your history.</p>';
}

function averageValues(values) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function readinessBar(label, score) {
  const state = score < 50 ? "weak" : score < 75 ? "developing" : "strong";
  return `<div class="readiness-bar ${state}"><div class="readiness-bar-heading"><span>${escapeInterviewHtml(label)}</span><b>${score}%</b></div><div class="readiness-bar-track"><span style="width:${Math.max(2, score)}%"></span></div></div>`;
}

function renderWeaknessDashboard() {
  const history = loadHistory();
  const reviewRecords = Object.values(interviewReviewRecords);
  let codingProgress = {};
  try { codingProgress = JSON.parse(localStorage.getItem("tomcodex.developerCodingProgress.v1")) || {}; } catch { codingProgress = {}; }
  const codingScores = Object.values(codingProgress).map((item) => Number(item.score) || 0);
  const hasData = history.length || reviewRecords.length || codingScores.length;
  el("weaknessDashboardEmpty").classList.toggle("hidden", Boolean(hasData));
  el("weaknessDashboardContent").classList.toggle("hidden", !hasData);
  if (!hasData) {
    el("overallReadinessScore").textContent = "0%";
    return;
  }
  const interviewScore = averageValues(history.map((item) => Number(item.score) || 0));
  const reviewConfidenceMap = { learning: 35, hard: 45, good: 70, easy: 90 };
  const reviewScore = averageValues(reviewRecords.map((item) => reviewConfidenceMap[item.confidence] || 35));
  const codingScore = averageValues(codingScores);
  const overall = averageValues([interviewScore, reviewScore, codingScore].filter((score) => score > 0));
  el("overallReadinessScore").textContent = `${overall}%`;
  el("readinessMetricGrid").innerHTML = [["Interview average", interviewScore ? `${interviewScore}%` : "--"], ["Review confidence", reviewScore ? `${reviewScore}%` : "--"], ["Coding readiness", codingScore ? `${codingScore}%` : "--"], ["Questions due", reviewRecords.filter(isReviewDue).length], ["Milestones", "7/7"]].map(([label, value]) => `<div class="readiness-metric"><strong>${value}</strong><span>${label}</span></div>`).join("");

  const dimensionNames = ["technical", "clarity", "example", "confidence"];
  const dimensions = dimensionNames.map((name) => [name, averageValues(history.map((item) => Number(item.dimensions?.[name]) || 0).filter(Boolean))]);
  el("dimensionReadiness").innerHTML = dimensions.some(([, score]) => score) ? dimensions.map(([name, score]) => readinessBar(name, score)).join("") : '<p class="empty-state">Complete a new interview to capture dimension trends.</p>';
  const roleGroups = history.reduce((groups, item) => {
    groups[item.role] ||= [];
    groups[item.role].push(Number(item.score) || 0);
    return groups;
  }, {});
  el("roleReadiness").innerHTML = Object.keys(roleGroups).length ? Object.entries(roleGroups).map(([role, scores]) => readinessBar(role, averageValues(scores))).join("") : '<p class="empty-state">Role readiness appears after an interview.</p>';

  const topicGroups = reviewRecords.reduce((groups, item) => {
    if (!item.topic) return groups;
    groups[item.topic] ||= [];
    groups[item.topic].push(reviewConfidenceMap[item.confidence] || 35);
    return groups;
  }, {});
  history.forEach((item) => Object.entries(item.topicScores || {}).forEach(([topic, score]) => {
    topicGroups[topic] ||= [];
    topicGroups[topic].push(Number(score) || 0);
  }));
  const weakTopics = Object.entries(topicGroups).map(([topic, scores]) => [topic, averageValues(scores)]).sort((a, b) => a[1] - b[1]).slice(0, 5);
  el("weakTopicList").innerHTML = weakTopics.length ? weakTopics.map(([topic, score]) => `<div><span>${escapeInterviewHtml(topic)}</span><b>${score}%</b></div>`).join("") : '<p class="empty-state">Rate study questions to identify weak topics.</p>';

  const recent = [...history].reverse().slice(-8);
  el("readinessTrend").innerHTML = recent.length ? recent.map((item) => `<div><i style="height:${Math.max(4, Number(item.score) || 0)}%"></i><span>${Number(item.score) || 0}%</span></div>`).join("") : '<p class="empty-state">Complete interviews to show your readiness trend.</p>';
  const weakestDimension = dimensions.filter(([, score]) => score > 0).sort((a, b) => a[1] - b[1])[0];
  const weakestRole = Object.entries(roleGroups).map(([role, scores]) => [role, averageValues(scores)]).sort((a, b) => a[1] - b[1])[0];
  const recommendedRole = weakestRole?.[0] || (codingScore && codingScore < 75 ? "Salesforce Developer" : "Salesforce Administrator");
  const recommendation = weakestDimension?.[0] === "example" ? "Hiring Manager Round" : weakestDimension?.[0] === "technical" ? "Technical Round" : weakTopics.length ? "Focused Topic Practice" : "Full Interview Process";
  el("nextSessionRecommendation").textContent = `${recommendedRole} - ${recommendation}`;
  el("nextSessionReason").textContent = weakTopics.length ? `Prioritize ${weakTopics[0][0]} and improve ${weakestDimension?.[0] || "overall confidence"}.` : `Build more evidence by completing a ${recommendation.toLowerCase()}.`;
  el("applyNextSessionBtn").dataset.role = recommendedRole;
  el("applyNextSessionBtn").dataset.round = recommendation === "Hiring Manager Round" ? "manager" : recommendation === "Technical Round" ? "technical" : recommendation === "Full Interview Process" ? "full" : "focused";
}

function normalizeQuestion(item, type = "technical") {
  if (Array.isArray(item)) return { question: item[0], keywords: item[1], guide: item[2], coaching: "", type, topic: "" };
  return {
    question: String(item.question || ""),
    keywords: Array.isArray(item.keywords) ? item.keywords.map((keyword) => String(keyword).toLowerCase()) : [],
    guide: String(item.answerGuide || item.guide || "Explain your reasoning, actions, and result clearly."),
    coaching: String(item.coaching || ""),
    verified: Boolean(item.verified),
    provenance: String(item.provenance || (item.verified ? "verified" : "generated")),
    source: item.source || null,
    type: item.type === "behavioral" ? "behavioral" : "technical",
    topic: String(item.topic || "")
  };
}

function localQuestions(role, format, count, jobContext, adminTopic = "all", adminQuestionType = "mixed") {
  const selectedAdminTopics = adminTopicBank.filter((topic) => adminTopic === "all" || topic.id === adminTopic);
  const adminRows = selectedAdminTopics.map((topic) => adminQuestionType === "interview"
    ? topic.interviewQuestions
    : adminQuestionType === "scenario"
      ? topic.scenarioQuestions
      : topic.interviewQuestions.flatMap((item, index) => [item, topic.scenarioQuestions[index]]));
  const adminTechnical = Array.from({ length: Math.max(0, ...adminRows.map((row) => row.length)) }, (_, questionIndex) => adminRows.map((row) => row[questionIndex]).filter(Boolean))
    .flat()
    .map((item) => normalizeQuestion(item, "technical"));
  const roleRealWorld = (realWorldInterviewBank.roles[role] || []).map((item) => normalizeQuestion(item, "technical"));
  const roleCommunity = (communityInterviewBank.roles[role] || []).map((item) => {
    const [question, keywords, guide, sourceIndex] = item;
    const [label, url] = communityInterviewBank.resources[sourceIndex] || ["Salesforce Community Resource", "https://trailhead.salesforce.com/"];
    return normalizeQuestion({ question, keywords, guide, provenance: "community", source: { label, url } }, "technical");
  });
  const developerTechnical = developerInterviewTopics.flatMap((topic) => [...topic.questions, ...topic.practiceQuestions]).map((item) => normalizeQuestion(item, "technical"));
  const technical = role === "Salesforce Administrator" && adminTechnical.length
    ? adminTechnical
    : role === "Salesforce Developer" && developerTechnical.length
      ? [...developerTechnical, ...roleRealWorld, ...roleCommunity, ...questionBank[role].map((item) => normalizeQuestion(item, "technical"))]
      : [...roleRealWorld, ...roleCommunity, ...questionBank[role].map((item) => normalizeQuestion(item, "technical"))];
  const behavioral = behavioralBank[role].map((item) => normalizeQuestion(item, "behavioral"));
  let source = format === "technical" ? technical : format === "behavioral" ? behavioral : technical.flatMap((item, index) => [item, behavioral[index % behavioral.length]]);
  const terms = [...new Set((jobContext.toLowerCase().match(/[a-z]{5,}/g) || []))].slice(0, 5);
  if (terms.length) {
    const contextualQuestion = format === "behavioral"
      ? { question: `This role emphasizes ${terms.join(", ")}. Describe how your Salesforce experience prepares you for those responsibilities.`, keywords: [...terms, "result"], guide: "Connect the role requirements to a specific project, explain your contribution, and state the result.", type: "behavioral" }
      : { question: `Design a Salesforce solution for a role emphasizing ${terms.join(", ")}. Explain your approach, tradeoffs, security, testing, and verification.`, keywords: [...terms, "security", "test"], guide: "Clarify the requirement, choose standard-first Salesforce capabilities, explain tradeoffs, apply security, test with representative users, and verify the business outcome.", type: "technical" };
    source = [contextualQuestion, ...source];
  }
  return Array.from({ length: count }, (_, index) => source[index % source.length]);
}

async function generateInterviewQuestions(setup) {
  if (setup.role === "Salesforce Administrator") {
    return { questions: localQuestions(setup.role, setup.format, setup.count, setup.jobContext, setup.adminTopic, setup.adminQuestionType), source: "real-world-admin-bank" };
  }
  const realWorldRoleQuestions = setup.format === "behavioral" ? [] : localQuestions(setup.role, "technical", setup.count, "").slice(0, setup.count);
  try {
    const response = await fetch(INTERVIEW_QUESTION_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(setup) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.questions) || result.questions.length < setup.count) throw new Error("AI questions unavailable");
    const generatedQuestions = result.questions.map((item) => normalizeQuestion(item));
    return { questions: [...realWorldRoleQuestions, ...generatedQuestions].slice(0, setup.count), source: "real-world-bank-plus-centralized-ai" };
  } catch {
    return { questions: localQuestions(setup.role, setup.format, setup.count, setup.jobContext, setup.adminTopic, setup.adminQuestionType), source: "real-world-local-interview-bank" };
  }
}

function selectedInterviewRounds(roundSelection) {
  if (roundSelection === "full") return ["screening", "technical", "scenario", "manager"];
  if (roundSelection === "focused") return ["focused"];
  return [roundSelection];
}

async function generateRoundInterview(setup) {
  const rounds = selectedInterviewRounds(setup.round);
  const generatedRounds = await Promise.all(rounds.map(async (roundKey) => {
    const definition = INTERVIEW_ROUNDS[roundKey];
    const roundSetup = roundKey === "focused" ? setup : {
      ...setup,
      format: definition.format,
      difficulty: setup.roundDifficulty === "realistic" ? definition.difficulty : setup.difficulty,
      jobContext: [setup.jobContext, `Interview round focus: ${definition.focus}.`].filter(Boolean).join(" "),
      adminQuestionType: roundKey === "scenario" ? "scenario" : roundKey === "technical" ? "interview" : setup.adminQuestionType
    };
    const curatedRoundQuestions = INTERVIEW_ROUND_QUESTIONS[roundKey]?.map((item) => normalizeQuestion(item, "behavioral"));
    const generated = curatedRoundQuestions
      ? { questions: Array.from({ length: setup.count }, (_, index) => curatedRoundQuestions[index % curatedRoundQuestions.length]), source: "realistic-round-bank" }
      : await generateInterviewQuestions(roundSetup);
    const roundLabel = roundKey === "focused" ? "Focused Practice" : definition.label;
    return {
      source: generated.source,
      questions: generated.questions.map((question) => ({ ...question, roundKey, roundLabel, roundDifficulty: roundSetup.difficulty }))
    };
  }));
  return {
    questions: generatedRounds.flatMap((round) => round.questions),
    source: [...new Set(generatedRounds.map((round) => round.source))].join("+"),
    rounds
  };
}

async function startInterview() {
  const setup = { role: el("roleSelect").value, difficulty: el("difficultySelect").value, format: el("formatSelect").value, round: el("interviewRoundSelect").value, roundDifficulty: el("roundDifficultySelect").value, count: Number(el("questionCountSelect").value), jobContext: el("jobContextInput").value.trim(), adminTopic: el("adminTopicSelect").value, adminQuestionType: el("adminQuestionTypeSelect").value };
  const button = el("startInterviewBtn");
  button.disabled = true;
  button.textContent = "Preparing interview...";
  const generated = await generateRoundInterview(setup);
  button.disabled = false;
  button.textContent = "Start mock interview";
  session = { ...setup, questions: generated.questions, source: generated.source, rounds: generated.rounds, adaptive: el("adaptiveInterviewToggle").checked, voiceMode: el("voiceInterviewToggle").checked, adaptiveFocus: "", index: 0, scores: [] };
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerInterval);
  showState("questionState");
  const question = session.questions[session.index];
  const roundQuestions = session.questions.filter((item) => item.roundKey === question.roundKey);
  const roundQuestionIndex = session.questions.slice(0, session.index + 1).filter((item) => item.roundKey === question.roundKey).length;
  el("questionProgress").textContent = `${question.roundLabel} - Question ${roundQuestionIndex} of ${roundQuestions.length}`;
  el("questionMeta").textContent = `${session.role} | ${question.roundDifficulty || session.difficulty} | ${question.type}${session.adaptiveFocus ? ` | focus: ${session.adaptiveFocus}` : ""}`;
  el("questionText").textContent = question.question;
  el("answerInput").value = "";
  el("wordCount").textContent = "0 words";
  setInterviewerActivity(session.voiceMode ? "speaking" : "idle", session.voiceMode ? "Preparing to ask your question" : "Waiting for your answer");
  if (session.voiceMode) speak(`Question ${session.index + 1}. ${question.question}`, () => window.startInterviewListening?.());
  const questionDifficulty = question.roundDifficulty || session.difficulty;
  let seconds = questionDifficulty === "Advanced" ? 90 : questionDifficulty === "Beginner" ? 150 : 120;
  updateTimer(seconds);
  timerInterval = setInterval(() => { seconds -= 1; updateTimer(seconds); if (seconds <= 0) { clearInterval(timerInterval); evaluateAnswer(); } }, 1000);
}

function updateTimer(seconds) {
  el("timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  el("timer").classList.toggle("warning", seconds <= 30);
}

function comparisonConcepts(question) {
  const stopWords = new Set(["about", "after", "before", "clear", "describe", "explain", "include", "mention", "provide", "should", "their", "through", "using", "versus", "which", "while", "would", "with"]);
  const modelTerms = String(question.guide || "").toLowerCase().match(/[a-z][a-z0-9_-]{4,}/g) || [];
  return [...new Set([...(question.keywords || []), ...modelTerms.filter((term) => !stopWords.has(term)).slice(0, 8)])].slice(0, 12);
}

function answerStructureComparison(answer, type) {
  if (type === "behavioral") {
    return [
      ["Situation or context", /situation|context|project|when|during/i.test(answer)],
      ["Task or responsibility", /task|responsib|goal|needed|asked/i.test(answer)],
      ["Actions you personally took", /\bi\b|action|implemented|created|worked|designed|resolved/i.test(answer)],
      ["Result or learning", /result|outcome|improv|reduc|increas|percent|%|learned/i.test(answer)]
    ];
  }
  return [
    ["Direct definition or recommendation", answer.trim().split(/\s+/).length >= 8],
    ["Salesforce-specific implementation detail", /salesforce|apex|flow|permission|sharing|soql|lwc|object|record|field|security/i.test(answer)],
    ["Reasoning or tradeoff", /because|reason|tradeoff|however|instead|choose|depends/i.test(answer)],
    ["Practical example or scenario", /example|project|scenario|when|such as/i.test(answer)],
    ["Testing or verification", /test|verify|validate|monitor|assert/i.test(answer)]
  ];
}

function improvedAnswerSteps(type, missingConcepts) {
  const concepts = missingConcepts.length ? missingConcepts.slice(0, 4).join(", ") : "the strongest Salesforce-specific details";
  return type === "behavioral"
    ? [`Open with the situation and business impact.`, `State your responsibility and decision clearly.`, `Explain the actions you personally took, including ${concepts}.`, `Finish with a measurable result and what you learned.`]
    : [`Give a direct recommendation or definition first.`, `Explain the Salesforce implementation using ${concepts}.`, `Discuss security, scale, and the important tradeoff.`, `Close with a practical example plus testing and verification.`];
}

function escapeInterviewHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function evaluateAnswer() {
  clearInterval(timerInterval);
  const answer = el("answerInput").value.trim();
  const question = session.questions[session.index];
  const { keywords, guide: model, type } = question;
  const normalized = answer.toLowerCase();
  const concepts = comparisonConcepts(question);
  const matchedConcepts = concepts.filter((concept) => normalized.includes(concept.toLowerCase()));
  const missingConcepts = concepts.filter((concept) => !normalized.includes(concept.toLowerCase()));
  const structureChecks = answerStructureComparison(answer, type);
  const matched = keywords.filter((keyword) => normalized.includes(keyword)).length;
  const words = answer ? answer.split(/\s+/).length : 0;
  const technical = Math.min(100, 30 + matched * 17);
  const clarity = Math.min(100, words >= 45 ? 90 : words >= 25 ? 75 : words >= 12 ? 55 : 30);
  const star = {
    situation: /situation|context|project|when|during/i.test(answer) ? 100 : 35,
    task: /task|responsib|goal|needed|asked/i.test(answer) ? 100 : 35,
    action: /\bi\b|action|implemented|created|worked|designed|resolved/i.test(answer) ? 100 : 35,
    result: /result|outcome|improv|reduc|increas|percent|%|learned/i.test(answer) ? 100 : 35
  };
  const starAverage = Math.round(Object.values(star).reduce((sum, value) => sum + value, 0) / 4);
  const example = type === "behavioral" ? starAverage : /example|project|scenario|when|such as/i.test(answer) ? 90 : 45;
  const confidence = Math.min(100, Math.round((clarity + technical) / 2));
  const score = Math.round((technical + clarity + example + confidence) / 4);
  const dimensions = { technical, clarity, example, confidence };
  const weakest = Object.entries(dimensions).sort((a, b) => a[1] - b[1])[0][0];
  session.scores.push({ score, technical, clarity, example, confidence, type, star, topic: question.topic || question.roundLabel || "General Interview Skills", roundKey: question.roundKey, roundLabel: question.roundLabel });
  session.adaptiveFocus = weakest;
  if (session.adaptive && session.index + 1 < session.questions.length && weakest === "example") {
    const behavioralIndex = session.questions.findIndex((item, index) => index > session.index && item.type === "behavioral" && item.roundKey === question.roundKey);
    if (behavioralIndex > session.index + 1) [session.questions[session.index + 1], session.questions[behavioralIndex]] = [session.questions[behavioralIndex], session.questions[session.index + 1]];
  }
  renderFeedback({ score, technical, clarity, example, confidence, matched, words, model, type, star, weakest, matchedConcepts, missingConcepts, structureChecks });
}

function renderFeedback(result) {
  showState("feedbackState");
  const band = scoreBand(result.score);
  el("scoreRing").textContent = `${result.score}%`;
  el("scoreRing").className = `score-ring ${band}`;
  el("feedbackTitle").textContent = result.score >= 80 ? "Strong interview answer" : result.score >= 60 ? "Good foundation, improve the detail" : "Needs more interview practice";
  el("feedbackSummary").textContent = `Your answer used ${result.words} words and covered ${result.matched} of the core ideas expected by this interviewer.`;
  el("feedbackState").querySelector(".feedback-heading").className = `feedback-heading ${band}`;
  el("scoreGrid").innerHTML = [["Technical", result.technical], ["Clarity", result.clarity], ["Example", result.example], ["Confidence", result.confidence]].map(([label, score]) => `<div class="${scoreBand(score)}"><strong>${score}%</strong><span>${label}</span></div>`).join("");
  const strengths = [result.technical >= 70 ? "Covered important technical concepts." : "Attempted the core concept.", result.clarity >= 70 ? "Answer had useful detail and structure." : "Kept the answer focused.", result.example >= 70 ? "Included a practical scenario or example." : "Stayed relevant to the question."];
  const improvements = [result.technical < 80 ? "Add more Salesforce-specific terminology and reasoning." : "Explain the tradeoffs behind your technical choice.", result.clarity < 80 ? "Use a clear structure: meaning, reason, example, result." : "Make the opening sentence more direct.", result.example < 80 ? "Include one real project or workplace example." : "Quantify the result or business impact."];
  el("strengthList").innerHTML = strengths.map((item) => `<li>${item}</li>`).join("");
  el("improvementList").innerHTML = improvements.map((item) => `<li>${item}</li>`).join("");
  el("modelAnswer").textContent = result.model;
  const conceptTotal = result.matchedConcepts.length + result.missingConcepts.length;
  const conceptCoverage = conceptTotal ? Math.round((result.matchedConcepts.length / conceptTotal) * 100) : 0;
  el("conceptCoverageScore").textContent = `${conceptCoverage}% concept coverage`;
  el("matchedConcepts").innerHTML = result.matchedConcepts.length ? result.matchedConcepts.map((concept) => `<span>${escapeInterviewHtml(concept)}</span>`).join("") : "<em>No expected concepts were explicitly detected yet.</em>";
  el("missingConcepts").innerHTML = result.missingConcepts.length ? result.missingConcepts.map((concept) => `<span>${escapeInterviewHtml(concept)}</span>`).join("") : "<em>All expected concepts were explicitly covered.</em>";
  el("answerStructureChecks").innerHTML = result.structureChecks.map(([label, covered]) => `<li class="${covered ? "covered" : "missing"}">${covered ? "Covered" : "Add"}: ${escapeInterviewHtml(label)}</li>`).join("");
  el("improvedAnswerFramework").innerHTML = improvedAnswerSteps(result.type, result.missingConcepts).map((step) => `<li>${escapeInterviewHtml(step)}</li>`).join("");
  el("starCoach").classList.toggle("hidden", result.type !== "behavioral");
  if (result.type === "behavioral") el("starScoreGrid").innerHTML = Object.entries(result.star).map(([label, score]) => `<div><strong>${score}%</strong><span>${label}</span></div>`).join("");
  const prompts = { technical: "Explain one more Salesforce-specific concept or tradeoff.", clarity: "Use a direct opening, three supporting points, and a short conclusion.", example: "Use a specific STAR story or project example and quantify the result.", confidence: "State what you personally decided and why, using clear ownership language." };
  el("followUpPrompt").textContent = session.adaptive ? prompts[result.weakest] : "Adaptive follow-ups are off. Continue with the planned interview sequence.";
  const nextQuestion = session.questions[session.index + 1];
  el("nextQuestionBtn").textContent = session.index === session.questions.length - 1
    ? "Complete interview"
    : nextQuestion?.roundKey !== session.questions[session.index].roundKey
      ? `Start ${nextQuestion.roundLabel}`
      : "Next question";
  lastFeedbackSpeech = `Your answer scored ${result.score} percent. ${el("feedbackTitle").textContent}. ${el("feedbackSummary").textContent}. ${el("followUpPrompt").textContent}`;
  if (session.voiceMode) speak(lastFeedbackSpeech);
}

function nextQuestion() {
  session.index += 1;
  if (session.index < session.questions.length) renderQuestion(); else completeInterview();
}

function completeInterview() {
  const average = Math.round(session.scores.reduce((sum, item) => sum + item.score, 0) / session.scores.length);
  const dimensions = ["technical", "clarity", "example", "confidence"].map((key) => [key, Math.round(session.scores.reduce((sum, item) => sum + item[key], 0) / session.scores.length)]);
  showState("resultState");
  el("finalScoreRing").textContent = `${average}%`;
  el("finalScoreRing").className = `score-ring large ${scoreBand(average)}`;
  el("resultTitle").textContent = average >= 80 ? "Interview-ready performance" : average >= 60 ? "Good progress, keep practicing" : "Build confidence with another session";
  const roundScores = session.rounds.map((roundKey) => {
    const scores = session.scores.filter((item) => item.roundKey === roundKey);
    return {
      label: scores[0]?.roundLabel || "Focused Practice",
      questions: scores.length,
      score: Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length)
    };
  });
  const topicGroups = session.scores.reduce((groups, item) => {
    groups[item.topic] ||= [];
    groups[item.topic].push(item.score);
    return groups;
  }, {});
  const topicScores = Object.fromEntries(Object.entries(topicGroups).map(([topic, scores]) => [topic, averageValues(scores)]));
  const dimensionScores = Object.fromEntries(dimensions);
  el("resultSummary").textContent = `You completed ${roundScores.length} ${roundScores.length === 1 ? "round" : "rounds"} for the ${session.role} role with ${session.questions.length} questions.`;
  el("resultBreakdown").innerHTML = dimensions.map(([key, score]) => `<span>${key}: ${score}%</span>`).join("");
  el("roundReadinessReport").innerHTML = roundScores.map((round) => `<div class="round-report-card ${scoreBand(round.score)}"><strong>${round.label}</strong><span>${round.questions} questions completed</span><b>${round.score}% ${round.score >= 75 ? "Ready" : round.score >= 50 ? "Developing" : "Needs practice"}</b></div>`).join("");
  saveHistory({ role: session.role, difficulty: session.difficulty, format: session.round === "full" ? "full interview process" : roundScores[0].label, questions: session.questions.length, score: average, dimensions: dimensionScores, topicScores, rounds: roundScores, source: session.source, date: new Date().toLocaleDateString() });
  window.TomCodexLearning?.record("interview", Math.max(3, Math.round(average / 10)), `${session.role} interview: ${average}%`);
}

el("startInterviewBtn").addEventListener("click", startInterview);
el("submitAnswerBtn").addEventListener("click", evaluateAnswer);
el("nextQuestionBtn").addEventListener("click", nextQuestion);
el("practiceAgainBtn").addEventListener("click", startInterview);
el("answerInput").addEventListener("input", updateWordCount);
el("replayQuestionBtn").addEventListener("click", () => session && speak(session.questions[session.index].question));
el("replayFeedbackBtn").addEventListener("click", () => speak(lastFeedbackSpeech));
setupVoiceInput();
renderHistory();

function renderAdminInterviewSetup() {
  const isAdminRole = el("roleSelect").value === "Salesforce Administrator";
  const isDeveloperRole = el("roleSelect").value === "Salesforce Developer";
  el("adminTopicField").classList.toggle("hidden", !isAdminRole);
  el("adminQuestionLibrary").classList.toggle("hidden", !isAdminRole);
  el("developerQuestionLibrary").classList.toggle("hidden", !isDeveloperRole);
  el("developerCodingWorkspace").classList.toggle("hidden", !isDeveloperRole);
}

const studyFilters = {
  admin: { search: "", topic: "all", source: "all", type: "all", reviewOnly: false },
  developer: { search: "", topic: "all", source: "all", type: "all", reviewOnly: false }
};
const reviewQuestionRegistry = new Map();

function loadInterviewReview() {
  try { return JSON.parse(localStorage.getItem(INTERVIEW_REVIEW_KEY)) || {}; } catch { return {}; }
}

function saveInterviewReview(records) {
  localStorage.setItem(INTERVIEW_REVIEW_KEY, JSON.stringify(records));
}
let interviewReviewRecords = loadInterviewReview();

function reviewQuestionKey(role, item) {
  return `${role}:${canonicalQuestionKey(item.question)}`;
}

function isReviewDue(record) {
  return record && new Date(record.dueAt || 0).getTime() <= Date.now();
}

function reviewStatus(record) {
  if (!record) return "Not saved for review";
  if (isReviewDue(record)) return `${record.confidence || "learning"} - due now`;
  return `${record.confidence || "learning"} - next ${new Date(record.dueAt).toLocaleDateString()}`;
}

function updateReviewRecord(key, role, item, rating) {
  const records = interviewReviewRecords;
  const current = records[key] || { reviews: 0, intervalDays: 0 };
  if (rating === "remove") {
    delete records[key];
  } else {
    const intervals = {
      save: 0,
      hard: 1,
      good: Math.max(3, current.intervalDays * 2),
      easy: Math.max(7, current.intervalDays * 3)
    };
    const intervalDays = intervals[rating];
    records[key] = {
      ...current,
      role,
      topic: item.topic,
      question: item.question,
      confidence: rating === "save" ? (current.confidence || "learning") : rating,
      intervalDays,
      reviews: rating === "save" ? current.reviews : current.reviews + 1,
      lastReviewed: rating === "save" ? current.lastReviewed : new Date().toISOString(),
      dueAt: new Date(Date.now() + intervalDays * 86400000).toISOString()
    };
  }
  saveInterviewReview(records);
  window.TomCodexLearning?.record("interview-review", rating === "easy" ? 3 : rating === "good" ? 2 : 1, `${role} review: ${item.topic}`);
}

function renderReviewStats(role) {
  const prefix = role === "admin" ? "admin" : "developer";
  const records = Object.values(interviewReviewRecords).filter((record) => record.role === role);
  el(`${prefix}ReviewDue`).textContent = records.filter(isReviewDue).length;
  el(`${prefix}ReviewSaved`).textContent = records.length;
  el(`${prefix}ReviewMastered`).textContent = records.filter((record) => record.confidence === "easy").length;
  const toggle = el(`${prefix}ReviewToggle`);
  toggle.classList.toggle("active", studyFilters[role].reviewOnly);
  toggle.textContent = studyFilters[role].reviewOnly ? "Showing due questions" : "Study due questions";
  const topicProgress = Object.entries(records.reduce((topics, record) => {
    topics[record.topic] ||= { saved: 0, mastered: 0 };
    topics[record.topic].saved += 1;
    if (record.confidence === "easy") topics[record.topic].mastered += 1;
    return topics;
  }, {})).sort((a, b) => b[1].saved - a[1].saved).slice(0, 3);
  el(`${prefix}ReviewTopicProgress`).textContent = topicProgress.length
    ? `Topic mastery: ${topicProgress.map(([topic, progress]) => `${topic} ${progress.mastered}/${progress.saved}`).join(" | ")}`
    : "Rate questions to begin topic mastery tracking.";
}

function questionSourceType(item) {
  if (item.verified) return "verified";
  return item.provenance === "community" ? "community" : "generated";
}

function sourceQuality(item) {
  const source = item.source || sourceForTopic(item.topic);
  const hasSource = Boolean(source?.url);
  const isOfficial = /salesforce\.com|trailhead\.com|architect\.salesforce\.com/i.test(source?.url || "");
  if (item.verified) return { score: isOfficial ? 95 : 90, level: "strong", freshness: "Source-checked answer; verify behavior against the current Salesforce release." };
  if (item.provenance === "community") return { score: hasSource ? 85 : 70, level: hasSource ? "strong" : "medium", freshness: "Community-linked answer; confirm current behavior with official Salesforce guidance." };
  return { score: isOfficial ? 65 : 50, level: "low", freshness: "Generated practice framework; requires source verification before interview use." };
}

function matchesStudyFilter(item, filter, topicId, questionType, role) {
  const searchable = [item.question, item.guide, item.coaching, item.topic].join(" ").toLowerCase();
  const reviewRecord = interviewReviewRecords[reviewQuestionKey(role, item)];
  return (!filter.search || searchable.includes(filter.search))
    && (filter.topic === "all" || filter.topic === topicId)
    && (filter.source === "all" || filter.source === questionSourceType(item) || (filter.source === "high-confidence" && sourceQuality(item).score >= 85))
    && (filter.type === "all" || filter.type === questionType)
    && (!filter.reviewOnly || isReviewDue(reviewRecord));
}

function renderSourceQualitySummary(role, items) {
  const prefix = role === "admin" ? "admin" : "developer";
  const quality = items.map(sourceQuality);
  const average = quality.length ? Math.round(quality.reduce((sum, item) => sum + item.score, 0) / quality.length) : 0;
  const highConfidence = quality.filter((item) => item.score >= 85).length;
  const needsVerification = quality.filter((item) => item.score < 85).length;
  el(`${prefix}SourceQualitySummary`).innerHTML = `<span class="${average >= 85 ? "quality-strong" : "quality-review"}">Visible source score: ${average}/100</span><span>${highConfidence} high confidence</span><span>${needsVerification} need verification</span><span>Freshness: verify against current Salesforce releases</span><span>Rubric: verified 90-95 | linked community 85 | generated 50-65</span>`;
}

function renderQuestionGroup(title, className, items, label, role) {
  if (!items.length) return "";
  return `<h3 class="admin-bank-title ${className}">${items.length} ${title}</h3>${items.map((item, index) => renderLibraryQuestion(item, `${label} ${index + 1}`, role)).join("")}`;
}

function renderPracticeGroup(title, items, label, role) {
  if (!items.length) return "";
  return `<details class="practice-drill-group"><summary>${items.length} ${title}</summary><div class="practice-drill-list">${items.map((item, index) => renderLibraryQuestion(item, `${label} ${index + 1}`, role)).join("")}</div></details>`;
}

function renderAdminLibrary() {
  el("adminTopicSelect").innerHTML = `<option value="all">All Admin topics (${adminTopicBank.length} modules)</option>${adminTopicBank.map((topic) => `<option value="${topic.id}">${topic.title}</option>`).join("")}`;
  const filter = studyFilters.admin;
  let visibleCount = 0;
  const visibleQuestions = [];
  const renderedTopics = adminTopicBank.map((topic) => {
    const interview = topic.interviewQuestions.filter((item) => matchesStudyFilter(item, filter, topic.id, "interview", "admin"));
    const scenario = topic.scenarioQuestions.filter((item) => matchesStudyFilter(item, filter, topic.id, "scenario", "admin"));
    const all = [...interview, ...scenario];
    if (!all.length) return "";
    visibleCount += all.length;
    visibleQuestions.push(...all);
    const verifiedInterview = interview.filter((item) => item.verified);
    const verifiedScenario = scenario.filter((item) => item.verified);
    const community = all.filter((item) => item.provenance === "community");
    const generated = all.filter((item) => item.provenance === "generated");
    return `<details class="admin-topic-group" ${visibleCount === all.length ? "open" : ""}>
      <summary><span><strong>${topic.title}</strong><span>${topic.description}</span></span><b>${all.length} shown</b></summary>
      <div class="admin-topic-questions">
        ${renderQuestionGroup("Verified Real-World Interview Questions", "", verifiedInterview, "Verified Q", "admin")}
        ${renderQuestionGroup("Verified Scenario Questions", "scenario", verifiedScenario, "Verified Scenario", "admin")}
        ${renderQuestionGroup("Community-Sourced Interview Questions", "community", community, "Community Q", "admin")}
        ${renderPracticeGroup("Additional generated practice drills", generated, "Practice Drill", "admin")}
      </div>
    </details>`;
  }).filter(Boolean);
  const questionCount = adminTopicBank.reduce((sum, topic) => sum + topic.interviewQuestions.length + topic.scenarioQuestions.length, 0);
  const verifiedCount = adminTopicBank.reduce((sum, topic) => sum + [...topic.interviewQuestions, ...topic.scenarioQuestions].filter((item) => item.verified).length, 0);
  const communityCount = adminTopicBank.reduce((sum, topic) => sum + [...topic.interviewQuestions, ...topic.scenarioQuestions].filter((item) => item.provenance === "community").length, 0);
  el("adminLibraryQuestionCount").textContent = questionCount;
  el("adminStudyResultCount").textContent = `${visibleCount} of ${questionCount} results`;
  el("adminQuestionTopics").innerHTML = renderedTopics.join("") || '<div class="study-empty-state">No Admin questions match these filters. Clear filters or try a broader search.</div>';
  renderReviewStats("admin");
  renderSourceQualitySummary("admin", visibleQuestions);
  document.querySelector(".library-heading p").textContent = `${verifiedCount} answers are curated from the provided real-world interview sheet, and ${communityCount} are paraphrased from reputable community interview resources with direct source links. Generated drills remain separated for practice.`;
}

function renderLibraryQuestion(item, label, role) {
  const source = item.source || sourceForTopic(item.topic);
  const isCommunity = item.provenance === "community";
  const reviewKey = reviewQuestionKey(role, item);
  const reviewRecord = interviewReviewRecords[reviewKey];
  const quality = sourceQuality(item);
  reviewQuestionRegistry.set(reviewKey, { role, item });
  const answerLabel = item.verified ? "Source-checked candidate answer:" : isCommunity ? "Community-informed candidate answer:" : "Generated answer framework:";
  const badge = item.verified ? '<span class="answer-provenance verified">Verified real-world</span>' : isCommunity ? '<span class="answer-provenance community">Community sourced</span>' : '<span class="answer-provenance practice">Generated practice</span>';
  const sourceType = isCommunity ? "Community source" : "Official guidance";
  return `<details><summary>${label}. ${item.question}</summary><div class="admin-topic-answer">${badge}<span class="source-quality-badge quality-${quality.level}">Source quality ${quality.score}/100</span><strong>${answerLabel}</strong><p>${item.guide}</p><aside><b>Salesforce coaching note:</b> ${item.coaching || "Explain the reasoning, tradeoffs, and verification steps."}</aside><a class="official-source-link" href="${source.url}" target="_blank" rel="noopener noreferrer">${sourceType}: ${source.label}</a><span class="source-freshness">${quality.freshness}</span><div class="review-controls"><span>${reviewStatus(reviewRecord)}</span><button class="${reviewRecord ? "saved" : ""}" data-review-action="${reviewRecord ? "remove" : "save"}" data-review-key="${encodeURIComponent(reviewKey)}" type="button">${reviewRecord ? "Remove" : "Save for review"}</button><button class="rate-hard" data-review-action="hard" data-review-key="${encodeURIComponent(reviewKey)}" type="button">Hard</button><button class="rate-good" data-review-action="good" data-review-key="${encodeURIComponent(reviewKey)}" type="button">Good</button><button class="rate-easy" data-review-action="easy" data-review-key="${encodeURIComponent(reviewKey)}" type="button">Easy</button></div></div></details>`;
}

function renderDeveloperLibrary() {
  const filter = studyFilters.developer;
  let visibleCount = 0;
  const visibleQuestions = [];
  const renderedTopics = developerInterviewTopics.map((topic) => {
    const questions = topic.questions.filter((item) => matchesStudyFilter(item, filter, topic.id, "interview", "developer"));
    const practice = topic.practiceQuestions.filter((item) => matchesStudyFilter(item, filter, topic.id, "practice", "developer"));
    const topicCount = questions.length + practice.length;
    if (!topicCount) return "";
    visibleCount += topicCount;
    visibleQuestions.push(...questions, ...practice);
    return `<details class="admin-topic-group" ${visibleCount === topicCount ? "open" : ""}>
      <summary><span><strong>${topic.title}</strong><span>${topic.description}</span></span><b>${topicCount} shown</b></summary>
      <div class="admin-topic-questions">
        ${renderQuestionGroup("Community-Sourced Developer Questions", "community", questions, "Developer Q", "developer")}
        ${renderPracticeGroup("Additional generated Developer practice Q&A", practice, "Developer Practice", "developer")}
      </div>
    </details>`;
  }).filter(Boolean);
  const questionCount = developerInterviewTopics.reduce((sum, topic) => sum + topic.questions.length + topic.practiceQuestions.length, 0);
  el("developerLibraryQuestionCount").textContent = questionCount;
  el("developerStudyResultCount").textContent = `${visibleCount} of ${questionCount} results`;
  el("developerQuestionTopics").innerHTML = renderedTopics.join("") || '<div class="study-empty-state">No Developer questions match these filters. Clear filters or try a broader search.</div>';
  renderReviewStats("developer");
  renderSourceQualitySummary("developer", visibleQuestions);
}

function setupStudyFilters(role, topics, render) {
  const prefix = role === "admin" ? "admin" : "developer";
  const topicSelect = el(`${prefix}StudyTopic`);
  topicSelect.innerHTML = `<option value="all">All topics</option>${topics.map((topic) => `<option value="${topic.id}">${topic.title}</option>`).join("")}`;
  ["Search", "Topic", "Source", "Type"].forEach((field) => {
    el(`${prefix}Study${field}`).addEventListener(field === "Search" ? "input" : "change", (event) => {
      studyFilters[role][field.toLowerCase()] = field === "Search" ? event.target.value.trim().toLowerCase() : event.target.value;
      render();
    });
  });
  el(`${prefix}StudyClear`).addEventListener("click", () => {
    studyFilters[role] = { search: "", topic: "all", source: "all", type: "all", reviewOnly: false };
    ["Search", "Topic", "Source", "Type"].forEach((field) => { el(`${prefix}Study${field}`).value = field === "Search" ? "" : "all"; });
    render();
  });
  el(`${prefix}ReviewToggle`).addEventListener("click", () => {
    studyFilters[role].reviewOnly = !studyFilters[role].reviewOnly;
    render();
  });
}

function handleReviewAction(event) {
  const button = event.target.closest("[data-review-action]");
  if (!button) return;
  const key = decodeURIComponent(button.dataset.reviewKey);
  const question = reviewQuestionRegistry.get(key);
  if (!question) return;
  updateReviewRecord(key, question.role, question.item, button.dataset.reviewAction);
  question.role === "admin" ? renderAdminLibrary() : renderDeveloperLibrary();
  renderWeaknessDashboard();
}

function applyRecommendedSession() {
  el("roleSelect").value = el("applyNextSessionBtn").dataset.role || "Salesforce Administrator";
  el("interviewRoundSelect").value = el("applyNextSessionBtn").dataset.round || "focused";
  el("roundDifficultySelect").value = "realistic";
  renderAdminInterviewSetup();
  document.querySelector(".interview-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

el("roleSelect").addEventListener("change", renderAdminInterviewSetup);
el("applyNextSessionBtn").addEventListener("click", applyRecommendedSession);
window.addEventListener("tomcodex:coding-progress", renderWeaknessDashboard);
el("adminQuestionTopics").addEventListener("click", handleReviewAction);
el("developerQuestionTopics").addEventListener("click", handleReviewAction);
setupStudyFilters("admin", adminTopicBank, renderAdminLibrary);
setupStudyFilters("developer", developerInterviewTopics, renderDeveloperLibrary);
renderAdminLibrary();
renderDeveloperLibrary();
renderAdminInterviewSetup();
renderWeaknessDashboard();
