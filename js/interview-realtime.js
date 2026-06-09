window.TomCodexRealWorldInterviewBank = {
  admin: [
    {
      topic: "User Access and Security",
      bank: "interview",
      question: "What is the difference between profiles, permission sets, roles, and sharing rules?",
      keywords: ["profile", "permission set", "role", "sharing", "object", "record"],
      guide: "I explain them by access layer. A profile provides a user's baseline object, field, app, and system permissions. Permission sets add access without changing the profile. Roles primarily affect record visibility through the role hierarchy, while sharing rules open record access beyond the organization-wide default. I start with least privilege and use permission sets or permission set groups for scalable access.",
      coaching: "Do not describe roles as granting object permissions. Clearly separate object and field access from record-level access."
    },
    {
      topic: "User Access and Security",
      bank: "scenario",
      question: "Ten users work with Accounts. Nine users must see each other's records, but one user must see only their own records. How would you configure access?",
      keywords: ["owd", "private", "sharing rule", "public group", "role"],
      guide: "I would set Account organization-wide defaults to Private so ownership is the secure baseline. I would place the nine users in an appropriate public group or role structure and use an owner-based sharing rule to share their records with that group. I would keep the restricted user outside that sharing path, then test the design by logging in as both user personas.",
      coaching: "Check whether managers also need access through the role hierarchy and confirm related-object access."
    },
    {
      topic: "User Access and Security",
      bank: "scenario",
      question: "Two users have the same profile, but only one should access a custom object. How would you achieve this?",
      keywords: ["profile", "permission set", "least privilege", "custom object"],
      guide: "I would remove the custom-object permission from the shared profile if it is not required by both users, then assign a permission set containing the required object access only to the authorized user. This keeps the common profile restrictive and makes the exception explicit, reviewable, and easy to revoke.",
      coaching: "Profiles provide baseline access; permission sets are the preferred way to grant additional access."
    },
    {
      topic: "User Access and Security",
      bank: "scenario",
      question: "An employee leaves the company. Should you delete, freeze, or deactivate the Salesforce user?",
      keywords: ["freeze", "deactivate", "user", "records", "ownership"],
      guide: "Salesforce users are normally not deleted because their ownership and audit history must be preserved. If access must stop immediately, I would freeze the user first. Then I would transfer records and responsibilities, remove integrations or scheduled jobs, and deactivate the user after dependencies are resolved.",
      coaching: "Mention record ownership, scheduled jobs, integrations, and license recovery."
    },
    {
      topic: "Data Modeling and Relationships",
      bank: "interview",
      question: "Compare Lookup and Master-Detail relationships and explain when you would use each.",
      keywords: ["lookup", "master-detail", "ownership", "sharing", "roll-up", "cascade"],
      guide: "I use Lookup when the child can exist independently and needs its own owner and sharing behavior. I use Master-Detail when the child depends on the parent: ownership and sharing are inherited, deleting the parent can delete child records, and native roll-up summary fields are available. I choose based on lifecycle, security, reporting, and deletion requirements rather than only reporting convenience.",
      coaching: "Include ownership, sharing inheritance, required relationship behavior, cascade delete, and roll-up summaries."
    },
    {
      topic: "Data Modeling and Relationships",
      bank: "interview",
      question: "What is a junction object, and what business problem does it solve?",
      keywords: ["junction", "many-to-many", "master-detail", "relationship"],
      guide: "A junction object resolves a many-to-many relationship by acting as the child of two parent objects, usually through two Master-Detail relationships. For example, a Course Enrollment object can connect many Students to many Courses while also storing relationship-specific data such as enrollment date and status.",
      coaching: "Use a concrete many-to-many example and explain why the relationship itself needs fields."
    },
    {
      topic: "Data Modeling and Relationships",
      bank: "scenario",
      question: "How would you calculate a roll-up value when the child uses a Lookup relationship?",
      keywords: ["lookup", "roll-up", "flow", "apex", "aggregate"],
      guide: "Native roll-up summary fields require Master-Detail, so for a Lookup relationship I would first confirm that converting the relationship is appropriate. If it is not, I would use a record-triggered Flow for manageable requirements or bulkified Apex for complex or high-volume logic. The solution must handle insert, update, delete, undelete, and parent reassignment, followed by reconciliation testing.",
      coaching: "A correct solution handles every operation that can change the aggregate, not only insert."
    },
    {
      topic: "Forms, Validation, and User Experience",
      bank: "interview",
      question: "What are the different ways to make a Salesforce field required?",
      keywords: ["field", "required", "page layout", "validation rule", "dynamic forms"],
      guide: "A field can be required at the field-definition level, on a page layout, through Dynamic Forms visibility and requirement rules, or through a validation rule. I choose field-level required only when every creation path must supply the value. For conditional or process-specific requirements, I prefer a validation rule because it also protects API and import operations.",
      coaching: "Explain that page-layout requirements do not protect every data-entry channel."
    },
    {
      topic: "Forms, Validation, and User Experience",
      bank: "scenario",
      question: "A new field must be required only when new records are created, not when old records are updated. How would you implement it?",
      keywords: ["validation rule", "isnew", "blank", "required"],
      guide: "I would use a validation rule that combines ISNEW() with an empty-value check, for example AND(ISNEW(), ISBLANK(New_Field__c)). I would test creation from the UI, imports, and integrations, and confirm that updates to legacy records are not blocked.",
      coaching: "Use ISNEW() for create-only validation and test non-UI entry paths."
    },
    {
      topic: "Forms, Validation, and User Experience",
      bank: "scenario",
      question: "How would you ensure an Opportunity cannot be marked Closed Won unless it has at least one product?",
      keywords: ["opportunity", "product", "validation", "closed won"],
      guide: "I would first check whether a standard or declarative solution can expose product count for validation. A common design is to maintain a count or indicator using Flow or Apex and use a validation rule when StageName becomes Closed Won and the count is zero. I would test stage changes, product removal, imports, and integrations so the rule cannot be bypassed unintentionally.",
      coaching: "A validation rule cannot directly query OpportunityLineItem records; the design needs an available indicator."
    },
    {
      topic: "Flow Automation",
      bank: "interview",
      question: "When would you choose Flow instead of Apex Trigger?",
      keywords: ["flow", "apex", "complexity", "volume", "maintainability"],
      guide: "I choose Flow for maintainable declarative automation when the logic and expected volume fit Flow capabilities. I choose Apex when requirements need complex transaction control, advanced data structures, reusable coded services, or performance behavior that Flow cannot meet safely. In either case, I evaluate limits, error handling, testability, ownership, and the existing automation architecture.",
      coaching: "Avoid saying Flow is always for simple work and Apex is always better; explain decision criteria."
    },
    {
      topic: "Flow Automation",
      bank: "scenario",
      question: "When an Opportunity becomes Closed Won, find a matching Branch record by Location and email the correct branch. How would you design the Flow?",
      keywords: ["record-triggered flow", "closed won", "location", "email", "fault"],
      guide: "I would build an after-save record-triggered Flow that runs only when the Opportunity changes to Closed Won. It would get the matching Branch Details record using the Location value, validate that exactly one active match and email address exist, then send a templated email containing the branch, opportunity, and owner details. I would add fault handling and test no-match, duplicate-match, and re-update scenarios.",
      coaching: "Use an entry condition that detects the transition to Closed Won so emails are not sent repeatedly."
    },
    {
      topic: "Flow Automation",
      bank: "scenario",
      question: "A Case remains New for 7 days and requires an email; after 14 days it must be escalated. How would you automate it?",
      keywords: ["scheduled path", "case", "escalation", "email", "status"],
      guide: "I would use a record-triggered Flow with scheduled paths at 7 and 14 days from the relevant start time, or standard escalation rules if the support process fits them. Each path would confirm the Case is still New before acting. The 7-day path sends the reminder, and the 14-day path changes ownership or priority and notifies both owners, with fault monitoring and SLA reporting.",
      coaching: "Scheduled actions must re-check current status because the Case may have changed before execution."
    },
    {
      topic: "Data Management and Quality",
      bank: "interview",
      question: "Compare Data Import Wizard and Data Loader.",
      keywords: ["data import wizard", "data loader", "volume", "export", "delete"],
      guide: "I use Data Import Wizard for guided imports of supported common objects and smaller data sets, especially when duplicate handling is useful. I use Data Loader for larger volumes, more objects, command-line automation, exports, and operations such as hard delete when authorized. Before either tool, I back up data, test a sample, review automation impact, and reconcile results.",
      coaching: "Tool choice depends on object support, volume, operation type, repeatability, and governance."
    },
    {
      topic: "Data Management and Quality",
      bank: "scenario",
      question: "How would you prevent duplicate Leads submitted through Web-to-Lead?",
      keywords: ["matching rule", "duplicate rule", "web-to-lead", "email"],
      guide: "I would define the business duplicate criteria, commonly normalized email plus other identifying fields, then configure matching and duplicate rules that apply to Lead creation. Because Web-to-Lead behavior and business tolerance can vary, I would test whether records should be blocked, alerted, or routed for review, and monitor false positives before tightening the rule.",
      coaching: "Explain the matching criteria, action, testing, and exception process."
    },
    {
      topic: "Reports and Dashboards",
      bank: "interview",
      question: "What controls the records and data a user can see in a report or dashboard?",
      keywords: ["report", "dashboard", "sharing", "field-level security", "running user"],
      guide: "Report results depend on the report type, filters, object permissions, field-level security, and the user's record access. Dashboard visibility also depends on the running-user model: a static dashboard runs as a specified user, while a dynamic dashboard runs as the logged-in viewer. I validate both source records and the intended user persona when troubleshooting.",
      coaching: "Separate report configuration from security and explain dashboard running-user behavior."
    },
    {
      topic: "Reports and Dashboards",
      bank: "scenario",
      question: "A user created a report but cannot add a chart. What would you investigate?",
      keywords: ["report", "chart", "grouping", "summary", "format"],
      guide: "I would first check the report format and whether it contains a grouping or summary suitable for a chart. A tabular report without a row limit generally cannot provide the required chart structure. I would also check permissions and report-folder access, then reproduce the issue as the user and verify the corrected report.",
      coaching: "Start with report structure before assuming it is a permission problem."
    },
    {
      topic: "Service Cloud Administration",
      bank: "interview",
      question: "Explain how Email-to-Case works and what happens when a customer sends an email.",
      keywords: ["email-to-case", "case", "threading", "routing", "attachment"],
      guide: "Email-to-Case converts inbound customer emails into Case records and can preserve the message and attachments. Salesforce uses routing addresses and threading information to associate replies with the correct Case. I would configure assignment, auto-response, queues, security, and limits, then test new messages, replies, attachments, and failure handling.",
      coaching: "Mention routing, case creation, threading, assignment, auto-response, and operational monitoring."
    },
    {
      topic: "Sales Cloud Administration",
      bank: "scenario",
      question: "When Opportunity Amount exceeds one million, automatically add the Account Owner to the Opportunity Team. How would you solve it?",
      keywords: ["opportunity", "team", "account owner", "flow", "duplicate"],
      guide: "I would use an after-save record-triggered Flow that runs when Amount crosses the threshold. It would confirm the Account Owner is not already on the Opportunity Team, then create the correct team-member record with the approved role and access level. I would also define what should happen if the amount later drops below the threshold and test bulk updates.",
      coaching: "Prevent duplicate team members and clarify removal behavior before implementation."
    },
    {
      topic: "Sales Cloud Administration",
      bank: "scenario",
      question: "How would you maintain the total Opportunity amount and Opportunity count on Account?",
      keywords: ["account", "opportunity", "aggregate", "flow", "apex"],
      guide: "Because Account and Opportunity use a Lookup relationship, I would choose a record-triggered Flow for moderate, straightforward requirements or bulkified Apex for complex and high-volume processing. The automation must recalculate after insert, update, delete, undelete, and Account reassignment. I would use aggregate queries where appropriate and reconcile totals with a report.",
      coaching: "The answer must cover every event that can change the aggregate and must be bulk-safe."
    },
    {
      topic: "Integrations, AppExchange, and Connected Apps",
      bank: "interview",
      question: "What is the difference between Remote Site Settings, Named Credentials, and Connected Apps?",
      keywords: ["remote site", "named credential", "connected app", "oauth", "authentication"],
      guide: "Remote Site Settings allow outbound callouts to an endpoint but do not manage authentication. Named Credentials centralize the endpoint and authentication details used by Salesforce callouts, reducing secret handling in code. Connected Apps define how an external application authenticates to Salesforce using protocols such as OAuth. I choose the feature based on call direction and identity requirements.",
      coaching: "Clearly distinguish Salesforce calling out from an external application connecting into Salesforce."
    },
    {
      topic: "Release Management and DevOps for Admins",
      bank: "interview",
      question: "How do you handle Salesforce upgrades and seasonal releases?",
      keywords: ["release notes", "sandbox preview", "regression", "critical updates"],
      guide: "I track release notes and trust notifications, identify changes relevant to our features, and use a sandbox preview to run focused regression tests. I review critical updates, integrations, automation, and user experience changes with owners, document remediation, communicate impact, and perform post-release verification in production.",
      coaching: "A strong answer includes impact assessment, preview testing, ownership, communication, and verification."
    },
    {
      topic: "Workplace Admin and Continuous Growth",
      bank: "scenario",
      question: "Three business analysts give you urgent tasks due by end of day. How would you handle the conflict?",
      keywords: ["priority", "impact", "stakeholder", "estimate", "communicate"],
      guide: "I would clarify each task's business impact, deadline reason, dependencies, risk, and effort rather than silently choosing one. I would provide realistic estimates, raise the conflict to the appropriate product owner or manager for prioritization, agree on the delivery order, and communicate status early. I would not bypass testing or security controls simply because every request is labelled urgent.",
      coaching: "Show transparent prioritization, escalation, and expectation management."
    }
  ],
  roles: {
    "Salesforce Developer": [
      {
        question: "How would you write a bulk-safe trigger that updates Account with the total amount of related Opportunities?",
        keywords: ["bulk", "set", "map", "aggregate", "trigger", "delete"],
        guide: "I would keep the trigger thin and pass the affected Account IDs to a handler. I would collect IDs from new and old records so reassignment and deletion are covered, run one aggregate SOQL query grouped by AccountId, initialize missing totals to zero, and perform one Account update. I would add recursion protection only if the design requires it and test bulk insert, update, delete, undelete, and reparenting."
      },
      {
        question: "Compare Future, Queueable, Batch, and Scheduled Apex.",
        keywords: ["future", "queueable", "batch", "scheduled", "asynchronous"],
        guide: "I use Future mainly for simple legacy asynchronous work, but Queueable is generally preferred because it supports complex types, job IDs, and chaining. Batch Apex processes very large data sets in chunks using start, execute, and finish. Scheduled Apex starts work at a defined time. I choose based on volume, orchestration, monitoring, callouts, and transaction limits."
      },
      {
        question: "In Batch Apex, some records fail but successful records must still commit. How would you design it?",
        keywords: ["batch", "database.update", "allornone", "save result", "finish"],
        guide: "Inside execute, I would use Database.update(records, false) or the appropriate Database method with allOrNone set to false. I would inspect each SaveResult, capture record-level errors, and maintain summary counts, using Database.Stateful only when cross-batch state is justified. In finish, I would send or persist a summary with processed and failed records."
      },
      {
        question: "What are Salesforce trigger best practices?",
        keywords: ["one trigger", "bulk", "soql", "dml", "handler", "context"],
        guide: "I use one trigger per object, keep logic in handler or service classes, bulkify with collections, and never place SOQL or DML inside loops. I use context variables deliberately, prevent recursion through sound design, handle all required events, respect sharing and security where applicable, and write tests for bulk, negative, and permission-sensitive scenarios."
      },
      {
        question: "Explain parent-to-child and child-to-parent SOQL queries.",
        keywords: ["soql", "relationship", "subquery", "parent", "child"],
        guide: "For child-to-parent, I traverse the parent relationship with dot notation, such as selecting Account.Name from Contact. For parent-to-child, I use a relationship subquery, such as selecting Name and a Contacts subquery from Account. I use the relationship API name, especially for custom relationships, and keep query selectivity and limits in mind."
      },
      {
        question: "What is the difference between SOQL and SOSL?",
        keywords: ["soql", "sosl", "objects", "search", "fields"],
        guide: "SOQL retrieves records from specific objects using structured filters and relationships, so I use it when I know where the data lives. SOSL searches text across multiple objects and fields, so I use it for global-search-style requirements where the target object may be unknown. I choose based on data location, search behavior, and result needs."
      },
      {
        question: "Explain LWC decorators and modern reactivity.",
        keywords: ["api", "wire", "track", "reactive", "lwc"],
        guide: "@api exposes a public property or method to a parent component. @wire provisions reactive Salesforce data or Apex results. Fields are reactive by default when assigned a new value; @track is mainly needed when observing mutations inside plain objects or arrays rather than replacing the reference. I prefer immutable updates because they are easier to reason about."
      },
      {
        question: "How do Lightning Web Components communicate with each other?",
        keywords: ["api", "custom event", "lightning message service", "parent", "child"],
        guide: "A parent passes data or calls public methods on a child through @api. A child communicates upward by dispatching a CustomEvent. Components without a direct DOM relationship can use Lightning Message Service when they need cross-DOM communication. I keep event contracts small, documented, and aligned to component ownership."
      },
      {
        question: "Compare wired Apex and imperative Apex calls in LWC.",
        keywords: ["wire", "imperative", "cacheable", "control", "mutation"],
        guide: "I use @wire for reactive, cacheable read operations where parameters drive automatic provisioning. I use imperative Apex when execution must happen on demand, when I need explicit promise handling, or when the operation changes data. Methods wired to Apex must be cacheable=true, and I refresh or invalidate data deliberately after mutations."
      },
      {
        question: "What are important Apex test-class best practices?",
        keywords: ["testsetup", "assert", "starttest", "stoptest", "seealldata"],
        guide: "I create isolated test data, normally avoid SeeAllData=true, use @testSetup for reusable records, and test positive, negative, bulk, and security-relevant paths. I wrap the action under test with Test.startTest and Test.stopTest when limits or asynchronous work matter, and I use meaningful assertions that verify outcomes rather than chasing coverage alone."
      }
    ],
    "Salesforce Consultant": [
      {
        question: "How do you gather requirements when a client describes only their business problem?",
        keywords: ["discovery", "process", "stakeholder", "acceptance criteria", "outcome"],
        guide: "I begin with the business outcome, users, current process, pain points, exceptions, data, controls, and measurable success criteria. I document the current and future process, validate assumptions with stakeholders, identify dependencies and risks, and convert the result into prioritized requirements with clear acceptance criteria before solution design."
      },
      {
        question: "A team lead describes a client requirement incorrectly during a meeting. What would you do?",
        keywords: ["clarify", "client", "respect", "document", "confirm"],
        guide: "I would avoid creating conflict in the meeting. I would ask a neutral clarification question tied to the documented requirement, then speak with the team lead privately if needed. After alignment, I would send a concise written confirmation to the client and team so the approved requirement and next actions are unambiguous."
      }
    ],
    "Salesforce Architect": [
      {
        question: "How do you choose between Flow and Apex for an enterprise automation requirement?",
        keywords: ["flow", "apex", "volume", "transaction", "governance"],
        guide: "I evaluate transaction volume, complexity, order of execution, error handling, integration needs, testability, maintainability, and team ownership. I use Flow where declarative automation remains clear and supportable, and Apex where complex orchestration or performance requires code. I also define automation ownership so multiple tools do not create conflicting behavior."
      },
      {
        question: "How would you design an integration between Salesforce and an external accounting platform?",
        keywords: ["system of record", "api", "oauth", "retry", "monitoring"],
        guide: "I would define system ownership for each data domain, direction, latency, volume, identity, and reconciliation requirements first. Then I would select the integration pattern and API, secure it with OAuth and Named Credentials where applicable, design idempotency and retry behavior, and add monitoring, error queues, reconciliation, and operational ownership."
      }
    ]
  }
};
