window.TomCodexDeveloperInterviewTopics = [
  {
    title: "Apex Runtime and Governor Limits",
    description: "Multitenancy, transactions, execution contexts, limits, and choosing Apex appropriately.",
    questions: [
      ["What are governor limits, and why do they exist?", ["governor limits", "multitenant", "transaction", "resources"], "Governor limits protect shared multitenant resources by limiting operations such as SOQL, DML, CPU time, and heap per transaction. I design code to process collections, use selective queries, and choose asynchronous work only when it fits the requirement.", 8],
      ["What is an Apex transaction?", ["transaction", "commit", "rollback", "limits"], "An Apex transaction is a single unit of work in which operations share governor limits and either commit together or roll back when an unhandled failure occurs. I consider transaction boundaries when designing automation, callouts, asynchronous jobs, and error handling.", 1],
      ["When should Apex be used instead of Flow?", ["apex", "flow", "complexity", "performance"], "I use Apex when requirements need complex data structures, high-volume performance, granular transaction control, sophisticated error handling, or reusable coded services. For moderate logic, Flow can orchestrate focused Invocable Apex while remaining maintainable.", 1]
    ]
  },
  {
    title: "Apex Language and Collections",
    description: "Core language concepts, object-oriented design, collections, and exception handling.",
    questions: [
      ["When would you use a List, Set, or Map in Apex?", ["list", "set", "map", "collection"], "I use a List for ordered values that may repeat, a Set for unique values such as IDs, and a Map for fast key-based lookup. In bulk Apex, Maps commonly connect queried records to trigger records without nested loops.", 1],
      ["What is the difference between static and instance methods?", ["static", "instance", "object", "state"], "A static method belongs to the class and does not require an instance, while an instance method works with the state of a specific object. I use static utility methods carefully and prefer instance-based services when state or dependency injection improves design and testing.", 1],
      ["How should exceptions be handled in Apex?", ["exception", "catch", "logging", "user"], "I catch exceptions only where I can add context, recover, or translate them into a meaningful outcome. I avoid silently swallowing failures, log useful diagnostic information without sensitive data, and return actionable messages while preserving transaction correctness.", 1]
    ]
  },
  {
    title: "SOQL, SOSL, and Data Access",
    description: "Efficient queries, search, relationships, aggregates, and selectivity.",
    questions: [
      ["What is the difference between SOQL and SOSL?", ["soql", "sosl", "query", "search"], "SOQL retrieves structured records from known objects using filters and relationships. SOSL performs text search across multiple objects and fields. I use SOQL when the data location is known and SOSL for global-search-style requirements.", 1],
      ["Explain parent-to-child and child-to-parent relationship queries.", ["relationship query", "parent", "child", "subquery"], "A child-to-parent query uses dot notation, such as Contact.Account.Name. A parent-to-child query uses a relationship subquery, such as selecting Accounts with their Contacts. For custom relationships, I use the correct relationship API name.", 1],
      ["Why is query selectivity important?", ["selective", "index", "query plan", "volume"], "Selective queries reduce the records Salesforce must scan and become critical at high data volume. I filter on suitable indexed fields, avoid leading-wildcard searches where possible, use the Query Plan tool, and design data access around realistic volume.", 8]
    ]
  },
  {
    title: "DML and Transaction Control",
    description: "DML statements, Database methods, partial success, savepoints, and rollback.",
    questions: [
      ["What is the difference between DML statements and Database methods?", ["dml", "database", "allornone", "saveresult"], "DML statements are concise and throw an exception when an operation fails. Database methods can support partial success and return result objects with record-level errors. I select the behavior based on whether the business transaction must be atomic.", 1],
      ["When would you use a savepoint and rollback?", ["savepoint", "rollback", "transaction", "restore"], "I use a savepoint before a related set of operations when a later failure must restore the earlier database state. Rollback does not reverse external callouts or every non-database side effect, so I design the transaction and error handling deliberately.", 1],
      ["How do you process successful records when some DML records fail?", ["partial success", "database.update", "false", "saveresult"], "I use a Database method with allOrNone set to false, inspect every SaveResult, and capture failures for reporting or retry. I confirm partial success is acceptable because it changes the transaction's business behavior.", 1]
    ]
  },
  {
    title: "Triggers and Order of Execution",
    description: "Trigger contexts, handler patterns, recursion, and predictable automation.",
    questions: [
      ["What is the difference between before and after triggers?", ["before", "after", "trigger", "record id"], "I use before triggers to validate or change fields on records being saved without extra DML. I use after triggers when saved IDs or related-record operations are required. I choose the event based on the exact data and transaction requirement.", 3],
      ["What is a trigger handler pattern?", ["handler", "thin trigger", "logic", "test"], "A trigger handler keeps the trigger as a thin entry point and delegates logic to classes. It improves testability, reuse, and ordering while making bulk behavior easier to reason about. I avoid adding framework complexity that the org does not need.", 3],
      ["How do you prevent trigger recursion?", ["recursion", "idempotent", "change detection", "static"], "I first make logic idempotent and run only when relevant fields change. I avoid unnecessary DML and coordinate automation ownership. Static guards can help in specific designs, but a simple Boolean can incorrectly skip later chunks or valid operations.", 3]
    ]
  },
  {
    title: "Bulkification and Performance",
    description: "Collection-based processing, limits, large data volume, and efficient code.",
    questions: [
      ["What does bulkification mean in Apex?", ["bulkification", "collections", "trigger.new", "limits"], "Bulkification means designing code to process every record in the transaction as a collection rather than assuming one record. I collect IDs, query once, use Maps for lookup, and perform DML on lists so the same code handles UI, import, API, and batch operations.", 1],
      ["Why must SOQL and DML stay outside loops?", ["soql", "dml", "loop", "governor limit"], "Queries and DML inside loops consume limits once per iteration and fail quickly with bulk input. I collect the required keys first, query in bulk, prepare changes in memory, and perform as few DML operations as practical.", 1],
      ["How would you optimize Apex for large data volumes?", ["large data volume", "selective", "batch", "locking"], "I use selective queries, process only needed fields and records, choose appropriate asynchronous patterns, avoid skew and lock contention, and monitor CPU and heap. I validate the design with production-like volume rather than relying only on small unit tests.", 8]
    ]
  },
  {
    title: "Apex Testing",
    description: "Reliable test data, assertions, bulk tests, mocks, and deployment confidence.",
    questions: [
      ["What are important Apex test-class best practices?", ["test data", "assert", "bulk", "seealldata"], "I create isolated test data, avoid SeeAllData=true, test positive, negative, bulk, and permission-sensitive paths, and use meaningful assertions. Coverage is a deployment requirement, but behavior and regression protection are the real goals.", 1],
      ["What do Test.startTest and Test.stopTest do?", ["starttest", "stoptest", "limits", "async"], "Test.startTest creates a fresh governor-limit context for the action under test. Test.stopTest causes queued asynchronous work to execute before assertions. I place only the behavior being measured inside that boundary.", 1],
      ["How are HTTP callouts tested in Apex?", ["httpcalloutmock", "mock", "response", "test"], "Apex tests do not call live external services. I use HttpCalloutMock to return controlled success, error, timeout-like, and malformed responses, then assert how the integration service handles each outcome.", 5]
    ]
  },
  {
    title: "Asynchronous Apex",
    description: "Future, Queueable, Batch, Scheduled Apex, monitoring, and failure handling.",
    questions: [
      ["Compare Future, Queueable, Batch, and Scheduled Apex.", ["future", "queueable", "batch", "scheduled"], "Queueable is generally preferred for manageable asynchronous jobs because it supports complex types, monitoring, and chaining. Batch processes very large data sets in chunks. Scheduled Apex starts work at a defined time. Future remains useful mainly for simpler legacy use cases.", 1],
      ["When should Batch Apex be used?", ["batch apex", "start", "execute", "finish"], "I use Batch Apex when a data set is too large for one transaction or must be processed in manageable chunks. I design start, execute, and finish around selective data access, partial failures, monitoring, and idempotent retry behavior.", 1],
      ["What does Database.Stateful do in Batch Apex?", ["database.stateful", "batch", "state", "serialize"], "Database.Stateful preserves instance-member values between execute transactions, which can support summary counts or accumulated results. It adds serialization overhead, so I use it only when cross-chunk state is genuinely required.", 1]
    ]
  },
  {
    title: "Integrations and Callouts",
    description: "REST, SOAP, Named Credentials, OAuth, patterns, resilience, and testing.",
    questions: [
      ["Why should callouts use Named Credentials?", ["named credential", "endpoint", "authentication", "secret"], "Named Credentials centralize endpoint and authentication configuration so secrets are not hardcoded in Apex. They simplify secure callouts, credential rotation, and environment-specific configuration while supporting least-privilege access.", 5],
      ["How do you choose a Salesforce integration pattern?", ["integration pattern", "latency", "volume", "system of record"], "I clarify ownership, direction, latency, volume, consistency, and failure recovery first. Those requirements guide request-reply, fire-and-forget, batch synchronization, event-driven processing, remote call-in, or data virtualization.", 5],
      ["How do you make a callout integration resilient?", ["retry", "idempotency", "logging", "timeout"], "I define timeouts, idempotency, retry and backoff behavior, error categorization, monitoring, reconciliation, and operational ownership. I avoid blind retries that can duplicate transactions and test both provider and network failures.", 5]
    ]
  },
  {
    title: "Secure Apex",
    description: "Sharing, CRUD/FLS, user mode, injection prevention, and secure boundaries.",
    questions: [
      ["What does with sharing enforce?", ["with sharing", "record access", "crud", "fls"], "With sharing enforces the current user's record-sharing access, but it does not automatically enforce object or field permissions. I also enforce CRUD and FLS using appropriate user-mode operations or security checks.", 1],
      ["How do you prevent SOQL injection?", ["soql injection", "bind", "allowlist", "escape"], "I bind user values instead of concatenating them and allowlist any identifiers that cannot be bound, such as selected field names or sort directions. Escaping alone is not a complete substitute for binding and allowlisting.", 1],
      ["What are user-mode database operations?", ["user mode", "crud", "fls", "sharing"], "User-mode operations enforce the running user's object, field, and sharing access for that operation. They help developers build secure services, but I still design clear trust boundaries and test with restricted user personas.", 1]
    ]
  },
  {
    title: "Apex Architecture and Patterns",
    description: "Services, selectors, domains, dependency injection, logging, and maintainability.",
    questions: [
      ["Why separate service, selector, and trigger responsibilities?", ["service", "selector", "trigger", "separation"], "Separation gives each layer a clear responsibility: triggers coordinate events, selectors own queries, and services implement business use cases. This reduces duplication, improves testing, and helps teams change code without creating hidden coupling.", 1],
      ["What is dependency injection, and why is it useful in Apex?", ["dependency injection", "interface", "mock", "test"], "Dependency injection supplies a service's dependencies instead of constructing them internally. It makes behavior easier to replace in tests, reduces coupling, and clarifies contracts between application components.", 1],
      ["When should you use a trigger framework?", ["trigger framework", "automation density", "ordering", "governance"], "I use a trigger framework when the org has enough automation density and team scale to benefit from consistent ordering, bypass, and handler conventions. For a small solution, a clear thin trigger and handler may be more maintainable.", 3]
    ]
  },
  {
    title: "Lightning Web Components",
    description: "LWC reactivity, lifecycle, communication, Apex calls, security, and testing.",
    questions: [
      ["Explain @api, @wire, and @track in LWC.", ["api", "wire", "track", "reactivity"], "@api exposes public properties or methods. @wire provisions reactive Salesforce data or Apex results. Fields are reactive by default; @track is mainly needed when observing internal mutations of plain objects or arrays.", 4],
      ["How do Lightning Web Components communicate?", ["parent", "child", "custom event", "lightning message service"], "Parents pass data or invoke public methods through @api. Children communicate upward with CustomEvent. Unrelated components can use Lightning Message Service. I keep event and message contracts small and documented.", 4],
      ["Compare wired and imperative Apex calls in LWC.", ["wire", "imperative", "cacheable", "mutation"], "I use @wire for reactive cacheable reads and imperative calls when execution must be controlled or data changes. Wired Apex requires cacheable=true, and I refresh cached data deliberately after mutations.", 4]
    ]
  }
];

