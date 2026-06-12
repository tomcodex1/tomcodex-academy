const pocModules = [
  {
    title: "Project Inception & Schema Design",
    description: "Initialize your capstone project, map database relationships, and construct the Student Success CRM schema.",
    points: [
      "Gather project requirements and outline objects, fields, and access profiles.",
      "Design master-detail and lookup schema structures for tracking enrollments.",
      "Use Schema Builder to review and confirm database relationship paths."
    ],
    resources: [
      ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"]
    ],
    practice: [
      "Create custom objects: Student__c, Course__c, and Enrollment__c.",
      "Configure master-detail links relating Enrollments to Courses and Students.",
      "Add custom fields to track percentage progress and audit stamps."
    ],
    questions: [
      "How does a junction object solve the many-to-many link between students and courses?",
      "Why is master-detail preferred for Enrollment records in this scenario?",
      "How does the schema design impact automated dashboard metrics?"
    ]
  },
  {
    title: "Custom Business Logic & Security Controls",
    description: "Write validation rules, configure profiles, design sharing metrics, and lock sensitive records behind security protocols.",
    points: [
      "Enforce data quality and inputs with complex multi-field Validation Rules.",
      "Restrict object and field-level visibility using Profiles and Permission Sets.",
      "Implement a private Organization-Wide Default and share records via Sharing Rules."
    ],
    resources: [
      ["Data Security Guide", "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5"]
    ],
    practice: [
      "Write a validation rule preventing enrollments on inactive courses.",
      "Lock Student contact details from other standard profile users.",
      "Create a Sharing Rule giving read-only access to specific department leads."
    ],
    questions: [
      "What is the difference between object-level security and field-level security?",
      "Why is OWD set to Private when implementing custom sharing rules?",
      "When does a validation rule run in the Salesforce order of execution?"
    ]
  },
  {
    title: "Automated Workflows & Reactive LWC UI",
    description: "Build Flow automations to coordinate status updates and design a custom LWC to display reactive student metrics.",
    points: [
      "Coordinate multi-object updates using Record-Triggered Flows.",
      "Build a Screen Flow guide to walk tutors through new student intake.",
      "Create a Lightning Web Component querying Apex to show student metrics."
    ],
    resources: [
      ["LWC Developer Guide", "https://developer.salesforce.com/docs/platform/lwc/guide"]
    ],
    practice: [
      "Create a record-triggered flow updating student active count on accounts.",
      "Design a responsive LWC named 'studentSkillPassport' displaying stats.",
      "Embed the component on the Account Lightning Page layout."
    ],
    questions: [
      "How do record-triggered flows compare with Apex triggers for simple updates?",
      "What wire adapter is used to fetch Salesforce record data in LWC?",
      "How does LWC state reactivity handle dynamic list updates?"
    ]
  },
  {
    title: "System Verification, Governance & Deployment",
    description: "Write Apex tests to verify transaction bounds, audit performance, and design a deployment release plan.",
    points: [
      "Verify triggers and validation bounds using Apex Unit Tests and factories.",
      "Perform performance scans and verify governor limits under bulk conditions.",
      "Create change sets or Salesforce CLI deployment plans for release."
    ],
    resources: [
      ["Application Lifecycle Management", "https://trailhead.salesforce.com/content/learn/modules/application-lifecycle-and-development-models"]
    ],
    practice: [
      "Write an Apex unit test class verifying student enrollment logic.",
      "Run the Salesforce Code Analyzer tool on your project folder.",
      "Draft a release validation checklist and rollout schedule documentation."
    ],
    questions: [
      "Why is testing with bulk records (200+) a requirement for deployment?",
      "What is the difference between sandbox validation and production deployment?",
      "How do custom metadata types assist in environment configuration?"
    ]
  }
];

window.TomCodexCourseConfig = {
  modules: pocModules,
  masteryKey: "tomcodex.pocMasteryScores.v1",
  courseName: "Final POC Project",
  recordLabel: "POC",
  moduleHours: 3
};
