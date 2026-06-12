const integrationModules = [
  {
    title: "Salesforce REST API Basics & Workbench",
    description: "Understand REST API principles, Salesforce standard endpoints, HTTP verbs, and execute queries using Salesforce Workbench.",
    points: [
      "Explain REST principles (statelessness, resources, URIs, HTTP methods).",
      "Use Salesforce standard REST endpoints to query and modify records.",
      "Execute REST requests securely via Salesforce Workbench developer tools."
    ],
    resources: [
      ["REST API Developer Guide", "https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_api.htm"],
      ["Salesforce Workbench", "https://workbench.developerforce.com/"]
    ],
    practice: [
      "Log into Workbench and execute a GET query on standard Account metadata.",
      "Create a new custom record in your org using a POST request in Workbench.",
      "Update a field using a PATCH request and verify in Salesforce."
    ],
    questions: [
      "What is the difference between standard and custom REST endpoints?",
      "Why is REST preferred over SOAP for lightweight client-side applications?",
      "What is the purpose of the HTTP PATCH method in Salesforce REST API?"
    ]
  },
  {
    title: "SOAP API & Bulk API at Scale",
    description: "Compare SOAP and REST protocols, read WSDL schemas, and handle large data volumes using the asynchronous Bulk API 2.0.",
    points: [
      "Differentiate between REST (JSON/HTTP) and SOAP (XML/WSDL) protocols.",
      "Understand enterprise vs partner WSDL schemas for system integrations.",
      "Configure and monitor bulk data upload jobs using Bulk API 2.0."
    ],
    resources: [
      ["SOAP API Guide", "https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/"],
      ["Bulk API 2.0 Guide", "https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/"]
    ],
    practice: [
      "Download your Developer Org's Partner WSDL from Setup.",
      "Set up a bulk upload job for 1,000 mock Student records.",
      "Monitor the bulk job execution and troubleshoot processing failures."
    ],
    questions: [
      "When would you use the SOAP API instead of the REST API?",
      "How does Bulk API 2.0 bypass standard synchronous governor limits?",
      "What is the limit of records supported in a single Bulk API 2.0 load?"
    ]
  },
  {
    title: "Named Credentials & Authentication",
    description: "Configure secure outbound calls using Named Credentials, External Credentials, and mock auth providers without exposing secrets.",
    points: [
      "Understand why hardcoded authentication secrets are a security risk.",
      "Create External Credentials defining authentication protocols (OAuth, Custom).",
      "Configure Named Credentials referencing External Credentials for secure calls."
    ],
    resources: [
      ["Named Credentials Help", "https://help.salesforce.com/s/articleView?id=sf.named_credentials_about.htm&type=5"]
    ],
    practice: [
      "Define an External Credential using Custom authentication.",
      "Set up a Named Credential pointing to an external mock service endpoint.",
      "Grant permission set access to the External Credential principal."
    ],
    questions: [
      "What is the main benefit of separating External and Named Credentials?",
      "How do permission sets grant users access to Named Credentials?",
      "Why should you avoid hardcoding API keys in Apex code?"
    ]
  },
  {
    title: "JSON Serialization & Parsing in Apex",
    description: "Serialize Apex objects to JSON strings and parse complex JSON responses into typed Apex classes and untyped maps.",
    points: [
      "Use JSON.serialize and JSON.serializePretty to generate string payloads.",
      "Parse JSON strings using JSON.deserialize and typed inner classes.",
      "Read dynamic or unstructured payloads using untyped JSON parsing."
    ],
    resources: [
      ["JSON Class Reference", "https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_class_System_Json.htm"]
    ],
    practice: [
      "Write an Apex script that serializes a list of Student records.",
      "Create an inner parser class using JSON2Apex tools to deserialize a response.",
      "Write an untyped parsing script using Map<String, Object>."
    ],
    questions: [
      "Typed vs Untyped JSON parsing: when to use which?",
      "What is the role of the JSONGenerator class in Apex?",
      "How does JSON.deserializeStrict enforce schema compliance?"
    ]
  },
  {
    title: "Apex Outbound HTTP Callouts",
    description: "Build robust Apex services executing outbound GET, POST, and PUT HTTP requests, and handle response codes and callout mocks.",
    points: [
      "Instantiate HttpRequest, Http, and HttpResponse classes in Apex.",
      "Execute outbound callouts using Named Credentials.",
      "Write unit tests with HttpCalloutMock to achieve 100% test coverage."
    ],
    resources: [
      ["Apex Callouts Guide", "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_callouts.htm"]
    ],
    practice: [
      "Write a service class making a GET request to retrieve student attendance.",
      "Create an Apex HTTP callout class that sends student exam scores.",
      "Write a test class implementing HttpCalloutMock to verify success/error flows."
    ],
    questions: [
      "Why are HTTP callouts blocked in Apex triggers directly?",
      "How do you implement a mock callout for unit tests?",
      "What governor limit regulates callouts in a single Apex transaction?"
    ]
  },
  {
    title: "Apex REST Services (Inbound)",
    description: "Expose custom endpoints in Salesforce using Apex REST annotations (@RestResource, @HttpGet, @HttpPost) for external system consumption.",
    points: [
      "Use @RestResource to expose custom endpoints with global URIs.",
      "Implement @HttpGet and @HttpPost methods consuming and returning data.",
      "Access request context variables using RestContext.request."
    ],
    resources: [
      ["Apex REST Guide", "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_rest_intro.htm"]
    ],
    practice: [
      "Create an Apex REST class mapping to /StudentService/*.",
      "Implement a GET method returning Student data for a given parameter ID.",
      "Implement a POST method that creates a new course enrollment record."
    ],
    questions: [
      "What sharing setting is respected by custom Apex REST classes?",
      "How do you access URL parameters in an @HttpGet service?",
      "How are exceptions handled and returned to external REST clients?"
    ]
  },
  {
    title: "Event-Driven Integration (Platform Events)",
    description: "Design real-time asynchronous integrations using Platform Events, Event Bus publishing, and triggers or Flow subscribers.",
    points: [
      "Explain the difference between point-to-point and event-driven architectures.",
      "Publish Platform Events using Apex EventBus.publish and flows.",
      "Subscribe to Platform Events using Apex triggers, Flow, or CometD clients."
    ],
    resources: [
      ["Platform Events Developer Guide", "https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/"]
    ],
    practice: [
      "Create a custom Platform Event object: Student_Status_Change__e.",
      "Write an Apex trigger that publishes an event when a Student status is updated.",
      "Create a subscriber Flow that listens to the event and creates an task."
    ],
    questions: [
      "What is the difference between a standard sObject and a Platform Event?",
      "What does publish after commit vs publish immediately control?",
      "How does event replay work in Salesforce Event Bus?"
    ]
  },
  {
    title: "Integration Governance & Error Handling",
    description: "Design resilient integration frameworks managing timeouts, error retry queues, logging, and performance governor limits.",
    points: [
      "Handle HTTP callout timeouts and system exceptions gracefully.",
      "Build custom logging tables to record inbound and outbound integration history.",
      "Design retry strategies for failed integration calls using Queueable Apex."
    ],
    resources: [
      ["Integration Patterns Guide", "https://developer.salesforce.com/docs/atlas.en-us.integration_patterns_and_practices.meta/integration_patterns_and_practices/"]
    ],
    practice: [
      "Create an Integration_Log__c custom object to track call history.",
      "Write a utility Apex class that wraps callouts in try-catch-log blocks.",
      "Implement a Queueable retry handler that requeues failed callouts."
    ],
    questions: [
      "What are the best practices for handling a 503 Service Unavailable error?",
      "How do integrations affect Salesforce API request limit allocations?",
      "What is the standard timeout limit for Apex HTTP callouts?"
    ]
  }
];

window.TomCodexCourseConfig = {
  modules: integrationModules,
  masteryKey: "tomcodex.integrationMasteryScores.v1",
  courseName: "Salesforce Integration",
  recordLabel: "Integration",
  moduleHours: 3
};