const developerTopicExpansion = {
  "Apex Runtime and Governor Limits": [
    ["Which governor limits do developers commonly monitor?", ["soql", "dml", "cpu", "heap"], "I commonly monitor SOQL and DML counts and rows, CPU time, heap, callouts, queueable jobs, and email usage. The important point is not memorizing every number; it is designing within the transaction context and measuring the limits relevant to the use case.", 8],
    ["How would you troubleshoot Apex CPU time limit exceeded?", ["cpu", "debug log", "recursion", "nested loop"], "I reproduce the transaction, inspect debug logs and timelines, then identify repeated automation, recursion, nested loops, inefficient queries, or managed-package work. I reduce unnecessary processing and retest with realistic bulk volume.", 7],
    ["How do synchronous and asynchronous governor limits differ?", ["synchronous", "asynchronous", "limits", "transaction"], "Asynchronous transactions receive a separate execution context and some higher limits, but they also have their own restrictions and daily capacity. I choose async processing for a genuine business or performance reason, not merely to hide inefficient code.", 1],
    ["Can governor-limit exceptions be caught?", ["governor limit", "exception", "uncatchable", "design"], "Most hard governor-limit exceptions cannot be handled with try-catch once exceeded. I prevent them through bulk-safe design, limit-aware architecture, testing, and monitoring rather than relying on recovery after the limit is hit.", 8],
    ["What tools do you use to develop and debug Apex?", ["vscode", "salesforce cli", "debug log", "developer console"], "I use VS Code with Salesforce extensions and CLI for source-driven work, deployments, and tests. I use debug logs, Replay Debugger, Developer Console, and targeted logging for diagnosis, while keeping production logging controlled.", 7],
    ["What is Mixed DML, and how do you handle it?", ["mixed dml", "setup object", "user", "async"], "Mixed DML occurs when setup objects such as User are changed in the same transaction as non-setup business records. I separate the work into appropriate transactions, commonly through asynchronous processing, and test the complete workflow.", 1],
    ["What is the difference between a hard and soft Salesforce limit?", ["hard limit", "soft limit", "support", "capacity"], "A hard limit cannot normally be increased and requires a different design when reached. A soft or allocation-based limit may sometimes be adjusted or expanded. I confirm the current official limit and avoid designing a solution that depends on an exception.", 8]
  ],
  "Apex Language and Collections": [
    ["What are Apex access modifiers?", ["private", "public", "protected", "global"], "Private limits access to the declaring class, public exposes within the namespace, protected supports inheritance access, and global exposes beyond the namespace for supported contracts. I choose the narrowest access needed because public APIs are harder to change.", 1],
    ["What is an interface in Apex?", ["interface", "contract", "implementation", "dependency"], "An interface defines a contract without implementation. I use it to support interchangeable implementations, dependency injection, and test doubles, especially for integrations and services.", 1],
    ["What is a virtual or abstract class?", ["virtual", "abstract", "inheritance", "override"], "A virtual class can be extended and its virtual methods overridden. An abstract class cannot be instantiated and can require subclasses to implement abstract methods. I prefer composition unless inheritance clearly models the design.", 1],
    ["What is a wrapper class?", ["wrapper", "multiple values", "ui", "response"], "A wrapper class groups values or records that do not naturally belong in one sObject, such as a record plus selection state for a UI or a structured integration response. I keep wrappers focused and serializable when crossing boundaries.", 1],
    ["What does the transient keyword do?", ["transient", "view state", "serialize", "visualforce"], "Transient prevents a variable from being serialized into Visualforce view state. It is useful for values that can be recalculated and should not increase view-state size, but it is mostly relevant to Visualforce rather than LWC.", 1],
    ["How do custom exceptions improve Apex code?", ["custom exception", "meaningful", "catch", "contract"], "A custom exception gives a failure a clear domain meaning and helps callers distinguish expected business failures from unexpected technical errors. I use it when the caller can respond meaningfully and include useful context.", 1],
    ["What is polymorphism in Apex?", ["polymorphism", "interface", "override", "runtime"], "Polymorphism lets code work through a common interface or parent type while invoking the implementation appropriate to the runtime object. It reduces conditional logic and supports extensible, testable designs.", 1]
  ],
  "SOQL, SOSL, and Data Access": [
    ["What is dynamic SOQL, and when should you use it?", ["dynamic soql", "database.query", "runtime", "security"], "Dynamic SOQL builds a query at runtime when fields, filters, or objects genuinely vary. I prefer static SOQL when possible and use binds plus allowlists to control injection risk.", 1],
    ["What is Database.queryWithBinds?", ["querywithbinds", "bind", "dynamic soql", "security"], "Database.queryWithBinds supplies bind values separately from a dynamic query string. It makes dynamic queries easier to secure and manage, while identifiers such as field names still require allowlisting.", 2],
    ["What is an aggregate SOQL query?", ["aggregate", "count", "sum", "group by"], "Aggregate SOQL summarizes data using functions such as COUNT, SUM, MIN, MAX, and AVG, often with GROUP BY. I use it to let the database perform efficient calculations instead of loading every record into Apex.", 1],
    ["What is the Query Plan tool used for?", ["query plan", "selectivity", "cost", "index"], "The Query Plan tool helps evaluate possible query plans, relative cost, cardinality, and index use. I use it when high-volume queries are slow or at risk of becoming nonselective.", 8],
    ["How do you safely query large result sets?", ["query locator", "batch", "large result", "heap"], "I avoid loading unnecessary records into one transaction. Depending on the use case, I use selective pagination, SOQL for loops, or a Batch Apex QueryLocator, and select only required fields.", 1],
    ["What are semi-joins and anti-joins?", ["semi-join", "anti-join", "in", "not in"], "Semi-joins filter parent records based on matching child records, while anti-joins find parents without matching children. They can express relationship criteria efficiently without manual nested processing.", 1],
    ["What makes a SOQL query vulnerable to injection?", ["injection", "concatenation", "user input", "bind"], "A query becomes vulnerable when untrusted values or identifiers are concatenated into dynamic SOQL without controls. I bind values and allowlist identifiers or sort directions.", 2]
  ],
  "DML and Transaction Control": [
    ["What DML operations are available in Apex?", ["insert", "update", "upsert", "delete"], "Apex supports insert, update, upsert, delete, undelete, and merge for applicable records. I choose the operation based on lifecycle and matching needs and handle errors according to the business transaction.", 1],
    ["How does upsert work?", ["upsert", "external id", "insert", "update"], "Upsert inserts records without a match and updates records with a match, using the record ID or a specified external-ID field. It is useful for idempotent integrations and migrations when source identifiers are reliable.", 1],
    ["What does allOrNone control?", ["allornone", "partial success", "database", "transaction"], "allOrNone controls whether one record failure rolls back the full DML operation. False allows partial success and returns record-level results; true preserves atomic behavior.", 1],
    ["What is a DmlException?", ["dmlexception", "validation", "error", "record"], "DmlException is thrown when a DML statement fails. I use its methods to inspect details where appropriate, but I avoid exposing raw technical messages directly to users.", 1],
    ["When should partial success not be used?", ["partial success", "atomic", "consistency", "business"], "I avoid partial success when records form one business transaction and inconsistent completion would be harmful, such as creating a header without required detail records. The business outcome determines the transaction strategy.", 1],
    ["How does merge behave in Apex?", ["merge", "master record", "duplicates", "children"], "Merge combines supported duplicate records into a selected master and reparents appropriate related data. I assess field retention, automation, sharing, and audit requirements before using it.", 1],
    ["Can a rollback reverse a callout?", ["rollback", "callout", "external system", "compensation"], "No. Rollback affects Salesforce database work in the transaction, not an external system already called. For cross-system consistency, I design idempotency, compensation, reconciliation, or delayed callouts.", 5]
  ],
  "Triggers and Order of Execution": [
    ["What trigger context variables are commonly used?", ["trigger.new", "trigger.old", "newmap", "oldmap"], "I use Trigger.new and Trigger.newMap for current records, Trigger.old and Trigger.oldMap for prior values, and context flags such as isInsert or isUpdate to route behavior. Availability depends on the trigger event.", 3],
    ["What happens during an upsert trigger?", ["upsert", "insert", "update", "trigger"], "Upsert records follow insert or update trigger behavior depending on whether a match is found. The trigger must safely support both paths and should not assume the whole input uses one operation.", 3],
    ["What happens during merge trigger processing?", ["merge", "delete", "update", "trigger"], "Merge causes trigger activity on the records being removed and the surviving master record. I verify the current order-of-execution documentation and test merge explicitly because related records and automation can be affected.", 3],
    ["When should addError be used?", ["adderror", "validation", "trigger", "record"], "addError prevents a record or field from saving and returns a message to the caller. I use it for validations that require Apex and provide a clear corrective message.", 3],
    ["Can a trigger make a callout?", ["trigger", "callout", "queueable", "async"], "A trigger should not perform a synchronous callout in the save transaction. I enqueue a suitable asynchronous process, pass only needed context, and design retry and monitoring behavior.", 1],
    ["Why prefer one trigger per object?", ["one trigger", "order", "handler", "maintainability"], "Multiple triggers on one object make execution order difficult to control. A single entry point with organized handlers gives the team predictable orchestration and clearer governance.", 3],
    ["How do you test order-of-execution interactions?", ["order of execution", "flow", "trigger", "regression"], "I create tests and integration scenarios covering the combined behavior of validation, Flow, triggers, and related automation. I assert the final business outcome and check recursion or duplicate action risks.", 3]
  ],
  "Bulkification and Performance": [
    ["How do Maps improve bulk processing?", ["map", "id", "lookup", "nested loop"], "Maps provide fast key-based lookup and help connect queried records to input records without repeated scans or nested loops. They are central to bulk-safe relationship processing.", 1],
    ["What is data skew from a developer perspective?", ["data skew", "locking", "sharing", "parent"], "Data skew places too many records under one owner or parent and can increase lock contention and sharing work. I account for it in data modeling, integration loads, and high-volume processing.", 8],
    ["How do you diagnose row-lock errors?", ["unable to lock row", "concurrency", "parent", "ordering"], "I identify which records or parents competing transactions share, then reduce contention by ordering work consistently, shrinking transactions, distributing ownership, or serializing the conflicting process where appropriate.", 8],
    ["Why are nested loops risky?", ["nested loop", "cpu", "map", "performance"], "Nested loops can create quadratic processing and quickly consume CPU at volume. I replace relationship matching loops with Maps or Sets and measure the actual transaction.", 8],
    ["What are Limits methods used for?", ["limits", "getqueries", "cpu", "monitor"], "The Limits class exposes current consumption and maximums for many transaction limits. I use it for targeted diagnostics and observability, not as a substitute for efficient design.", 1],
    ["How should fields be selected in SOQL?", ["fields", "heap", "query", "performance"], "I select only fields required by the use case. Pulling unnecessary fields increases heap, serialization, and maintenance costs, especially in large queries and integrations.", 8],
    ["How do you test bulk performance?", ["bulk test", "200 records", "limits", "assert"], "I run tests with realistic collections, including 200-record trigger batches, varied relationships, and failure cases. I assert outcomes and confirm that query, DML, and CPU consumption stay safe.", 8]
  ],
  "Apex Testing": [
    ["Why is code coverage alone insufficient?", ["coverage", "assertion", "behavior", "regression"], "Coverage only proves lines executed. Strong tests assert business outcomes, negative behavior, bulk safety, permissions, and side effects so regressions are detected.", 1],
    ["What is @testSetup used for?", ["testsetup", "test data", "reuse", "isolation"], "@testSetup creates shared baseline data before each test method's isolated execution. It reduces duplication while each test still receives a clean copy of that data.", 1],
    ["How do you test asynchronous Apex?", ["async", "starttest", "stoptest", "assert"], "I enqueue the job between Test.startTest and Test.stopTest, which causes supported asynchronous work to run before assertions. I then verify records, status, or published outcomes.", 1],
    ["When is SeeAllData=true acceptable?", ["seealldata", "isolation", "org data", "test"], "It should be rare because tests become dependent on changing org data. I prefer creating required data or using appropriate metadata and mocks, and document any unavoidable exception.", 1],
    ["What is a test-data factory?", ["test data factory", "reuse", "defaults", "test"], "A test-data factory creates valid, reusable test records while allowing each test to override meaningful fields. It reduces noise without hiding the scenario being tested.", 1],
    ["How do you test security behavior?", ["runas", "permission", "sharing", "security"], "I create users with representative access, use System.runAs where appropriate, and assert permitted and denied outcomes. I remember runAs helps with sharing context but does not magically prove every CRUD/FLS path.", 1],
    ["What are meaningful Apex assertions?", ["assert", "expected", "outcome", "message"], "Meaningful assertions compare the expected business result with actual records, errors, events, or calls and include useful failure messages. I avoid assertions that merely confirm code ran.", 1]
  ],
  "Asynchronous Apex": [
    ["What advantages does Queueable have over Future?", ["queueable", "future", "job id", "complex type"], "Queueable supports complex member data, returns a job ID, supports chaining, and is easier to monitor. I generally choose it over Future unless maintaining a simple legacy implementation.", 9],
    ["How do you chain Queueable jobs safely?", ["queueable", "chain", "job", "failure"], "I enqueue the next job only when the current unit succeeds and keep each job focused and idempotent. I monitor chain failures and avoid unbounded or opaque orchestration.", 9],
    ["What are Batch Apex start, execute, and finish methods?", ["start", "execute", "finish", "batch"], "Start identifies the scope, execute processes each chunk in a separate transaction, and finish performs final reporting or follow-up. I keep each phase selective, observable, and retry-safe.", 1],
    ["How do you monitor asynchronous jobs?", ["asyncapexjob", "monitor", "failure", "job id"], "I retain job IDs where useful, monitor AsyncApexJob and operational logs, and alert owners on failures. Monitoring must include business reconciliation, not just a Completed status.", 1],
    ["Can Batch Apex perform callouts?", ["batch", "callout", "allowscallouts", "integration"], "Yes, when the class implements Database.AllowsCallouts. I size scopes and design rate limits, retries, idempotency, and provider failure handling carefully.", 5],
    ["When should Scheduled Apex be used?", ["scheduled apex", "cron", "time", "job"], "I use Scheduled Apex to start processing at defined times when record-specific scheduled paths are not the right tool. The scheduled job often delegates substantial work to Queueable or Batch Apex.", 1],
    ["What are risks of launching async work from triggers?", ["trigger", "async", "limits", "transaction"], "Bulk trigger transactions can enqueue too many jobs, lose context, or make failures difficult to reconcile. I aggregate work, respect enqueue limits, and use a clear asynchronous architecture.", 1]
  ],
  "Integrations and Callouts": [
    ["What is a Connected App?", ["connected app", "oauth", "scope", "policy"], "A Connected App defines how an external client authenticates or integrates with Salesforce using standards such as OAuth. I restrict scopes, users, policies, and certificate handling according to least privilege.", 5],
    ["What is OAuth?", ["oauth", "authorization", "token", "scope"], "OAuth is an authorization framework that lets a client obtain scoped access tokens without receiving the user's password. I choose the OAuth flow based on client type, trust, and whether a user is present.", 5],
    ["What is the JWT bearer flow used for?", ["jwt", "bearer", "certificate", "server"], "JWT bearer flow supports server-to-server authentication using a signed assertion and certificate without an interactive login. I protect the private key and restrict the integration user's access.", 5],
    ["Compare REST and SOAP APIs.", ["rest", "soap", "json", "wsdl"], "REST is resource-oriented and commonly uses JSON, while SOAP uses a formal XML and WSDL contract. I choose based on consumer capability, contract requirements, payload, and operations.", 5],
    ["What is Change Data Capture?", ["change data capture", "event", "record change", "subscriber"], "CDC publishes selected Salesforce record changes for subscribers. I use it when downstream systems need near-real-time change propagation without custom trigger publishing.", 5],
    ["What are composite REST resources?", ["composite api", "requests", "transaction", "round trip"], "Composite resources combine related API operations into fewer network round trips and can coordinate references between requests. I choose the appropriate composite resource and understand its transaction behavior.", 5],
    ["How do you protect integration credentials?", ["credential", "secret", "named credential", "rotation"], "I keep secrets out of code and source control, use Named and External Credentials or a secure secret manager, restrict access, rotate credentials, and monitor usage.", 6]
  ],
  "Secure Apex": [
    ["Compare with sharing, without sharing, and inherited sharing.", ["with sharing", "without sharing", "inherited sharing", "record access"], "With sharing enforces record sharing, without sharing deliberately runs without it, and inherited sharing makes the caller's sharing behavior explicit. I choose deliberately and still enforce CRUD and FLS.", 1],
    ["What does Security.stripInaccessible do?", ["stripinaccessible", "crud", "fls", "sanitize"], "stripInaccessible removes fields the user cannot access from sObjects and returns information about removed fields. It is useful for sanitizing records while allowing controlled handling.", 1],
    ["What is WITH USER_MODE in SOQL?", ["user mode", "soql", "crud", "fls"], "A user-mode query enforces the running user's object, field, and sharing permissions for the query. I use it when the service should respect user access and handle access failures appropriately.", 1],
    ["Why can Apex run insecurely by default?", ["system mode", "crud", "fls", "sharing"], "Apex commonly runs in system context, so developers must deliberately enforce the required sharing and object or field permissions. I define the trust boundary before implementing data access.", 1],
    ["How do you secure an @AuraEnabled Apex method?", ["auraenabled", "security", "input", "access"], "I enforce access, validate and constrain inputs, avoid exposing unnecessary data, use appropriate sharing, and return safe error messages. Client-side checks are never the security boundary.", 4],
    ["What is SOQL injection?", ["soql injection", "dynamic", "untrusted", "query"], "SOQL injection occurs when untrusted input changes the structure of a dynamic query. Binding values and allowlisting identifiers prevents the input from becoming query logic.", 2],
    ["How do you avoid exposing sensitive information in errors?", ["error", "sensitive", "logging", "user message"], "I return a safe, actionable user message and log restricted technical context for authorized support. I do not expose tokens, queries, credentials, or sensitive record data.", 1]
  ],
  "Apex Architecture and Patterns": [
    ["What belongs in a service layer?", ["service layer", "use case", "transaction", "business logic"], "A service layer exposes application use cases and coordinates domain logic, data access, and integrations. It gives callers a stable boundary and keeps business operations out of controllers and triggers.", 1],
    ["What belongs in a selector class?", ["selector", "soql", "fields", "query"], "A selector centralizes reusable data-access logic and field selection. It improves consistency and testability, but I avoid creating abstraction that merely hides one trivial query.", 1],
    ["What is a domain layer?", ["domain", "record", "business behavior", "validation"], "A domain layer groups business behavior related to an object or aggregate, such as validations and state transitions. It helps keep record behavior consistent across entry points.", 1],
    ["How should application logging be designed?", ["logging", "correlation", "severity", "monitoring"], "I capture structured context, severity, correlation IDs, and ownership without sensitive data. Logs should support alerting and diagnosis and have a retention and review process.", 1],
    ["What makes an Apex API maintainable?", ["api", "contract", "version", "error"], "A maintainable API has a focused contract, stable inputs and outputs, clear security, documented errors, and versioning or compatibility planning. I avoid exposing internal implementation details.", 1],
    ["How do custom metadata types support architecture?", ["custom metadata", "configuration", "deploy", "behavior"], "Custom metadata stores deployable configuration that code and automation can read. It supports configurable behavior without hardcoding and should still be validated and governed.", 1],
    ["How do you decide whether to introduce an abstraction?", ["abstraction", "duplication", "complexity", "maintainability"], "I add an abstraction when it removes meaningful duplication, establishes a stable boundary, or supports testability and change. I avoid patterns that add ceremony without reducing actual risk.", 1]
  ],
  "Lightning Web Components": [
    ["What are LWC lifecycle hooks?", ["constructor", "connectedcallback", "renderedcallback", "disconnectedcallback"], "The lifecycle includes construction, connection, rendering, rendered callbacks, disconnection, and error handling. I place setup and cleanup in the appropriate hook and avoid state-changing loops in renderedCallback.", 4],
    ["What is the difference between connectedCallback and renderedCallback?", ["connectedcallback", "renderedcallback", "setup", "render"], "connectedCallback runs when the component is inserted into the DOM and is useful for setup or subscriptions. renderedCallback runs after rendering and can run repeatedly, so I guard one-time work.", 4],
    ["How does a child send data to a parent?", ["custom event", "dispatch", "detail", "parent"], "The child dispatches a CustomEvent with a small, intentional detail payload, and the parent handles it declaratively. I avoid leaking mutable internal objects through the event.", 4],
    ["What is Lightning Message Service?", ["lightning message service", "message channel", "publish", "subscribe"], "LMS enables communication across components that do not share a direct parent-child relationship, including supported Aura and Visualforce contexts. I subscribe and unsubscribe correctly.", 4],
    ["Why use Lightning Data Service?", ["lightning data service", "cache", "security", "record"], "LDS provides shared record caching and respects sharing, CRUD, and FLS through UI API. I prefer it for standard record operations before writing custom Apex.", 4],
    ["How do you refresh wired data?", ["refreshapex", "wire", "cache", "update"], "For wired Apex, I retain the wired result and use refreshApex after relevant mutations. For LDS data, I use the appropriate record-update notification or API behavior.", 4],
    ["How do you test an LWC?", ["jest", "mock", "dom", "event"], "I use Jest to test rendering, user interactions, events, and error states while mocking wire adapters, Apex, navigation, and messaging. Tests should prove behavior rather than implementation details.", 4]
  ]
};

