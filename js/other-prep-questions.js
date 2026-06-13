/**
 * Realistic Practice Questions for Developer & AI/Agentforce Certifications
 */

window.PDI_PREP_QUESTIONS = [
  {
    id: 101,
    category: "Apex Coding & Triggers",
    question: "A developer wants to perform custom validation checks on records before they are saved to the database. Which trigger event should they use?",
    options: [
      "before insert and before update",
      "after insert and after update",
      "before insert and after insert",
      "after update only"
    ],
    correctIndex: 0,
    explanation: "Before triggers (before insert, before update) are used to validate or update record values before they are committed to the database. Trying to perform custom validation or modify fields in an after trigger throws read-only exceptions or requires extra DML operations."
  },
  {
    id: 102,
    category: "Apex Coding & Triggers",
    question: "Which code pattern should be used to prevent hitting governor limits when querying related records for a list of accounts?",
    options: [
      "Execute a SOQL query inside a for loop iterating over the Account list.",
      "Query all Contacts and match them in-memory using nested loops.",
      "Use a single SOQL query with a subquery (inner join) to fetch Account and Contacts together.",
      "Call a @future method for each account record to fetch its contacts asynchronously."
    ],
    correctIndex: 2,
    explanation: "SOQL queries should never be executed inside loops (which causes the 'Too many SOQL queries: 101' limit). Fetching records and their children using a single relationship subquery (e.g., [SELECT Id, Name, (SELECT Id FROM Contacts) FROM Account WHERE Id IN :accIds]) is the bulkified best practice."
  },
  {
    id: 103,
    category: "Lightning Web Components",
    question: "How should a Lightning Web Component child send data back up to its parent component?",
    options: [
      "By calling a public method exposed on the parent via @api.",
      "By firing a CustomEvent and letting the parent listen for it.",
      "By importing a shared service module in both components.",
      "By updating a properties variable in localStorage."
    ],
    correctIndex: 1,
    explanation: "Lightning Web Components use standard DOM events to communicate upward. A child component dispatches a CustomEvent, which propagates up, and the parent handles it with an event listener on the child tag."
  },
  {
    id: 104,
    category: "Apex Coding & Triggers",
    question: "What is the maximum number of SOQL queries allowed in a single synchronous Apex transaction?",
    options: [
      "20 queries",
      "100 queries",
      "200 queries",
      "Unlimited"
    ],
    correctIndex: 1,
    explanation: "The synchronous governor limit for SOQL queries is 100. For asynchronous transactions (like Batch Apex or Queueable Apex), the limit is increased to 200."
  },
  {
    id: 105,
    category: "Apex Coding & Triggers",
    question: "Which keyword should a developer use to allow an Apex class to respect the sharing rules of the current user?",
    options: [
      "with sharing",
      "without sharing",
      "inherited sharing",
      "public sharing"
    ],
    correctIndex: 0,
    explanation: "The 'with sharing' keyword ensures that the class respects the sharing rules, organization-wide defaults, and role hierarchy settings of the running user."
  }
];

