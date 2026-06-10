const ADMIN_PROGRESS_KEY = "tomcodex.adminCourseProgress.v1";
const modules = [
  {
    title: "Salesforce Platform Foundations",
    description: "Understand CRM, Salesforce multi-tenant architecture, Setup menus, App Launcher, standard vs custom objects, and the administrator role.",
    points: [
      "Explain CRM and how Salesforce supports business teams.",
      "Navigate Setup, App Launcher, Object Manager, and list views.",
      "Understand standard objects, custom objects, fields, and records."
    ],
    resources: [
      ["Salesforce CRM Trailhead", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_basics"],
      ["Salesforce Help Docs", "https://help.salesforce.com/"],
      ["What Is Salesforce? Video", "https://www.salesforce.com/products/what-is-salesforce/video/"]
    ],
    practice: [
      "Create a Trailhead Playground or Developer Edition org.",
      "Explore Setup and identify five administrator tools.",
      "Navigate the Object Manager and view standard schema."
    ],
    questions: [
      "What is metadata in Salesforce?",
      "How are objects, fields, and records related?",
      "Which Setup tools would you use daily as an admin?"
    ],
    richContent: {
      moduleGoal: "Build the foundations of your Student Success CRM in a fresh Salesforce Developer Org, learn Setup navigation, and explore standard object databases.",
      learningOutcomes: [
        "Provision a free, permanent Salesforce Developer Edition org.",
        "Differentiate between Declarative (no-code) and Programmatic (code) options.",
        "Master Setup menu navigation, App Launcher usage, and timezone configs.",
        "Understand multi-tenant architecture and how metadata controls database rendering."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">What is Salesforce?</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          At its core, Salesforce is a cloud database. However, unlike standard databases (SQL, Oracle) that require tables to be designed via code, Salesforce provides a <strong>declarative (no-code) interface</strong>. You click buttons to create tables (called <strong>Objects</strong>), columns (called <strong>Fields</strong>), and rows (called <strong>Records</strong>).
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">The Metadata Architecture</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          When you configure objects or modify layouts, you aren't changing the database engine directly. You are creating <strong>Metadata</strong> (data about data). Salesforce reads this metadata configuration and dynamically displays forms, pages, and fields. This separates configuration from code and keeps upgrades seamless.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, we need a CRM system to manage student lifecycles. Instead of spreadsheet chaos, we are building a <strong>Student Success CRM</strong> inside Salesforce to track:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Students</strong>: Their contact information, account details, and registration dates.</li>
          <li><strong>Course Enrollments</strong>: Active learning paths (Admin, Flow, Apex) and progress percentages.</li>
          <li><strong>Tutor Activities</strong>: Lab reviews, interview scores, and certificates issued.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Setup Menu</strong>
            <span class="text-slate-500 text-xs">The central administration hub where profiles, security, users, and backend configuration are managed.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Object Manager</strong>
            <span class="text-slate-500 text-xs">The schema database manager where you design standard tables (Accounts) and add custom tables (Students).</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">App Launcher</strong>
            <span class="text-slate-500 text-xs">The application drawer that lets users toggle between custom CRM workspaces and standard sales/service applications.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Go to <a href='https://developer.salesforce.com/signup' target='_blank' class='text-brand-600 font-bold underline'>developer.salesforce.com/signup</a> and sign up for a free, permanent Developer Edition Org.",
        "Verify your email, activate your account, and set your secure password and security question.",
        "Log in, click the gear icon in the top right corner, and select <strong>Setup</strong>.",
        "In the Quick Find search box on the left, type <strong>Company Information</strong> to inspect timezone, currency, and organization ID.",
        "Go to the <strong>Object Manager</strong> tab next to Home, and explore Standard Objects (Accounts, Contacts, Leads)."
      ],
      bestPractices: [
        "Always write a detailed description inside object and field settings so future administrators understand the business purpose.",
        "Never perform initial configurations directly in a production environment; always use a Sandbox or Developer Org.",
        "Adopt a consistent naming convention: use PascalCase for labels and let Salesforce generate snake_case API names."
      ],
      commonMistakes: [
        "Modifying standard objects when a custom object is needed (e.g. trying to repurpose Accounts as courses).",
        "Selecting the wrong Developer Org timezone, leading to date stamp inconsistencies on audit histories.",
        "Leaving descriptions blank, which creates developer debt and review bottlenecks later."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Setup navigation is the bread and butter of Salesforce. When a user reports that they cannot see a custom record or that their currency settings are wrong, a junior administrator is expected to solve it instantly in the company profile or Object Manager.
        </p>
      `,
      interviewQuestions: [
        "What is the difference between a Standard Object and a Custom Object in Salesforce?",
        "Explain what Salesforce metadata is and how it separates configuration from code.",
        "How do you navigate to the company settings to verify your Organization ID?"
      ],
      handsOnLab: {
        title: "Lab 1: Explore Your Salesforce Developer Org",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Complete these steps in your <strong>Salesforce Developer Org or Trailhead Playground</strong>, then answer the <strong>Check My Work</strong> questions below to verify your setup.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Log in to your org at <strong>login.salesforce.com</strong></li>
            <li>Click the <strong>App Launcher</strong> (9-dot grid icon) and count the apps</li>
            <li>Go to <strong>Setup → Company Information</strong> — note your org edition</li>
            <li>Go to <strong>Setup → Object Manager</strong> — note the first standard object listed</li>
            <li>Go to <strong>Setup → Users</strong> — find your own Profile name</li>
            <li>Note the subdomain in your browser address bar (before .lightning.force.com)</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What is the exact Account Name you created?",
          type: "text",
          placeholder: "Enter the Account Name",
          hint: "Open the Account record you created and confirm the Account Name."
        },
        {
          id: "q2",
          question: "What is the exact Contact Last Name you created?",
          type: "text",
          placeholder: "Enter the Contact Last Name",
          hint: "Open the Contact record you created and confirm the Last Name."
        },
        {
          id: "q3",
          question: "Which Account is your Contact linked to?",
          type: "text",
          placeholder: "Enter the linked Account Name",
          hint: "Open the Contact record and check the linked Account Name."
        },
        {
          id: "q4",
          question: "What is the name of the Account list view you created?",
          type: "text",
          placeholder: "Enter the list view name",
          hint: "Open the Accounts tab and check your list view name."
        },
        {
          id: "q5",
          question: "Name the two columns visible in your Account list view.",
          type: "text",
          placeholder: "Enter visible columns (e.g. Account Name, Phone)",
          hint: "Open your Account list view and confirm Account Name and Phone are visible."
        }
      ]
    }
  },
  {
    title: "Data Modeling and Relationships",
    description: "Design reliable Salesforce data structures using objects, fields, relationships, and Schema Builder.",
    points: [
      "Choose correct field types for business requirements.",
      "Compare Lookup and Master-Detail relationships.",
      "Use junction objects and roll-up summaries."
    ],
    resources: [
      ["Trailhead Data Modeling", "https://trailhead.salesforce.com/content/learn/modules/data_modeling"],
      ["Object Reference Guide", "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/"]
    ],
    practice: [
      "Create an Incident custom object.",
      "Connect Accounts to Incidents.",
      "Map the data model in Schema Builder."
    ],
    questions: [
      "When should you use Master-Detail?",
      "What does a junction object solve?",
      "How can a poor data model affect reporting?"
    ]
  },
  {
    title: "User Access and Security",
    description: "Protect Salesforce data with least-privilege access and scalable sharing models.",
    points: [
      "Understand users, profiles, permission sets, and permission set groups.",
      "Set organization-wide defaults and role hierarchy.",
      "Use sharing rules, teams, and field-level security."
    ],
    resources: [
      ["Trailhead Data Security", "https://trailhead.salesforce.com/content/learn/modules/data_security"],
      ["Salesforce Security Guide", "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5"]
    ],
    practice: [
      "Create a permission set for Incident Managers.",
      "Design private record access with sharing rules.",
      "Test field visibility for two user personas."
    ],
    questions: [
      "Profile versus Permission Set?",
      "Why start with restrictive OWD?",
      "How do object, field, and record access combine?"
    ]
  },
  {
    title: "Data Management and Quality",
    description: "Import, update, clean, protect, and maintain trustworthy Salesforce data.",
    points: [
      "Choose between Data Import Wizard and Data Loader.",
      "Prevent duplicate and invalid records.",
      "Plan backups and safe bulk changes."
    ],
    resources: [
      ["Trailhead Data Management", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management"],
      ["Data Loader Guide", "https://developer.salesforce.com/docs/atlas.en-us.dataLoader.meta/dataLoader/"]
    ],
    practice: [
      "Import sample Incident records.",
      "Create a matching and duplicate rule.",
      "Document a safe data update checklist."
    ],
    questions: [
      "What should happen before a bulk update?",
      "How do external IDs help?",
      "How do you measure data quality?"
    ]
  },
  {
    title: "Forms, Validation, and User Experience",
    description: "Create efficient record experiences and enforce business rules without code.",
    points: [
      "Customize page layouts and Lightning record pages.",
      "Build formula fields and validation rules.",
      "Use Dynamic Forms, actions, and compact layouts."
    ],
    resources: [
      ["Lightning Experience Customization", "https://trailhead.salesforce.com/content/learn/modules/lex_customization"],
      ["Formulas and Validations", "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic"]
    ],
    practice: [
      "Create role-specific Incident page layouts.",
      "Build an Incident Age formula.",
      "Prevent invalid critical incident records."
    ],
    questions: [
      "Validation rule versus required field?",
      "Page layout versus Lightning page?",
      "How do you reduce user clicks?"
    ]
  },
  {
    title: "Flow Automation",
    description: "Automate business processes safely using Salesforce Flow.",
    points: [
      "Choose Screen, Record-Triggered, Scheduled, or Autolaunched Flow.",
      "Use decisions, loops, assignments, and fault paths.",
      "Design maintainable automation and avoid recursion."
    ],
    resources: [
      ["Flow Builder Basics", "https://trailhead.salesforce.com/content/learn/modules/flow-basics"],
      ["Flow Builder Guide", "https://help.salesforce.com/s/articleView?id=sf.flow.htm&type=5"]
    ],
    practice: [
      "Build an Incident creation Screen Flow.",
      "Notify users when an Incident becomes critical.",
      "Add a fault path and test negative scenarios."
    ],
    questions: [
      "When should a flow run before save?",
      "Why are fault paths important?",
      "How do you prevent conflicting automation?"
    ]
  },
  {
    title: "Reports and Dashboards",
    description: "Turn Salesforce data into useful operational and leadership insights.",
    points: [
      "Build tabular, summary, matrix, and joined reports.",
      "Use report types, filters, grouping, and formulas.",
      "Design dashboards for specific audiences."
    ],
    resources: [
      ["Reports and Dashboards Trailhead", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards"],
      ["Reports Help", "https://help.salesforce.com/s/articleView?id=sf.reports.htm&type=5"]
    ],
    practice: [
      "Build an Incident operational report.",
      "Create a management dashboard.",
      "Validate report access for multiple users."
    ],
    questions: [
      "What controls which records appear in a report?",
      "When is a custom report type required?",
      "What makes a dashboard actionable?"
    ]
  },
  {
    title: "Workplace Admin and Continuous Growth",
    description: "Apply admin skills after placement through support, governance, releases, and continuous improvement.",
    points: [
      "Investigate user issues and communicate resolutions.",
      "Manage requirements, sandboxes, testing, and releases.",
      "Track Salesforce releases and improve the org continuously."
    ],
    resources: [
      ["Salesforce Release Notes", "https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm&type=5"],
      ["Salesforce Admins Hub", "https://admin.salesforce.com/"],
      ["Trailhead Admin Career", "https://trailhead.salesforce.com/career-path/admin"]
    ],
    practice: [
      "Resolve a simulated production support ticket.",
      "Plan and test a small release.",
      "Create a quarterly org health review."
    ],
    questions: [
      "How do you investigate a user issue?",
      "What belongs in a release checklist?",
      "How do you prioritize admin improvements?"
    ]
  }
];

window.TomCodexAdminModules = modules;
window.TomCodexCourseConfig = {
  modules,
  masteryKey: "tomcodex.adminMasteryScores.v1",
  courseName: "Salesforce Administrator",
  recordLabel: "Admin",
  moduleHours: 3
};