window.TomCodexDeveloperInterviewTopics.forEach((topic) => {
  topic.questions.push(...(developerTopicExpansion[topic.title] || []));
});

const developerPracticeAngles = [
  ["Explain", "Explain the concept directly, then describe why it matters, its limits, and one practical Salesforce example."],
  ["Design", "Clarify requirements and constraints, propose a maintainable design, and explain security, limits, testing, and deployment."],
  ["Debug", "Reproduce the issue, inspect evidence and limits, isolate the root cause, implement the smallest safe fix, and regression-test it."],
  ["Secure", "Define the trust boundary, apply least privilege, validate inputs and data access, and test with restricted user personas."],
  ["Test", "Cover positive, negative, bulk, security, and failure paths with meaningful assertions and isolated test data."],
  ["Scenario", "State assumptions, walk through the implementation step by step, explain tradeoffs, and finish with validation and monitoring."]
];

function developerConcept(item) {
  const terms = [...new Set((item[1] || []).slice(0, 3).map((term) => String(term).trim()).filter(Boolean))];
  if (terms.length === 1) return terms[0];
  if (terms.length === 2) return `${terms[0]} and ${terms[1]}`;
  return `${terms.slice(0, -1).join(", ")}, and ${terms.at(-1)}`;
}

function developerPracticeQuestions(topic) {
  const concepts = topic.questions.slice(0, 10).map(developerConcept);
  return Array.from({ length: 60 }, (_, index) => {
    const [angle, framework] = developerPracticeAngles[Math.floor(index / concepts.length)];
    const concept = concepts[index % concepts.length];
    const questions = {
      Explain: `How would you explain the practical importance of ${concept} to another Salesforce developer?`,
      Design: `How would you design a production-ready solution centered on ${concept}?`,
      Debug: `A production defect involves ${concept}. How would you diagnose and resolve it?`,
      Secure: `Which security risks and controls apply when implementing ${concept}?`,
      Test: `What test strategy would you use for a solution involving ${concept}?`,
      Scenario: `A stakeholder requests a complex change involving ${concept}. How would you deliver it safely?`
    };
    return {
      question: questions[angle],
      keywords: String(concept).toLowerCase().match(/[a-z]{4,}/g)?.slice(0, 7) || [],
      guide: `I would start with the business outcome and the current architecture. ${framework} I would document the decision, confirm ownership, and verify the result after release.`,
      coaching: `Practice angle: ${angle}. Include Salesforce-specific terminology, one concrete example, and the result or tradeoff.`,
      provenance: "generated",
      source: { label: "Generated from sourced Developer topic coverage", url: "https://developer.salesforce.com/docs/" },
      topic: topic.title,
      type: "technical"
    };
  });
}

window.TomCodexDeveloperInterviewTopics.forEach((topic) => {
  topic.practiceQuestions = developerPracticeQuestions(topic);
});
