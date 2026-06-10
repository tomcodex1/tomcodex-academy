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
    title: "Reports and Dashboards",
    description: "Turn Salesforce data into useful operational and leadership insights with custom reports and dashboard visual components.",
    points: [
      "Explain the purpose of Reports and Dashboards in Salesforce.",
      "Understand standard vs custom Report Types.",
      "Differentiate between Tabular, Summary, and Matrix reports.",
      "Design Dashboards with visual components to track business KPIs."
    ],
    resources: [
      ["Reports and Dashboards Trailhead", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards"],
      ["Reports and Dashboards Help Docs", "https://help.salesforce.com/s/articleView?id=sf.reports_and_dashboards_overview.htm&type=5"]
    ],
    practice: [
      "Build custom reports grouping Students by Status and Enrollments by Course.",
      "Build a report tracking Pending Fee Payments.",
      "Create a Student Success CRM Dashboard with at least 3 components."
    ],
    questions: [
      "What is the difference between a Summary and a Matrix report?",
      "How do report types control the fields available for reports?",
      "What determines the access a user has to report data?"
    ],
    richContent: {
      moduleGoal: "Track and visualize your CRM metrics by building real reports and dashboard charts in your Developer Org.",
      learningOutcomes: [
        "Create custom reports with groupings and summary formulas.",
        "Design a custom Dashboard with multiple components (charts, metrics, tables).",
        "Understand folder sharing and how security controls record visibility in reports.",
        "Implement report filters and conditional formatting."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">Reports and Dashboards Overview</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          A report is a list of records that meet standard filtering criteria (e.g. active students). A dashboard is a graphical representation of report data, utilizing visual components such as bar charts, line charts, gauges, metrics, and tables.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Visualizing CRM KPIs</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Data is only as good as the insights it provides. Reports organize raw database records into rows and columns, while Dashboards aggregate those reports into a single, comprehensive command center view for business leaders.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, program managers need to track student signups, enrollment trends, and financial collections. We create the following items:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Students by Status Report</strong>: Groups student records by active, inactive, or graduated.</li>
          <li><strong>Enrollments by Course Report</strong>: Tracks how many students are enrolled in Admin vs Developer courses.</li>
          <li><strong>Student Success CRM Dashboard</strong>: Consolidates these reports into pie charts, gauges, and total collections metrics.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Reports Tab</strong>
            <span class="text-slate-500 text-xs">The application tab where users can run, customize, and schedule reports.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Dashboard Builder</strong>
            <span class="text-slate-500 text-xs">The drag-and-drop grid canvas where you add dashboard components linked to source reports.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Go to the <strong>Reports</strong> tab, click New Report, choose the custom report type for Students, and group by Status. Save as <strong>Students by Status</strong>.",
        "Create another report for Enrollments, group by Course, and save as <strong>Enrollments by Course</strong>.",
        "Create a report filtering fee payments where Status is Pending, and save as <strong>Pending Fee Payments</strong>.",
        "Go to the <strong>Dashboards</strong> tab, click New Dashboard, and name it <strong>Student Success CRM Dashboard</strong>.",
        "Add at least 3 components (e.g., Donut Chart for Students by Status, Bar Chart for Course Enrollments, Metric component for Pending Fees)."
      ],
      bestPractices: [
        "Always store reports and dashboards in shared folders with appropriate view permissions so colleagues can access them.",
        "Keep dashboards clean by limiting them to 5-9 highly relevant components representing core business metrics."
      ],
      commonMistakes: [
        "Linking dashboard components to reports stored in 'Private Reports' folder, which prevents other users from seeing them.",
        "Not setting the 'Dashboard Viewer' property correctly, causing data security leakages."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Operational reporting is one of the top requests for admins. Managers want to see their business metrics in real-time, and you will be responsible for translating raw request requirements into clean charts.
        </p>
      `,
      interviewQuestions: [
        "What is the difference between a custom report type and standard report type?",
        "Explain the differences between Tabular, Summary, and Matrix reports.",
        "Why would a user see a dashboard component but no data when clicking into the report?"
      ],
      handsOnLab: {
        title: "Lab 1: Create Custom Reports & Dashboard",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Build these reports and dashboards in your <strong>Salesforce Developer Org</strong>, then verify your work below.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Create the <strong>Students by Status</strong> summary report.</li>
            <li>Create the <strong>Enrollments by Course</strong> summary report.</li>
            <li>Create the <strong>Pending Fee Payments</strong> report.</li>
            <li>Create the <strong>Student Success CRM Dashboard</strong>.</li>
            <li>Add at least 3 dashboard components linked to the reports you created.</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What report did you create to group Students by Status?",
          type: "text",
          placeholder: "Enter Students by Status report name",
          hint: "Verify the exact name of the Student Status report."
        },
        {
          id: "q2",
          question: "What report did you create to track Enrollments by Course?",
          type: "text",
          placeholder: "Enter Enrollments by Course report name",
          hint: "Verify the exact name of the Course Enrollments report."
        },
        {
          id: "q3",
          question: "What report did you create to track Pending Fee Payments?",
          type: "text",
          placeholder: "Enter Pending Fee Payments report name",
          hint: "Verify the exact name of the Pending Fee Payments report."
        },
        {
          id: "q4",
          question: "What dashboard did you create for Student Success CRM?",
          type: "text",
          placeholder: "Enter Student Success CRM Dashboard name",
          hint: "Verify the exact name of the Dashboard."
        },
        {
          id: "q5",
          question: "Name any three dashboard components you added.",
          type: "text",
          placeholder: "Enter three component types (e.g. chart, metric, table)",
          hint: "Name component types like bar chart, pie chart, metric, table."
        }
      ]
    }
  },
  {
    title: "Flow Automation Foundations",
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
      "Build a student welcome Screen Flow.",
      "Notify managers when a student registers.",
      "Add a fault path to handle database update exceptions."
    ],
    questions: [
      "When should a flow run before save?",
      "Why are fault paths important in Flow Builder?",
      "How do you prevent conflicting automation recursion?"
    ],
    richContent: {
      moduleGoal: "Learn the fundamentals of Salesforce Flow Builder, select appropriate triggers, evaluate branching logic with Decisions, and create automatic actions safely.",
      learningOutcomes: [
        "Select the correct Flow types (Screen Flow, Record-Triggered Flow, Scheduled-Triggered Flow).",
        "Configure trigger events and object targets for automated backend changes.",
        "Implement Decisions and Outcomes to branch automation paths dynamically.",
        "Utilize global variables like $Record to read and modify context records."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">What is Salesforce Flow?</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Flow is Salesforce's most powerful declarative automation tool. It allows you to build complex logic, execute actions, and perform operations on records using a visual designer. It functions similarly to coding but uses a drag-and-drop flowchart builder.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Triggering Automations</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          A Record-Triggered Flow is fired automatically when a record is created, updated, or deleted. Think of it as a database trigger in traditional SQL databases. It runs in the background and can update fields, send emails, or create related records.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, program managers need automated operations on registration. When a student is created:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Trigger Flow</strong>: A Record-Triggered Flow triggers on Student__c creation.</li>
          <li><strong>Decision Element</strong>: Checks if the student's status is 'Active'.</li>
          <li><strong>Action</strong>: Automatically creates a welcome task or sends an automated welcome email.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Flow Builder</strong>
            <span class="text-slate-500 text-xs">The visual development environment where you draw boxes, decisions, and actions to create automation flows.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Flow Trigger Explorer</strong>
            <span class="text-slate-500 text-xs">The dashboard tool to view and order all record-triggered flows operating on a specific object and database event.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Go to <strong>Setup → Process Automation → Flows</strong> and click New Flow.",
        "Select <strong>Record-Triggered Flow</strong> and click Create.",
        "Set the object to <strong>Student__c</strong>, trigger when <strong>A record is created</strong>, and set the condition requirements to None.",
        "Drag a <strong>Decision</strong> element onto the canvas. Label it 'Check Status' and configure an outcome where status is 'Active'.",
        "Add a welcome task action or update field action, save the Flow as <strong>Student Registration Automation</strong> (API name: <code>Student_Registration_Automation</code>), and click <strong>Activate</strong>."
      ],
      bestPractices: [
        "Always define fault paths on update/delete elements to handle exceptions gracefully without throwing raw system errors to users.",
        "Limit the number of flows per object and event, and use the Flow Trigger Explorer to manage execution order."
      ],
      commonMistakes: [
        "Building conflicting validation rules and flows that block each other, causing save loops.",
        "Not utilizing the $Record global variable to retrieve details from the record that triggered the flow."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Flow is the primary automation tool in modern Salesforce environments. Companies rely on flows to replace legacy Workflow Rules and Process Builders. Knowing how to construct efficient, bug-free flows is highly sought after by employers.
        </p>
      `,
      interviewQuestions: [
        "What is the difference between a before-save and after-save Record-Triggered Flow?",
        "Explain when you would use a Screen Flow versus a Record-Triggered Flow.",
        "What is a fault path and why is it important in Flow Builder?"
      ],
      handsOnLab: {
        title: "Lab 1: Create Student Welcome Flow",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Build this record-triggered flow in your <strong>Salesforce Developer Org</strong>, then verify your work below.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Create a <strong>Record-Triggered Flow</strong> on the <strong>Student__c</strong> object.</li>
            <li>Configure the flow to trigger when a record is created.</li>
            <li>Name your flow <strong>Student Registration Automation</strong> (API name: <code>Student_Registration_Automation</code>).</li>
            <li>Add a <strong>Decision</strong> element to evaluate the Student status.</li>
            <li>Ensure the flow operates on the <code>$Record</code> global variable and activate the flow.</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What type of Flow did you create to automate Student registration?",
          type: "text",
          placeholder: "Enter Flow Type (e.g. Record-Triggered Flow)",
          hint: "Identify the starting template type you chose for the Flow."
        },
        {
          id: "q2",
          question: "Which object triggers your record-triggered flow?",
          type: "text",
          placeholder: "Enter object API name (e.g. Student__c)",
          hint: "The API name of the starting object you selected in the Flow trigger setup."
        },
        {
          id: "q3",
          question: "What is the API name of the Flow you created?",
          type: "text",
          placeholder: "Enter Flow API name",
          hint: "Verify the Flow API name (e.g. Student_Registration_Automation)."
        },
        {
          id: "q4",
          question: "What element in your flow evaluates conditions to branch logic?",
          type: "text",
          placeholder: "Enter element name (e.g. Decision)",
          hint: "The element type used to branch outcomes (Decision, Loop, etc)."
        },
        {
          id: "q5",
          question: "What global variable refers to the record that triggered the flow?",
          type: "text",
          placeholder: "Enter global variable (e.g. $Record)",
          hint: "Salesforce flow's default global resource referring to the source record."
        }
      ]
    }
  },
  {
    title: "Flow Automation Intermediate",
    description: "Automate complex business processes with record-triggered conditions, decision branching, creating/updating related records, and error handling.",
    points: [
      "Define record-triggered flows with criteria/conditions.",
      "Branch logic using complex Decision outcomes.",
      "Insert or modify related records using Create Records and Update Records elements.",
      "Enforce safety in automations with fault path error handling."
    ],
    resources: [
      ["Intermediate Salesforce Flow", "https://trailhead.salesforce.com/content/learn/modules/record-triggered-flows"],
      ["Flow Error Handling", "https://help.salesforce.com/s/articleView?id=sf.flow_troubleshoot.htm&type=5"]
    ],
    practice: [
      "Build a flow to automatically update Student Status when enrollments change.",
      "Create follow-up tasks for program managers when fees are pending.",
      "Add fault paths to capture database issues during updates."
    ],
    questions: [
      "How do entry criteria optimize flow performance?",
      "What is the difference between update record options in Flow?",
      "Why should you always write error details to the screen or logs in a fault path?"
    ],
    richContent: {
      moduleGoal: "Create efficient multi-object automations that react to record changes, create or update related records, and handle errors using fault paths.",
      learningOutcomes: [
        "Configure entry criteria to prevent unnecessary flow executions.",
        "Use Decision outcomes to evaluate complex business logic.",
        "Create related Task records automatically on record creation.",
        "Implement Fault Paths to intercept and handle database exceptions safely."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">Intermediate Automation Patterns</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Basic flows trigger actions, but real business logic requires conditions (e.g. only trigger if status changes) and multi-step changes. For instance, creating a record might fail if a validation rule blocks it. To prevent this from crashing the user's interface, you add a <strong>Fault Path</strong> to handle the error.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Create and Update Records Elements</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Flows can write changes directly to the database. The <strong>Create Records</strong> element lets you insert new records (like Tasks or Logs) automatically. The <strong>Update Records</strong> element updates other records in the system that are linked to the triggering record.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, when a student is created and has a pending fee payment, we want to automate follow-up:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Condition Trigger</strong>: Triggers on Enrollment__c when Status is 'Pending'.</li>
          <li><strong>Create Record Action</strong>: Automatically creates a follow-up Task for the administrator.</li>
          <li><strong>Fault Path</strong>: If task creation fails, writes to a debug log instead of blocking the student record.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Create Records Element</strong>
            <span class="text-slate-500 text-xs">The Flow element used to define field values and insert a new record into any Salesforce object.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Fault Path Connector</strong>
            <span class="text-slate-500 text-xs">The error-handling branch added to data elements (Create, Update, Delete) to route execution when an error occurs.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Create a new <strong>Record-Triggered Flow</strong> on the <strong>Enrollment__c</strong> object.",
        "Set the trigger to run when a record is created or updated, and set the entry criteria to: <code>Status__c Equals 'Pending'</code>.",
        "Add a <strong>Decision</strong> element to confirm if a follow-up is already required.",
        "Drag a <strong>Create Records</strong> element to create a Task. Map Subject to 'Follow Up on Fee Payment', and set the Related ID to the Enrollment's ID.",
        "Right-click the Create Records element, select <strong>Add Fault Path</strong>, and connect it to a Post to Chatter or email action to notify the admin of the error.",
        "Save the Flow as <strong>Enrollment_Follow_Up_Flow</strong> and activate it."
      ],
      bestPractices: [
        "Use tight entry criteria to make sure your flows only run when absolutely necessary, saving system resources.",
        "Never leave a fault path empty; always post to Chatter, send an email, or write a log record so failures are visible."
      ],
      commonMistakes: [
        "Building conflicting validation rules and flows that block each other, causing save loops.",
        "Triggering recursive update loops by updating the same record that triggered the flow in an after-save update."
      ],
      whyMattersInJob: `
        <p class="text-slate-600 text-xs leading-relaxed">
          Every production Salesforce org has complex automation. An administrator is expected to build flows that update related tables (like updating student enrollment totals) and prevent raw red-screen errors from reaching end-users.
        </p>
      `,
      interviewQuestions: [
        "Explain what a Fault Path is and why you should use it in data elements.",
        "How do you update related records in a flow without writing Apex code?",
        "Why is it better to use entry criteria instead of a Decision element immediately after the Start element?"
      ],
      handsOnLab: {
        title: "Lab 1: Build Related Record Automation with Error Handling",
        instructions: `
          <p class="text-slate-600 text-xs leading-relaxed mb-3">
            Build this intermediate flow in your <strong>Salesforce Developer Org</strong>, then verify your work below.
          </p>
          <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Create a new <strong>Record-Triggered Flow</strong> on <strong>Enrollment__c</strong> or <strong>Student__c</strong>.</li>
            <li>Configure the flow to trigger on creation or update with specific conditions.</li>
            <li>Use a <strong>Decision</strong> element to evaluate branching outcomes.</li>
            <li>Add a <strong>Create Records</strong> or <strong>Update Records</strong> element to automatically create/update a related Task or record.</li>
            <li>Configure a <strong>Fault Path</strong> on the data element to handle errors and activate the flow.</li>
          </ol>
        `
      },
      labCriteria: [
        {
          id: "q1",
          question: "What is the API name of your intermediate flow?",
          type: "text",
          placeholder: "Enter Flow API name (e.g. Student_Status_Update_Automation)",
          hint: "Confirm the API name of the Flow you configured."
        },
        {
          id: "q2",
          question: "Which object triggers your flow?",
          type: "text",
          placeholder: "Enter object API name (e.g. Enrollment__c)",
          hint: "The API name of the object setting off the trigger."
        },
        {
          id: "q3",
          question: "Which Flow element did you use to branch logic?",
          type: "text",
          placeholder: "Enter branching element name (e.g. Decision)",
          hint: "The Flow element used to evaluate multiple pathways."
        },
        {
          id: "q4",
          question: "Which Flow element did you use to create a follow-up task or record?",
          type: "text",
          placeholder: "Enter creation element name (e.g. Create Records)",
          hint: "The data element used to insert a record into the database."
        },
        {
          id: "q5",
          question: "Why is a fault path important in Salesforce Flow?",
          type: "text",
          placeholder: "Explain fault path importance",
          hint: "Explain what it handles when a database step fails."
        }
      ]
    }
  },
  {
    title: "Approval Processes and Advanced Automation",
    description: "Design systematic record approval processes to control how critical data gets reviewed, approved, or rejected in Salesforce — without writing a single line of code.",
    points: [
      "Configure single-step and multi-step Approval Processes for Student records.",
      "Understand approval steps, entry criteria, initial submission actions, and final actions.",
      "Compare approval processes vs flows vs validation rules — and choose the right tool."
    ],
    resources: [
      ["Approval Processes Help Docs", "https://help.salesforce.com/s/articleView?id=sf.approvals.htm&type=5"],
      ["Trailhead: Build an Approval Process", "https://trailhead.salesforce.com/content/learn/modules/business_process_automation/approvals"],
      ["Approval Process Best Practices", "https://developer.salesforce.com/blogs/2019/04/approval-processes-best-practices"]
    ],
    practice: [
      "Create a Student Graduation Approval Process on the Student__c object.",
      "Add an approval step requiring your manager profile to approve.",
      "Configure final approval actions: update Student Status to Graduated.",
      "Configure rejection actions: send an email alert to the student.",
      "Test the approval by submitting a Student record for approval."
    ],
    questions: [
      "When should you use an Approval Process instead of a Record-Triggered Flow?",
      "What is the difference between an Approval Step and an Approval Action?",
      "How does the Approval History related list help track approval status?"
    ],
    richContent: {
      moduleGoal: "Add executive-level governance to your Student Success CRM: build a formal approval workflow that requires manager sign-off before a student can be marked as Graduated.",
      learningOutcomes: [
        "Explain what an Approval Process is and how it differs from Flow automation.",
        "Configure entry criteria, approval steps, approver assignments, and approval/rejection actions.",
        "Test an approval process by submitting a student record and approving/rejecting it.",
        "Choose the right automation tool (Flow vs Approval vs Validation Rule) for a given requirement."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">What is an Approval Process?</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          An <strong>Approval Process</strong> is a Salesforce automation that sends a record to a designated person for review before a status change is committed. Unlike Flow (which runs automatically), approvals require a <strong>human decision</strong> — approve or reject.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Why Approvals Beat Manual Processes</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Without an approval process, anyone with edit access can set a student's status to <em>Graduated</em>. With an approval process, the record is <strong>locked</strong> after submission and can only change state once a qualified reviewer acts. This creates an auditable, consistent process.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Approval Process vs Flow</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Use <strong>Flow</strong> when: an action should happen automatically without human review (e.g., auto-create a task).<br/>
          Use <strong>Approval Process</strong> when: a human must consciously approve or reject a business decision.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          At <strong>TomCodeX Academy</strong>, before a student is marked <em>Graduated</em>, the Head Tutor must review their lab completion score and interview performance.
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Submission Trigger:</strong> Student clicks "Submit for Graduation Approval".</li>
          <li><strong>Record Lock:</strong> Student record is locked so no one can edit it during review.</li>
          <li><strong>Approver Notified:</strong> Head Tutor receives an email with Approve / Reject buttons.</li>
          <li><strong>On Approval:</strong> Student__c.Status__c automatically set to <em>Graduated</em>.</li>
          <li><strong>On Rejection:</strong> An email alert is sent to the student with feedback notes.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Setup → Process Automation → Approval Processes</strong>
            <span class="text-slate-500 text-xs">Where you create and manage all approval process configurations.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Record Detail Page → Submit for Approval button</strong>
            <span class="text-slate-500 text-xs">The button that appears when a record meets the entry criteria for an active approval process.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Approval History Related List</strong>
            <span class="text-slate-500 text-xs">Tracks every approval step, approver decision, and timestamp on the record.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Home → Items to Approve</strong>
            <span class="text-slate-500 text-xs">The approver's inbox where pending approval requests are listed for action.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Navigate to Setup → Process Automation → Approval Processes.",
        "Click <strong>Create New Approval Process</strong> → Use Standard Setup Wizard.",
        "Select <strong>Student__c</strong> as the Object. Name it <strong>Student Graduation Approval</strong> (API name: <code>Student_Graduation_Approval</code>).",
        "Set Entry Criteria: <code>Student__c.Status__c EQUALS Pending Graduation</code> (only records in this status can be submitted).",
        "Approval Assignment: select your Manager or Queue (for now, use your own user as approver).",
        "Enable <strong>Record Lock</strong> during the approval process.",
        "Add Final Approval Action: Field Update → <code>Status__c = Graduated</code>.",
        "Add Rejection Action: Email Alert → notify the student with rejection reason.",
        "Click <strong>Activate</strong>. Then open a Student record, set Status to Pending Graduation, and click Submit for Approval."
      ],
      bestPractices: [
        "Always lock the record during approval to prevent concurrent edits that could conflict with the approval outcome.",
        "Use approval process <strong>entry criteria</strong> to limit which records trigger the process — don't rely only on the Submit button.",
        "For multi-step approvals (e.g., Manager → Director → VP), define clear step order and escalation timeouts.",
        "Use email templates for approval/rejection notifications so communications are branded and consistent."
      ],
      labTask: {
        title: "Admin Module 9 Lab — Student Graduation Approval Process",
        description: "Build a complete Approval Process to govern student graduation in your Student Success CRM.",
        steps: [
          "In Setup, go to Process Automation → Approval Processes → select Student__c.",
          "Create a new process named: <strong>Student Graduation Approval</strong>.",
          "Set entry criteria: Status__c = Pending Graduation.",
          "Add one approval step — assign to your manager or yourself.",
          "Add final approval action: Field Update Status__c → Graduated.",
          "Add rejection action: Email Alert to the student.",
          "Activate the process. Submit a student record and approve it yourself.",
          "Take a screenshot of the Approval History related list showing the completed approval."
        ],
        labQuestions: [
          {
            id: "q1",
            question: "What is the API name of the Approval Process you created?",
            type: "text",
            placeholder: "Enter API name (e.g. Student_Graduation_Approval)",
            hint: "Check Setup → Approval Processes → the API Name column."
          },
          {
            id: "q2",
            question: "What object is the Approval Process built on?",
            type: "text",
            placeholder: "Enter object API name (e.g. Student__c)",
            hint: "The custom object for students in your CRM."
          },
          {
            id: "q3",
            question: "What field and value did you set as Entry Criteria?",
            type: "text",
            placeholder: "Describe field and value (e.g. Status__c = Pending Graduation)",
            hint: "Only records matching this criteria can be submitted for approval."
          },
          {
            id: "q4",
            question: "What Final Approval Action did you configure?",
            type: "text",
            placeholder: "Describe the action (e.g. Field Update Status__c to Graduated)",
            hint: "The action that runs automatically when the approver clicks Approve."
          },
          {
            id: "q5",
            question: "What is the key difference between an Approval Process and a Record-Triggered Flow?",
            type: "text",
            placeholder: "Explain the difference",
            hint: "Think about human decision vs. automatic execution."
          }
        ]
      }
    }
  },
  {
    title: "Data Management and Import Tools",
    description: "Master bulk data operations in Salesforce: import clean data, export records for backup or analysis, find and merge duplicates, and understand data governance best practices.",
    points: [
      "Use Data Import Wizard to load Student and Course records in bulk.",
      "Understand when to use Data Import Wizard vs. Data Loader.",
      "Configure Duplicate Rules and Matching Rules to protect data quality."
    ],
    resources: [
      ["Data Import Wizard Help", "https://help.salesforce.com/s/articleView?id=sf.data_import_wizard.htm&type=5"],
      ["Trailhead: Data Management", "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management"],
      ["Duplicate Management", "https://help.salesforce.com/s/articleView?id=sf.duplicate_prevention_overview.htm&type=5"]
    ],
    practice: [
      "Prepare a CSV file with 10 Student records and import using Data Import Wizard.",
      "Export existing Student records using Data Export (Setup).",
      "Create a Duplicate Rule on Student__c using Email as the matching field.",
      "Test the duplicate rule by trying to create a student with an existing email."
    ],
    questions: [
      "What is the maximum record limit for Data Import Wizard?",
      "When would you choose Data Loader over Data Import Wizard?",
      "What is the difference between a Matching Rule and a Duplicate Rule?"
    ],
    richContent: {
      moduleGoal: "Move your Student Success CRM from empty org to production-ready: bulk-load real data, protect against duplicates, and establish data governance practices used by every Salesforce Administrator.",
      learningOutcomes: [
        "Prepare a properly formatted CSV file for Salesforce import.",
        "Use Data Import Wizard to load Student records with field mapping.",
        "Export records using Data Export Service for backup purposes.",
        "Configure Duplicate Rules and Matching Rules to prevent duplicate students."
      ],
      simpleExplanation: `
        <h4 class="font-bold text-slate-800 text-sm">Why Data Management Matters</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          A Salesforce org is only as good as its data. When you first go live, you need to bring in existing records — students, courses, enrollments — from spreadsheets or old systems. This is called <strong>data migration</strong>.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Data Import Wizard vs Data Loader</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          <strong>Data Import Wizard</strong>: Browser-based, supports Standard + Custom Objects, max 50,000 records, no install needed. Perfect for admins.<br/>
          <strong>Data Loader</strong>: Desktop app (Windows/Mac), supports all objects, handles millions of records, great for developers and large migrations.
        </p>
        <h4 class="font-bold text-slate-800 text-sm mt-3">Duplicate Rules</h4>
        <p class="text-slate-600 text-xs mt-1 leading-relaxed">
          Duplicate Rules work with Matching Rules. The <strong>Matching Rule</strong> defines <em>how</em> to compare records (e.g., fuzzy match on Name, exact match on Email). The <strong>Duplicate Rule</strong> defines <em>what to do</em> when a match is found — Block, Allow with alert, or Report.
        </p>
      `,
      realBusinessExample: `
        <p class="text-slate-600 text-xs leading-relaxed">
          TomCodeX Academy is launching and needs to migrate 200 students from a Google Sheet into the Student Success CRM.
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-xs">
          <li><strong>Step 1:</strong> Export student data from Google Sheets as a CSV file.</li>
          <li><strong>Step 2:</strong> Clean data — standardize email format, remove blanks, fix status values to match picklist.</li>
          <li><strong>Step 3:</strong> Import using Data Import Wizard, mapping CSV columns to Salesforce fields.</li>
          <li><strong>Step 4:</strong> Enable Duplicate Rule on Email so no student appears twice.</li>
          <li><strong>Step 5:</strong> Schedule weekly Data Export to back up the org.</li>
        </ul>
      `,
      whereUsed: `
        <div class="space-y-3">
          <div>
            <strong class="text-brand-700 text-xs block">Setup → Data → Data Import Wizard</strong>
            <span class="text-slate-500 text-xs">Upload CSV files to create or update records in bulk across standard and custom objects.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Setup → Data → Data Export</strong>
            <span class="text-slate-500 text-xs">Export all org data as ZIP/CSV files for backup, analysis, or migration to another system.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Setup → Duplicate Management → Matching Rules</strong>
            <span class="text-slate-500 text-xs">Define field-level logic for comparing records to detect potential duplicates.</span>
          </div>
          <div>
            <strong class="text-brand-700 text-xs block">Setup → Duplicate Management → Duplicate Rules</strong>
            <span class="text-slate-500 text-xs">Configure what action Salesforce takes when a match is found — block, warn, or log.</span>
          </div>
        </div>
      `,
      stepByStepImplementation: [
        "Create a CSV file with columns: First_Name, Last_Name, Email__c, Status__c, Enrollment_Date__c. Add 10 rows of test student data.",
        "In Setup, search for <strong>Data Import Wizard</strong>. Click <strong>Launch Wizard</strong>.",
        "Select <strong>Custom Objects</strong> → <strong>Students</strong>. Choose <strong>Add new records</strong>.",
        "Upload your CSV. On the field mapping screen, match each CSV column to the corresponding Salesforce field.",
        "Review the import summary and click <strong>Start Import</strong>. Monitor progress in Setup → Bulk Data Load Jobs.",
        "For Duplicate Rules: go to Setup → Duplicate Management → Matching Rules → New Rule on Student__c.",
        "Add a match criterion: <strong>Email__c</strong> → Exact match. Activate the Matching Rule.",
        "Go to Duplicate Rules → New Rule on Student__c. Set Action: <strong>Block</strong> if a duplicate is found. Activate.",
        "Test by creating a student with the same email as an imported record — Salesforce should block it."
      ],
      bestPractices: [
        "Always run a small test import (5-10 records) before loading your full dataset to catch field mapping errors early.",
        "Back up your org with Data Export before any major import or configuration change.",
        "Use <strong>Upsert</strong> (instead of Insert) in Data Loader when re-importing to avoid creating duplicates of existing records.",
        "Set Duplicate Rules to <strong>Report</strong> first, review the duplicate report, then switch to <strong>Block</strong> once you're confident."
      ],
      labTask: {
        title: "Admin Module 10 Lab — Bulk Import and Duplicate Management",
        description: "Import Student records in bulk and configure Duplicate Rules to protect data quality in your Student Success CRM.",
        steps: [
          "Prepare a CSV with 10 Student records (First Name, Last Name, Email, Status).",
          "Use Data Import Wizard to import them into your Student__c object.",
          "Verify all 10 records appear in the Students list view.",
          "Go to Setup → Duplicate Management → create a Matching Rule on Email__c (Exact).",
          "Create a Duplicate Rule on Student__c — set action to Block.",
          "Activate both rules. Attempt to create a student with a duplicate email and confirm it is blocked.",
          "Take a screenshot of the error message showing the duplicate block."
        ],
        labQuestions: [
          {
            id: "q1",
            question: "How many Student records did you import using Data Import Wizard?",
            type: "text",
            placeholder: "Enter number (e.g. 10)",
            hint: "Count how many rows were in your CSV file."
          },
          {
            id: "q2",
            question: "What tool did you use to import the Student records?",
            type: "text",
            placeholder: "Enter tool name (e.g. Data Import Wizard)",
            hint: "The browser-based bulk import tool in Salesforce Setup."
          },
          {
            id: "q3",
            question: "What field did you use in your Matching Rule to detect duplicate students?",
            type: "text",
            placeholder: "Enter field name (e.g. Email__c)",
            hint: "The unique identifier used to identify the same student across records."
          },
          {
            id: "q4",
            question: "What action did you set in your Duplicate Rule when a match is found?",
            type: "text",
            placeholder: "Enter action (e.g. Block)",
            hint: "The Duplicate Rule can Block, Allow with alert, or Report."
          },
          {
            id: "q5",
            question: "What is the key difference between Data Import Wizard and Data Loader?",
            type: "text",
            placeholder: "Explain the difference",
            hint: "Think about record limits, objects supported, and who typically uses each tool."
          }
        ]
      }
    }
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
