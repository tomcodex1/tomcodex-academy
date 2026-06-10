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
    title: "Page Layouts, Lightning App, and User Experience",
    description: "Customize user interfaces with page layouts, list views, tabs, and create a custom Lightning app.",
    points: [
      "Create custom tabs for Student, Course, and Enrollment custom objects.",
      "Design a custom Lightning CRM App to group Student Success tabs together.",
      "Customize page layouts and assign compact views for optimal layout."
    ],
    resources: [
      ["App Customization Trailhead", "https://trailhead.salesforce.com/content/learn/modules/lex_migration_customization"],
      ["Lightning App Builder Guide", "https://help.salesforce.com/s/articleView?id=sf.app_builder_overview.htm&type=5"]
    ],
    practice: [
      "Create the Student Success CRM Lightning App.",
      "Create custom object tabs for Student, Course, and Enrollment.",
      "Customize and assign the Student Layout page layout."
    ],
    questions: [
      "What is the difference between a page layout and a Lightning record page?",
      "How do compact layouts improve user experience on mobile devices?",
      "What features can be customized inside the Lightning App Setup?"
    ],
    richContent: {
      moduleGoal: "Group custom objects into a dedicated student CRM application and customize page layouts for ease of data entry.",
      learningOutcomes: [
        "Create custom tabs for custom objects (Student, Course, Enrollment).",
        "Build a custom Lightning App called 'Student Success CRM'.",
        "Configure fields and sections on the Student custom page layout.",
        "Create a custom List View to filter active student records."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">Lightning Apps</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          A Lightning App is a curated collection of tabs, utilities, and items grouped together to serve a specific business user persona. It gives your users a single workspace where they can find everything they need.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Page Layouts and List Views</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Page Layouts control which fields, buttons, and related lists are visible on detail pages, and in what order. List Views allow users to filter and view lists of records that match certain criteria (e.g., Active Students).
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, program managers need a unified workspace to manage the CRM. We build a custom app called <strong>Student Success CRM</strong> containing:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Student Tab</strong>: A custom tab linking to Student__c records.</li>
          <li><strong>Course Tab</strong>: A custom tab linking to Course__c records.</li>
          <li><strong>Enrollment Tab</strong>: A custom tab linking to Enrollment__c records.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">App Manager</strong>
            <span class="text-slate-500 text-xs">The Setup tool used to create, customize, and assign Lightning Apps.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Page Layout Editor</strong>
            <span class="text-slate-500 text-xs">The drag-and-drop editor used to organize field sections, buttons, and related lists.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Go to <strong>Setup → Custom Code → Tabs</strong> and create custom Custom Object Tabs for Student, Course, and Enrollment.",
        "Go to <strong>Setup → App Manager</strong> and click New Lightning App. Name it <strong>Student Success CRM</strong>.",
        "Add Student, Course, and Enrollment tabs to the navigation items and assign the app to your profile.",
        "Go to <strong>Setup → Object Manager → Student__c → Page Layouts</strong> and edit the default layout. Group custom fields into a section called 'Contact Info'.",
        "Create a custom List View on the Student tab named 'Active Students' to filter records by Status."
      ],
      bestPractices: [
        "Only display necessary fields on page layouts to reduce user cognitive load and avoid clutter.",
        "Name custom list views clearly so users understand the filter criteria immediately."
      ],
      commonMistakes: [
        "Forgetting to assign the custom Lightning App to profiles, causing it to be invisible to users.",
        "Putting too many fields in a single page layout section instead of grouping them logically."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Creating apps and customizing page layouts is one of the most common everyday requests for Salesforce Administrators. Making fields easy to find improves user adoption and data quality.
        </p>
      `,
      interviewQuestions: [
        "What is a Lightning App and how does it help users?",
        "Explain how page layouts differ from compact layouts.",
        "How do you configure list view visibility for different user groups?"
      ],
      handsOnLab: {
        title: "Lab 1: Configure App Experience & Custom Layouts",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Perform these steps in your <strong>Salesforce Developer Org</strong>, then answer the <strong>Check My Work</strong> questions below to verify your work.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Create Custom Object Tabs for your custom objects (Student, Course, Enrollment).</li>
            <li>Build a new Lightning App named <strong>Student Success CRM</strong>, add the custom tabs, and assign it to System Administrator.</li>
            <li>In Object Manager, customize the Student Page Layout to organize your fields.</li>
            <li>On the Students tab, create a new List View named <strong>Active Students</strong>.</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What is the exact name of the Lightning App you created?",
          type: "text",
          placeholder: "Enter the Lightning App Name",
          hint: "Verify the exact app name you created in Setup App Manager."
        },
        {
          id: "q2",
          question: "What is the API name of the Student tab you created?",
          type: "text",
          placeholder: "Enter the Student Tab API name",
          hint: "Verify the custom tab API name (usually Student__c)."
        },
        {
          id: "q3",
          question: "What is the API name of the Course tab you created?",
          type: "text",
          placeholder: "Enter the Course Tab API name",
          hint: "Verify the Course tab API name (usually Course__c)."
        },
        {
          id: "q4",
          question: "What is the API name of the Enrollment tab you created?",
          type: "text",
          placeholder: "Enter the Enrollment Tab API name",
          hint: "Verify the Enrollment tab API name (usually Enrollment__c)."
        },
        {
          id: "q5",
          question: "Name the customized Student Page Layout you configured.",
          type: "text",
          placeholder: "Enter the customized Page Layout name",
          hint: "Verify the name of the page layout under Student Object Manager Page Layouts."
        },
        {
          id: "q6",
          question: "What is the name of the customized List View you created for Students?",
          type: "text",
          placeholder: "Enter the custom List View name",
          hint: "Verify the name of the list view you configured on the Student record list page."
        }
      ]
    }
  },
  {
    title: "Validation Rules and Data Quality",
    description: "Create efficient record experiences and enforce business rules without code using Salesforce validation rules.",
    points: [
      "Explain the purpose of validation rules and data quality in Salesforce.",
      "Create validation rules to enforce email and phone fields.",
      "Configure enrollment status rules to restrict status transitions."
    ],
    resources: [
      ["Formulas and Validations Trailhead", "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic"],
      ["Salesforce Validation Rules Help", "https://help.salesforce.com/s/articleView?id=sf.validation_rules_overview.htm&type=5"]
    ],
    practice: [
      "Create a validation rule requiring Student Email on Student__c.",
      "Create a validation rule for Enrollment Status on Enrollment__c.",
      "Test validation rules with positive and negative records."
    ],
    questions: [
      "What is the difference between a required field and a validation rule?",
      "How do validation rules improve data quality?",
      "Can validation rules bypass system administrators?"
    ],
    richContent: {
      moduleGoal: "Build data quality controls for your Student Success CRM using validation rules to prevent incorrect data entry.",
      learningOutcomes: [
        "Enforce required fields (like Email) conditionally using formulas.",
        "Restrict invalid status changes on core CRM objects.",
        "Understand formula functions like ISBLANK, ISPICKVAL, and AND/OR logic.",
        "Differentiate between UI-level requirements and system-level validation."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">What is a Validation Rule?</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          A Validation Rule is a business rule defined by a formula that evaluates to <strong>True</strong> or <strong>False</strong>. If the formula evaluates to True, it means the record contains invalid data. Salesforce blocks the save operation and displays a custom error message to the user.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Data Quality at the Core</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          While making a field required on a Page Layout makes it mandatory on the UI, it doesn't prevent API uploads (like Data Loader) from inserting blank values. Validation Rules run at the database level, ensuring data quality across all entry channels.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, program managers must have a valid email for every student to send notifications. We build validation rules on <strong>Student Success CRM</strong>:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Student Email Required</strong>: Blocks saving a student if the Email field is blank.</li>
          <li><strong>Enrollment Status Check</strong>: Blocks setting enrollment status to completed if grade criteria aren't met.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Validation Rules Section</strong>
            <span class="text-slate-500 text-xs">Located in Object Manager under each object's side menu. Used to create and manage rules.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Formula Editor</strong>
            <span class="text-slate-500 text-xs">The logic canvas where you construct expressions using merge fields, operators, and functions.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Go to <strong>Object Manager → Student__c → Validation Rules</strong> and click New.",
        "Name the rule <strong>Student_Email_Required</strong>. Set the formula to <code>ISBLANK(Email__c)</code> (or standard Email field if custom).",
        "Set the error message: 'Student Email is required.' and position it next to the Email field.",
        "Go to <strong>Object Manager → Enrollment__c → Validation Rules</strong> and create a rule named <strong>Enrollment_Status_Required</strong>.",
        "Test both rules by trying to save records that violate the criteria in your app."
      ],
      bestPractices: [
        "Always write clear, helpful error messages that explain exactly how to fix the problem.",
        "Test validation rules as non-admin users to ensure they don't block normal user operations."
      ],
      commonMistakes: [
        "Writing validation formulas that evaluate to True for valid records, which completely blocks users from saving.",
        "Forgetting to handle blank values in compound logic, leading to unexpected record saves."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Clean data is essential for accurate reports and automation. As an administrator, you will regularly write validation rules to guard data entry, preventing downstream errors in flows, emails, and integrations.
        </p>
      `,
      interviewQuestions: [
        "Explain the difference between a validation rule and making a field required on a layout.",
        "What happens when a validation rule formula evaluates to True?",
        "How do you bypass a validation rule for integration users?"
      ],
      handsOnLab: {
        title: "Lab 1: Configure Validation Rules",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Implement these rules in your <strong>Salesforce Developer Org</strong>, then answer the <strong>Check My Work</strong> questions below.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Create a validation rule on <strong>Student__c</strong> to require email.</li>
            <li>Create a validation rule on <strong>Enrollment__c</strong> to require status.</li>
            <li>Test both rules in your custom app to verify they display custom error messages correctly.</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What validation rule did you create to require Student Email?",
          type: "text",
          placeholder: "Enter validation rule name",
          hint: "Confirm the validation rule name you created on Student__c."
        },
        {
          id: "q2",
          question: "Which object contains your Student Email validation rule?",
          type: "text",
          placeholder: "Enter object API name",
          hint: "API name of the object containing the rule (e.g. Student__c)."
        },
        {
          id: "q3",
          question: "What validation rule did you create for Enrollment Status?",
          type: "text",
          placeholder: "Enter status validation rule name",
          hint: "Confirm the validation rule name you created on Enrollment__c."
        },
        {
          id: "q4",
          question: "Why are validation rules important in Salesforce?",
          type: "text",
          placeholder: "Explain validation rules importance",
          hint: "Explain what validation rules enforce (e.g. data quality)."
        },
        {
          id: "q5",
          question: "Name any two fields you protected using validation rules.",
          type: "text",
          placeholder: "Enter two fields (e.g. Email, Status)",
          hint: "Specify fields like Email, Status, etc."
        }
      ]
    }
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
