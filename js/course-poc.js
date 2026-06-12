const selectedPoc = localStorage.getItem("tomcodex.selectedPocProject.v1") || "student";

const studentModules = [
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

const realEstateModules = [
  {
    title: "Property Listing & Schema Design",
    description: "Initialize your property sales project, map database relationships, and construct the Real Estate CRM schema.",
    points: [
      "Gather project requirements and outline properties, offers, and agent profiles.",
      "Design master-detail and lookup schema structures for tracking listings and bids.",
      "Use Schema Builder to review and confirm database relationship paths."
    ],
    resources: [
      ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"]
    ],
    practice: [
      "Create custom objects: Property_Listing__c, Property_Offer__c, and Bid__c.",
      "Configure master-detail links relating Offers to Listings and Bidders.",
      "Add custom fields to track offer status and purchase pricing stats."
    ],
    questions: [
      "How does a junction object solve the relationship between buyers and properties?",
      "Why is master-detail preferred for Bid records in this scenario?",
      "How does the schema design impact automated listing dashboard metrics?"
    ]
  },
  {
    title: "Custom Business Logic & Security Controls",
    description: "Write validation rules, configure profiles, design sharing metrics, and lock sensitive client financial details.",
    points: [
      "Enforce offer validation bounds with complex validation rules.",
      "Restrict client contact and financial visibility using Profiles and Permission Sets.",
      "Implement a private Organization-Wide Default and share records via Sharing Rules."
    ],
    resources: [
      ["Data Security Guide", "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5"]
    ],
    practice: [
      "Write a validation rule preventing offers on inactive or archived property listings.",
      "Lock seller and buyer financial details from non-assigned agent profiles.",
      "Create a Sharing Rule giving read-only access to branch managers."
    ],
    questions: [
      "What does OWD control vs Sharing Rules?",
      "Why are client bank details protected behind Field-Level Security?",
      "How are validations executed when submitting a new offer?"
    ]
  },
  {
    title: "Automated Workflows & Reactive LWC UI",
    description: "Build Flow automations to coordinate listing updates and design a custom LWC to display active property trends.",
    points: [
      "Coordinate multi-object updates using Record-Triggered Flows.",
      "Build a Screen Flow guide to walk agents through new property intakes.",
      "Create a Lightning Web Component querying Apex to show property metrics."
    ],
    resources: [
      ["LWC Developer Guide", "https://developer.salesforce.com/docs/platform/lwc/guide"]
    ],
    practice: [
      "Create a record-triggered flow updating property active listing counts on agent accounts.",
      "Design a responsive LWC named 'propertyPriceTrends' displaying active bids.",
      "Embed the component on the Property Lightning Page layout."
    ],
    questions: [
      "How do record-triggered flows compare with Apex triggers for offer approvals?",
      "What wire adapter is used to fetch Salesforce record data in LWC?",
      "How does LWC state reactivity handle dynamic bid updates?"
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
      "Write an Apex unit test class verifying property offer logic.",
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

const healthcareModules = [
  {
    title: "Patient Intake & Schema Design",
    description: "Initialize your patient portal project, map database relationships, and construct the Clinic CRM schema.",
    points: [
      "Gather project requirements and outline patients, appointments, and practitioner profiles.",
      "Design master-detail and lookup schema structures for tracking intake bookings.",
      "Use Schema Builder to review and confirm database relationship paths."
    ],
    resources: [
      ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"]
    ],
    practice: [
      "Create custom objects: Patient_Intake__c, Medical_Appointment__c, and Treatment_Plan__c.",
      "Configure master-detail links relating Appointments to Patients and Doctors.",
      "Add custom fields to track vital signs and diagnostic categories."
    ],
    questions: [
      "How does a junction object solve the relationship between doctors and patients?",
      "Why is master-detail preferred for Appointment records in this scenario?",
      "How does the schema design impact automated clinical metrics?"
    ]
  },
  {
    title: "Custom Business Logic & Security Controls",
    description: "Write validation rules, configure profiles, design sharing metrics, and lock sensitive records (HIPAA compliance).",
    points: [
      "Enforce medical intake data bounds with complex validation rules.",
      "Restrict patient health information visibility using Profiles and Permission Sets.",
      "Implement a private Organization-Wide Default and share records via Sharing Rules."
    ],
    resources: [
      ["Data Security Guide", "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5"]
    ],
    practice: [
      "Write a validation rule preventing appointments on inactive practitioner schedules.",
      "Lock sensitive patient medical history details behind HIPAA security controls.",
      "Create a Sharing Rule giving read-only access to specific clinic coordinators."
    ],
    questions: [
      "How does OWD Private protect HIPAA-regulated data?",
      "Why are medical records protected behind Field-Level Security?",
      "How are validations executed when submitting a new medical intake?"
    ]
  },
  {
    title: "Automated Workflows & Reactive LWC UI",
    description: "Build Flow automations to coordinate patient check-ins and design a custom LWC to display reactive doctor metrics.",
    points: [
      "Coordinate multi-object updates using Record-Triggered Flows.",
      "Build a Screen Flow guide to walk nurses through new patient check-ins.",
      "Create a Lightning Web Component querying Apex to show patient metrics."
    ],
    resources: [
      ["LWC Developer Guide", "https://developer.salesforce.com/docs/platform/lwc/guide"]
    ],
    practice: [
      "Create a record-triggered flow updating patient visit count on clinic records.",
      "Design a responsive LWC named 'doctorPatientPortal' displaying vital signs.",
      "Embed the component on the Patient Lightning Page layout."
    ],
    questions: [
      "How do record-triggered flows compare with Apex triggers for patient bookings?",
      "What wire adapter is used to fetch Salesforce record data in LWC?",
      "How does LWC state reactivity handle dynamic patient list updates?"
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
      "Write an Apex unit test class verifying patient treatment plan logic.",
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

const customModules = [
  {
    title: "Custom Project Inception & Schema Design",
    description: "Initialize your custom project, map database relationships, and construct your custom schema.",
    points: [
      "Gather project requirements and outline primary and secondary custom objects.",
      "Design master-detail and lookup schema structures for tracking your custom records.",
      "Use Schema Builder to review and confirm database relationship paths."
    ],
    resources: [
      ["Salesforce Well-Architected", "https://architect.salesforce.com/well-architected/overview"]
    ],
    practice: [
      "Create your custom primary and secondary objects.",
      "Configure master-detail or lookup links relating the custom objects.",
      "Add custom fields to track status, metrics, and audit timestamps."
    ],
    questions: [
      "How do custom objects and relationships support your business requirements?",
      "Why did you choose lookup or master-detail for your relationships?",
      "How does the schema design impact automated dashboard metrics?"
    ]
  },
  {
    title: "Custom Business Logic & Security Controls",
    description: "Write validation rules, configure profiles, design sharing metrics, and lock sensitive custom records.",
    points: [
      "Enforce data quality and inputs with complex multi-field Validation Rules.",
      "Restrict visibility to sensitive custom fields using Profiles and Permission Sets.",
      "Implement a private Organization-Wide Default and share records via Sharing Rules."
    ],
    resources: [
      ["Data Security Guide", "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5"]
    ],
    practice: [
      "Write a validation rule preventing custom records from being created in invalid states.",
      "Lock sensitive custom fields from standard user profiles.",
      "Create a Sharing Rule giving read-only access to managers or supervisors."
    ],
    questions: [
      "What does OWD control vs Sharing Rules?",
      "Why are sensitive custom fields protected behind Field-Level Security?",
      "How are validations executed when submitting a new custom record?"
    ]
  },
  {
    title: "Automated Workflows & Reactive LWC UI",
    description: "Build Flow automations to coordinate custom status updates and design a custom LWC to display reactive metrics.",
    points: [
      "Coordinate multi-object updates using Record-Triggered Flows.",
      "Build a Screen Flow guide to walk users through new record entries.",
      "Create a Lightning Web Component querying Apex to show custom metrics."
    ],
    resources: [
      ["LWC Developer Guide", "https://developer.salesforce.com/docs/platform/lwc/guide"]
    ],
    practice: [
      "Create a record-triggered flow updating custom counts on parent accounts.",
      "Design a responsive LWC named 'customDashboard' displaying records.",
      "Embed the component on the Custom Record Lightning Page layout."
    ],
    questions: [
      "How do record-triggered flows compare with Apex triggers for your custom logic?",
      "What wire adapter is used to fetch Salesforce record data in LWC?",
      "How does LWC state reactivity handle dynamic custom list updates?"
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
      "Write an Apex unit test class verifying custom logic operations.",
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

const moduleMapping = {
  student: studentModules,
  realestate: realEstateModules,
  healthcare: healthcareModules,
  custom: customModules
};

const activeModules = moduleMapping[selectedPoc] || studentModules;

window.TomCodexCourseConfig = {
  modules: activeModules,
  masteryKey: "tomcodex.pocMasteryScores.v1",
  courseName: "Final POC Project",
  recordLabel: "POC",
  moduleHours: 3
};

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("pocProjectSelector");
  if (selector) {
    selector.value = selectedPoc;
    selector.addEventListener("change", (event) => {
      localStorage.setItem("tomcodex.selectedPocProject.v1", event.target.value);
      location.reload();
    });
  }
  
  // Update header text based on selected project
  const projectTitles = {
    student: { title: "Final Capstone POC Project", desc: "Design, build, and deploy a complete Salesforce Student Success CRM project. Integrate data modeling, sharing rules, validation rules, screen & record-triggered flows, custom LWC dashboards, and Zentom AI agents." },
    realestate: { title: "Real Estate CRM Capstone", desc: "Design, build, and deploy a complete Salesforce Real Estate CRM project. Integrate listings, offers, OWD security, record-triggered flows, custom LWC dashboards, and Zentom AI listing agents." },
    healthcare: { title: "Healthcare Patient CRM Capstone", desc: "Design, build, and deploy a complete Salesforce Patient CRM project. Integrate medical records, HIPAA access controls, appointment record-triggered flows, custom LWC dashboards, and Zentom scheduling agents." },
    custom: { title: "Custom Capstone Project", desc: "Design, build, and deploy your own custom Salesforce project in your org. Integrate custom schemas, OWD security locks, custom record flows, custom LWC dashboards, and Zentom copilot assistants." }
  };
  const config = projectTitles[selectedPoc] || projectTitles.student;
  const titleEl = document.getElementById("pocHeaderTitle");
  const descEl = document.getElementById("pocHeaderDesc");
  if (titleEl) titleEl.textContent = config.title;
  if (descEl) descEl.textContent = config.desc;
});
