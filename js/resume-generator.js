/**
 * Resume Project Generator Client Logic
 */
(function () {
  const ENDPOINT = "/api/ai/resume";
  const HISTORY_KEY = "tomcodex.resumeGenerations.v1";

  const el = (id) => document.getElementById(id);

  // Pre-populated achievements data
  const PROJECT_ACHIEVEMENTS = {
    capstone: [
      "Designed custom relational schema with Student, Application, Financial, and Cohort custom objects.",
      "Configured Master-Detail relationships to enforce data integrity and cascade deletions across cohort records.",
      "Created record-triggered Flows to automate admissions notification routing and automated email alerts.",
      "Implemented Apex triggers with trigger handler pattern for custom student validation rules.",
      "Enforced security access controls using Profiles, Permission Sets, and custom Role Hierarchy policies.",
      "Loaded legacy database files (1,000+ rows) using Salesforce Data Loader, implementing Duplication Rules.",
      "Constructed REST integration interfaces using Named Credentials and JSON deserialization to sync payment data."
    ],
    apex: [
      "Created outbound REST Callout helper services using Named Credentials to secure legacy api tokens.",
      "Configured Salesforce Named Credentials to separate credentials and secrets from codebase configs.",
      "Built asynchronous Batchable Apex class executing nightly to synchronize external student payments.",
      "Implemented a centralized exception logging framework in Apex to capture integration stack traces.",
      "Wrote unit tests achieving 85%+ coverage covering success, network failure, and callout mock states."
    ],
    lwc: [
      "Designed responsive UI component views inside Salesforce utilizing Lightning Design System (SLDS).",
      "Utilized Salesforce wire service and cacheable Apex adapters to display real-time student collections.",
      "Implemented event propagation and custom bubbles dispatch listeners to coordinate sibling components.",
      "Built interactive search datatables supporting client-side filtering, sorting, and inline edits.",
      "Optimized rendering lifecycle to prevent UI lag by lazy loading complex component child containers."
    ],
    agentforce: [
      "Configured autonomous Agentforce agents with topic classifiers, instructions, and prompt safety classifications.",
      "Exposed record-triggered Flows as Agent actions to fetch and edit CRM record values on user request.",
      "Designed dynamic Prompt Templates merging record attributes with system context instructions.",
      "Conducted extensive agent sandbox testing and instruction tuning to establish reliable safety guardrails."
    ]
  };

  // Local Offline Fallback Templates
  const TEMPLATE_OUTLINE = {
    capstone: {
      developer: {
        summary: "Developed a comprehensive Student Success CRM on the Salesforce platform to manage cohort assignments, application pipelines, and financial records.",
        bulletPoints: [
          "Designed and implemented a custom relational data model utilizing Custom Objects, Master-Detail relationships, and Page Layouts to track students, cohorts, and applications.",
          "Built record-triggered Salesforce Flows to automate Lead assignment and student notification routing, increasing admissions operational efficiency.",
          "Implemented Apex Triggers and Helper classes with trigger-handler patterns for bulkified record processing, maintaining governor-limit safety.",
          "Developed external REST API integrations using Named Credentials and JSON parsers to synchronize student payment records with mock endpoints."
        ],
        skills: ["Data Modeling", "Salesforce Flows", "Apex Development", "REST Integrations", "Security Sharing Rules", "Data Loaders"]
      },
      admin: {
        summary: "Configured and administered the Student Success CRM system to optimize student lifecycle management and admissions operations.",
        bulletPoints: [
          "Administered custom objects, page layouts, and search configurations to support dynamic tracking of 5,000+ student applications.",
          "Configured Lead and Case assignment rules along with complex validation rules to ensure data cleanliness and automated routing.",
          "Established organizational security protocols, implementing custom Profiles, Permission Sets, and Role Hierarchy structures.",
          "Designed custom Analytics Dashboards and Salesforce Reports to track cohort enrollment velocity and financial progress indicators."
        ],
        skills: ["User Administration", "Security Sharing Model", "Reports & Dashboards", "Validation Rules", "Data Loaders", "Flow Automation"]
      },
      consultant: {
        summary: "Conducted business analysis and designed process improvements for the Student Success CRM admissions workflow.",
        bulletPoints: [
          "Gathered requirements from admissions stakeholders to map out Student Application business processes and translate them into technical specs.",
          "Designed functional flowcharts and led validation sessions to establish the target automation architecture.",
          "Formulated user acceptance criteria (UAT) and created training materials to ensure seamless rollout to admissions staff."
        ],
        skills: ["Business Analysis", "Requirements Gathering", "UAT Testing", "Flow Diagramming", "Salesforce CRM", "Process Automation"]
      },
      agentforce: {
        summary: "Integrated autonomous AI capabilities into the Student Success CRM to assist admissions coordinators and students.",
        bulletPoints: [
          "Coordinated with development teams to identify CRM actions suitable for automation via autonomous AI agents.",
          "Configured security profiles and least-privilege permission models to govern AI agent access boundaries within the CRM.",
          "Monitored pilot user testing metrics and compiled recommendations to optimize agent actions and reduce human intervention rate."
        ],
        skills: ["Agentforce Integration", "Admissions CRM", "Security Boundaries", "AI Governance", "UAT Pilot Feedback"]
      }
    },
    apex: {
      developer: {
        summary: "Engineered high-performance backend Apex services and outbound REST API integrations on the Salesforce platform.",
        bulletPoints: [
          "Developed robust outbound REST integration services utilizing Salesforce Named Credentials and OAuth 2.0 to secure external api access.",
          "Parsed complex nested JSON payment data payloads asynchronously using Batchable Apex classes to update CRM data nightly.",
          "Created generic error handling utilities and custom debug loggers in Apex to track integration failures and reduce debug cycle time.",
          "Authored comprehensive Apex unit tests with callout mocks to achieve 85%+ coverage across bulk record testing scenarios."
        ],
        skills: ["Outbound REST APIs", "Named Credentials", "Asynchronous Apex", "Apex Triggers", "JSON Deserialization", "Exception Handling"]
      },
      admin: {
        summary: "Administered integration credentials, endpoints, and asynchronous scheduled jobs for payment synchronization.",
        bulletPoints: [
          "Configured Named Credentials and External Credentials to store callout keys securely without developer code updates.",
          "Monitored system integration logs, Scheduled Jobs, and Apex Apex Flex queues to identify and resolve synchronization delays.",
          "Maintained org boundaries by configuring remote site settings and checking system governance limit metrics."
        ],
        skills: ["Named Credentials", "Scheduled Jobs", "System Log Auditing", "Remote Site Settings", "Governor Limits Monitoring"]
      },
      consultant: {
        summary: "Designed payment system synchronization workflows and credential access policies for external API connections.",
        bulletPoints: [
          "Analyzed third-party payment gateway documentation to align data payloads with Salesforce CRM field architectures.",
          "Drafted data-mapping documents and error handling escalation matrices to safeguard payment synchronization workflows.",
          "Recommended Named Credentials security architectures to clients to satisfy compliance audits."
        ],
        skills: ["API Data Mapping", "System Architecture", "Security Compliance", "Payment Gateway Sync", "Functional Specs"]
      },
      agentforce: {
        summary: "Configured Apex integration methods to serve as actionable tools for AI agents.",
        bulletPoints: [
          "Refactored programmatic Apex classes with Invocable Method annotations, making them accessible to autonomous agent planners.",
          "Designed payload parameters in Apex to allow agents to dynamically trigger payments queries and record updates.",
          "Optimized Apex callout performance boundaries to ensure agent tool executions completed within conversational latency parameters."
        ],
        skills: ["Invocable Apex", "Agent Tools", "API Optimization", "Conversational AI", "JSON Parameters"]
      }
    },
    lwc: {
      developer: {
        summary: "Constructed dynamic, responsive user experiences using Lightning Web Components (LWC) to enhance internal operations.",
        bulletPoints: [
          "Developed responsive user interface layouts with LWC, utilizing Lightning Design System (SLDS) styling to align with Salesforce branding guidelines.",
          "Implemented Salesforce wire service and dynamic Apex controller adapters to query and display filterable record datatables.",
          "Optimized front-end components using custom events and DOM parent-child communications, improving page load performance.",
          "Configured custom Lightning Record Pages with component filters to render modular LWC blocks based on record status attributes."
        ],
        skills: ["Lightning Web Components", "Salesforce Lightning Design System", "Wire Service", "Apex Adapters", "Event Propagation", "JavaScript ES6+"]
      },
      admin: {
        summary: "Deployed, configured, and localized custom Lightning Web Components across Lightning App Pages.",
        bulletPoints: [
          "Configured LWC component targets inside Lightning App Builder, adjusting layouts, permissions, and responsive form factors.",
          "Set up Component Visibility criteria using record fields to display advanced LWC panels only to authorized user profiles.",
          "Maintained Custom Labels and translations to support localization configurations across custom component user fields."
        ],
        skills: ["Lightning App Builder", "Component Visibility", "Custom Labels", "User Experience Settings", "Profile Access"]
      },
      consultant: {
        summary: "Analyzed user experience requirements and designed custom page layouts for sales and operations workflows.",
        bulletPoints: [
          "Facilitated usability workshops to capture operations staff pain points and designed mockups for Lightning Page layouts.",
          "Prepared functional specs for front-end LWC engineers, detailing sorting criteria, search filter logic, and inline edits behaviors.",
          "Validated front-end builds against user stories to verify layout speed and accessibility goals."
        ],
        skills: ["UX Mockups", "Lightning Layouts Design", "Functional Requirements", "UAT Testing", "Agile User Stories"]
      },
      agentforce: {
        summary: "Exposed and styled custom LWC panels to display active AI agent statuses and recommendation flows.",
        bulletPoints: [
          "Configured agent status dashboard widgets in Lightning Experience, linking custom LWC components to track agent interaction analytics.",
          "Embedded LWC cards inside utility bars to allow users to trigger conversational agent help sidebars in context.",
          "Designed dynamic buttons inside components triggering CRM record processes that synchronize immediately with agent memory maps."
        ],
        skills: ["Utility Bar Config", "Dashboard Widgets", "Agent Context Sync", "Salesforce LWC", "Interactive Dashboards"]
      }
    },
    agentforce: {
      developer: {
        summary: "Programmed custom prompt extensions, flow actions, and autonomous routing classifications for conversational agents.",
        bulletPoints: [
          "Authored invocable Flow routing modules and Apex helper actions to allow agents to interact with third-party billing databases.",
          "Designed dynamic prompt configurations and system instructions, handling contextual variables and CRM merge fields.",
          "Engineered agent validation scripts to run automated test scripts comparing agent conversational responses with expected outputs."
        ],
        skills: ["Apex Invocable Actions", "Flow Planners", "Prompt Engineering", "Testing Sandbox", "Agent Validation", "Conversational Logic"]
      },
      admin: {
        summary: "Configured and monitored autonomous Agentforce support agents to handle user queries and record automations.",
        bulletPoints: [
          "Configured Agentforce agent parameters, setting up topic scopes, system prompts, and classification instructions.",
          "Mapped existing Salesforce Flows as agent actions, enabling automated record retrieval and email notifications.",
          "Monitored agent conversation transcripts and accuracy metrics in Agentforce console to tune and correct instructions.",
          "Set up secure agent user profiles and permissions to restrict agent record access to public CRM objects."
        ],
        skills: ["Agentforce Config", "Flow Tools Mapping", "Transcript Auditing", "AI Profiles & Permissions", "Classification Prompts"]
      },
      consultant: {
        summary: "Designed AI conversational roadmaps and agent classification rules to automate support service workflows.",
        bulletPoints: [
          "Analyzed support queue case types to identify cases suitable for routing to autonomous Agentforce agents.",
          "Drafted agent conversational guidelines and topic routing diagrams to model customer queries escalation paths.",
          "Assessed agent interaction metrics to compile ROI reports on automation accuracy and human staff time saved."
        ],
        skills: ["AI Roadmap Design", "Case Deflection Strategy", "Topic Routing Mapping", "Performance Analytics", "Stakeholder Alignment"]
      },
      agentforce: {
        summary: "Built and specialized autonomous Agentforce conversational agents to manage admissions query queues.",
        bulletPoints: [
          "Designed Agentforce Agent topics, configuring natural language prompts and instruction guidelines, reaching 90% accuracy.",
          "Linked Salesforce admissions Flows as agent actions, enabling AI agents to search cohorts and schedule interviews.",
          "Conducted testing runs and prompt tuning iterations to establish safety guardrails against prompt injection risks."
        ],
        skills: ["Agentforce Specialist", "Topic Classifiers", "Flow Actions Integration", "Prompt Engineering", "Conversational Safety"]
      }
    }
  };

  // Initialize
  function init() {
    setupProjectListener();
    renderAchievements();
    renderHistory();

    if (el("resumeForm")) el("resumeForm").addEventListener("submit", handleGenerate);
    if (el("clearHistoryBtn")) el("clearHistoryBtn").addEventListener("click", clearHistory);
    if (el("copyAllBtn")) el("copyAllBtn").addEventListener("click", copyAllOutput);
    if (el("copySummaryBtn")) el("copySummaryBtn").addEventListener("click", () => copyText(el("outputSummary").textContent, el("copySummaryBtn")));
  }

  // Update achievements checklist on project dropdown change
  function setupProjectListener() {
    const projectSelect = el("projectSelect");
    if (projectSelect) {
      projectSelect.addEventListener("change", renderAchievements);
    }
  }

  // Render checkboxes corresponding to the selected project
  function renderAchievements() {
    const projectSelect = el("projectSelect");
    const container = el("achievementsContainer");
    if (!projectSelect || !container) return;

    const projectVal = projectSelect.value;
    const achievements = PROJECT_ACHIEVEMENTS[projectVal] || [];

    container.innerHTML = achievements
      .map(
        (ach, idx) => `
        <label class="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
          <input type="checkbox" name="achievements" value="${ach}" class="custom-checkbox mt-0.5 shrink-0" ${idx < 3 ? "checked" : ""}>
          <span class="text-xs text-slate-700 font-medium leading-relaxed">${ach}</span>
        </label>
      `
      )
      .join("");
  }

  // Load History from LocalStorage
  function loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY));
      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }

  // Save item to history
  function saveHistoryItem(item) {
    const history = loadHistory();
    history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 9)));
  }

  // Render History List
  function renderHistory() {
    const list = el("historyList");
    if (!list) return;

    const history = loadHistory();
    if (history.length === 0) {
      list.innerHTML = `<p class="text-xs text-slate-400 text-center py-6 col-span-full">No previous generations saved. Create one above to get started.</p>`;
      return;
    }

    list.innerHTML = history
      .map(
        (item, idx) => {
          const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
          const roleClass = item.role.toLowerCase();
          return `
          <article class="history-card" data-idx="${idx}">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="tag-badge ${roleClass}">${item.role}</span>
              <span class="text-[10px] text-slate-400 font-bold">${dateStr}</span>
            </div>
            <strong class="block text-xs font-bold text-slate-800 line-clamp-1">${item.projectName}</strong>
            <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${item.summary}</p>
            <div class="mt-3 flex items-center justify-between text-[10px] font-extrabold text-brand-600">
              <span>Click to view details</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" class="shrink-0"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </article>
        `;
        }
      )
      .join("");

    // Attach click listeners to cards
    list.querySelectorAll(".history-card").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = card.dataset.idx;
        const item = history[idx];
        if (item) loadGenResult(item);
      });
    });
  }

  // Clear History
  function clearHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  }

  // Load generation result into view
  function loadGenResult(data) {
    el("outputEmptyState").classList.add("hidden");
    el("outputResultState").classList.remove("hidden");

    el("outputEngineLabel").textContent = data.source === "centralized-ai-engine" ? "Centralized AI generator" : "Local template generator";
    el("outputSummary").textContent = data.summary;

    const bulletList = el("outputBulletList");
    if (bulletList) {
      bulletList.innerHTML = data.bulletPoints
        .map(
          (bp) => `
          <div class="bullet-card group">
            <p class="text-xs text-slate-700 leading-relaxed pr-8 font-medium">${bp}</p>
            <button class="copy-btn absolute top-2 right-2 p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 shadow-sm border border-slate-100" data-copy-value="${bp.replace(/"/g, '&quot;')}">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        `
        )
        .join("");

      // Add click copy listeners to individual bullets
      bulletList.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const val = btn.dataset.copyValue;
          copyText(val, btn);
        });
      });
    }

    const skillsList = el("outputSkillsList");
    if (skillsList) {
      skillsList.innerHTML = data.skills
        .map((s) => `<span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200/50">${s}</span>`)
        .join("");
    }

    // Scroll output card into view on mobile
    el("outputResultState").scrollIntoView({ behavior: "smooth" });
  }

  // Copy helper
  function copyText(text, button) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      const originalHtml = button.innerHTML;
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" class="text-emerald-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;
      button.classList.add("bg-emerald-50", "border-emerald-200");
      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.classList.remove("bg-emerald-50", "border-emerald-200");
      }, 1500);
    });
  }

  // Copy All functionality
  function copyAllOutput() {
    const summary = el("outputSummary").textContent;
    const bullets = Array.from(el("outputBulletList").querySelectorAll("p")).map((p) => `- ${p.textContent}`).join("\n");
    const skills = Array.from(el("outputSkillsList").querySelectorAll("span")).map((s) => s.textContent).join(", ");

    const fullText = `Project Description:\n${summary}\n\nKey Achievements:\n${bullets}\n\nCore Technologies:\n${skills}`;
    const btn = el("copyAllBtn");

    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(fullText).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" class="text-emerald-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span class="text-emerald-600 font-extrabold">Copied!</span>
      `;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 1500);
    });
  }

  // Local Offline Generator Fallback
  function localResume({ project, role, achievements }) {
    const group = TEMPLATE_OUTLINE[project] || TEMPLATE_OUTLINE.capstone;
    const template = group[role] || group.developer;

    // Filter template bullets to prioritize selected checklist points (matching keywords)
    let selectedBullets = [];
    if (achievements.length > 0) {
      // Find template bullets matching keywords from achievements
      selectedBullets = template.bulletPoints.filter((bp) => {
        return achievements.some((ach) => {
          const words = ach.toLowerCase().split(/\W+/).filter(w => w.length > 4);
          return words.some(w => bp.toLowerCase().includes(w));
        });
      });
    }

    // Fallback if no matching bullets or too few
    if (selectedBullets.length < 3) {
      selectedBullets = [...template.bulletPoints];
    }

    return {
      summary: template.summary,
      bulletPoints: selectedBullets.slice(0, 5),
      skills: template.skills,
      source: "local-rules"
    };
  }

  // Handle Form Submit and call backend endpoint
  async function handleGenerate(e) {
    e.preventDefault();

    const projectSelect = el("projectSelect");
    const roleSelect = el("roleSelect");
    const toneSelect = el("toneSelect");
    const customNotes = el("customNotes");

    const projectVal = projectSelect.value;
    const roleVal = roleSelect.value;
    const toneVal = toneSelect.value;
    const notesVal = customNotes.value.trim();

    const checkedBoxes = document.querySelectorAll('input[name="achievements"]:checked');
    const achievements = Array.from(checkedBoxes).map((cb) => cb.value);

    const projectName = projectSelect.options[projectSelect.selectedIndex].text.split(" (")[0];
    const roleName = roleSelect.options[roleSelect.selectedIndex].text;

    const btn = el("generateBtn");
    btn.disabled = true;
    btn.textContent = "Generating...";

    const payload = {
      project: projectName,
      role: roleName,
      achievements,
      tone: toneVal,
      customNotes: notesVal
    };

    let result = null;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.bulletPoints) throw new Error(data.error || "AI Generation failed");
      result = data;
    } catch {
      // Fallback offline template generator
      result = localResume({ project: projectVal, role: roleVal, achievements });
    }

    btn.disabled = false;
    btn.textContent = "Generate Resume Points";

    const savedItem = {
      projectName,
      role: roleName,
      summary: result.summary,
      bulletPoints: result.bulletPoints,
      skills: result.skills,
      source: result.source,
      createdAt: new Date().toISOString()
    };

    saveHistoryItem(savedItem);
    loadGenResult(savedItem);
    renderHistory();

    // Record learning activity
    window.TomCodexLearning?.record("task", 10, `Generated Salesforce ${roleName} resume points for ${projectName}`);
  }

  // On DOM Load
  document.addEventListener("DOMContentLoaded", init);
})();
