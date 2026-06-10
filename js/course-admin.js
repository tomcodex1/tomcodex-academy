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