window.AI_PREP_QUESTIONS = [
  {
    id: 201,
    category: "AI Ethics & Trust",
    question: "Which principle of ethical AI in Salesforce ensures that users understand why an AI model made a specific prediction or recommendation?",
    options: [
      "Transparency",
      "Accountability",
      "Empowerment",
      "Robustness"
    ],
    correctIndex: 0,
    explanation: "Transparency means that AI models should be open, explaining how they make recommendations and predictions so users can verify accuracy and understand the logic behind outcomes."
  },
  {
    id: 202,
    category: "AI Fundamentals",
    question: "Which type of AI is specifically designed to generate new content, such as email drafts, chat replies, and text summaries?",
    options: [
      "Predictive AI",
      "Generative AI",
      "Analytical AI",
      "Classification AI"
    ],
    correctIndex: 1,
    explanation: "Generative AI uses Large Language Models (LLMs) to create brand-new text, images, code, or other media based on input prompts."
  },
  {
    id: 203,
    category: "Data Quality & AI",
    question: "What is the primary factor that determines the accuracy and reliability of AI predictions?",
    options: [
      "The number of fields in the record layouts",
      "The cleanliness, quality, and completeness of the training data",
      "The size of the user licenses in the organization",
      "The frequency of sandbox deployments"
    ],
    correctIndex: 1,
    explanation: "Data quality is the most crucial factor for AI success ('garbage in, garbage out'). Incomplete, biased, or duplicate data leads directly to poor, inaccurate predictions."
  },
  {
    id: 204,
    category: "AI Fundamentals",
    question: "What does LLM stand for in the context of Generative AI?",
    options: [
      "Large Language Model",
      "Logical Learning Module",
      "Linked Layout Map",
      "License Loading Manager"
    ],
    correctIndex: 0,
    explanation: "LLM stands for Large Language Model. It is a type of neural network trained on vast amounts of text to parse, understand, and generate natural language."
  },
  {
    id: 205,
    category: "Einstein Features",
    question: "Which Salesforce Einstein feature helps write replies to customer service emails automatically by combining case context with LLM generation?",
    options: [
      "Einstein Reply Recommendations",
      "Einstein Generative Service Replies",
      "Einstein Prediction Builder",
      "Einstein Analytics Service"
    ],
    correctIndex: 1,
    explanation: "Einstein Generative Service Replies generates real-time, context-specific email drafts or chat messages for agents using generative AI grounded in local CRM data."
  }
];

window.AGENTFORCE_PREP_QUESTIONS = [
  {
    id: 301,
    category: "Agentforce Configuration",
    question: "In Agentforce, how does the AI Copilot determine which action or topic to trigger when a user inputs a request?",
    options: [
      "It executes a hardcoded rule-based regex string match.",
      "The dynamic planner maps user intent to configured Agent Actions and Topics dynamically.",
      "It requires the administrator to link keywords to button click elements manually.",
      "It routes all queries to an external apex router class."
    ],
    correctIndex: 1,
    explanation: "Agentforce uses a dynamic planner that evaluates the user request and selects the most relevant Agent Actions or Topics based on action descriptions and input properties."
  },
  {
    id: 302,
    category: "Grounding Case Context",
    question: "What is the term used in Agentforce for supplying local CRM records, case context, or knowledge articles to a prompt template to guarantee accurate responses?",
    options: [
      "Prompt engineering",
      "Grounding",
      "Anchoring",
      "Data ingestion"
    ],
    correctIndex: 1,
    explanation: "Grounding is the process of injecting verified CRM data or knowledge articles into the prompt template context before sending it to the LLM, ensuring the output is accurate, safe, and factual."
  },
  {
    id: 303,
    category: "Prompt Builder",
    question: "Which Salesforce tool is used to design, verify, and safe-test custom prompts integrated into Agentforce actions?",
    options: [
      "Agentforce Manager",
      "Prompt Builder",
      "Einstein Playgrounds",
      "Flow Builder"
    ],
    correctIndex: 1,
    explanation: "Prompt Builder is the workspace used by admins to draft prompt templates, merge dynamic CRM fields and flows, test prompt rendering, and deploy them for agents."
  },
  {
    id: 304,
    category: "Agentforce Topics",
    question: "What is the role of a 'Topic' in configuring Agentforce copilot behavior?",
    options: [
      "It sets the visual styling and color layout of the chat widget.",
      "It acts as a category of actions, defining the scope and system instructions for specific business domains.",
      "It determines the profile access of the copilot widget.",
      "It acts as an automated backup router for server downtime."
    ],
    correctIndex: 1,
    explanation: "Topics group relevant actions and instructions together, helping the copilot understand the boundaries, rules, and actions associated with specific business areas (e.g., billing, customer support, lead intake)."
  },
  {
    id: 305,
    category: "Salesforce Trust Layer",
    question: "What is the primary objective of the Salesforce Einstein Trust Layer when communicating with third-party LLMs?",
    options: [
      "To optimize API call speeds and reduce pricing packages.",
      "To verify that the user has a valid Salesforce login license.",
      "To mask personally identifiable information (PII) and ensure zero data retention on external servers.",
      "To execute security checks on the user's role hierarchy."
    ],
    correctIndex: 2,
    explanation: "The Einstein Trust Layer guarantees data privacy by masking PII, filtering toxic content, and enforcing a zero-data-retention policy with LLM partners."
  }
];
