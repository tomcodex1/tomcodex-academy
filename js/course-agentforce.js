const agentforceModules = [
  {
    title: "Agentforce Foundations & Setup",
    description: "Understand agentic AI, the Agentforce architecture, Agent Studio, and provision your first Salesforce AI Agent.",
    points: [
      "Explain the difference between generative copilots, chatbots, and autonomous agents.",
      "Explore the Agent Studio interface, including Agent Builder and Prompt Builder.",
      "Provision and enable a standard Agent in a Salesforce Developer Org."
    ],
    resources: [
      ["Agentforce Basics", "https://trailhead.salesforce.com/content/learn/modules/agentforce-basics"],
      ["Agent Studio Help", "https://help.salesforce.com/s/articleView?id=sf.copilot_studio_overview.htm&type=5"]
    ],
    practice: [
      "Enable Einstein and Agentforce in your org Setup menu.",
      "Navigate to the Agent Builder and open the default Copilot Agent.",
      "Activate the Agent and run a basic conversation query in the test console."
    ],
    questions: [
      "What is an autonomous AI agent in the context of Salesforce?",
      "How does Agent Studio separate instructions, topics, and actions?",
      "What permission sets are required to configure Agentforce agents?"
    ]
  },
  {
    title: "Topics, Instructions & Routing",
    description: "Design conversational topics, write grounding instructions, and understand how the Agent routes user intents.",
    points: [
      "Create custom Topics that group related business scopes together.",
      "Write clear, bounded Instructions that guide the agent on what to do.",
      "Understand the orchestrator routing engine and intent classification."
    ],
    resources: [
      ["Agentforce Topics", "https://help.salesforce.com/s/articleView?id=sf.copilot_topics_about.htm&type=5"]
    ],
    practice: [
      "Create a custom 'Student Support' Topic inside your Agent.",
      "Write instructions directing the agent to only answer questions about courses.",
      "Test intent classification in the Agent Studio conversation debugger."
    ],
    questions: [
      "What is a Topic in Agentforce, and how is it triggered?",
      "How do instructions prevent the agent from discussing off-topic content?",
      "How does the Agent Studio debugger visualize topic classification?"
    ]
  },
  {
    title: "Agent Actions (Flow & Apex Integration)",
    description: "Equip your agent with capabilities by linking custom Flows and Apex invocable actions to Topics for backend record updates.",
    points: [
      "Expose standard and custom Flows as Agent Actions to execute business logic.",
      "Write @InvocableMethod Apex classes that allow the agent to run complex queries.",
      "Define input and output parameters that the agent automatically maps."
    ],
    resources: [
      ["Agent Actions Guide", "https://help.salesforce.com/s/articleView?id=sf.copilot_actions_about.htm&type=5"]
    ],
    practice: [
      "Expose a custom screen-flow as an Action to register new students.",
      "Write an invocable Apex class that retrieves student enrollment metrics.",
      "Attach both Actions to the 'Student Support' Topic and run verification tests."
    ],
    questions: [
      "How does the Agent map user chat parameters to Flow input variables?",
      "What annotation makes an Apex method accessible to Agentforce?",
      "How are DML updates executed securely when run via an Agent action?"
    ]
  },
  {
    title: "Prompt Templates & Prompt Builder",
    description: "Design prompt templates, ground prompts with Salesforce records, and merge merge-fields dynamically for Einstein LLM calls.",
    points: [
      "Understand the role of the Prompt Builder in grounding generative models.",
      "Create custom Prompt Templates and define target sObject contexts.",
      "Ground prompts dynamically using merge fields and record relationships."
    ],
    resources: [
      ["Prompt Builder Guide", "https://help.salesforce.com/s/articleView?id=sf.prompt_builder_overview.htm&type=5"]
    ],
    practice: [
      "Create a custom 'Course Summary' Sales Prompt Template.",
      "Insert record merge fields to display active course details dynamically.",
      "Preview the resolved prompt and test generative model output in Einstein console."
    ],
    questions: [
      "What is grounding in generative AI, and why is it important?",
      "How does Prompt Builder protect sensitive data before sending it to LLMs?",
      "What is the difference between a system prompt and a user prompt template?"
    ]
  },
  {
    title: "Channels & Copilot Deployments",
    description: "Deploy your Agent to multiple channels, including Lightning Experience utility bars, Experience Cloud portals, and web widgets.",
    points: [
      "Deploy your Einstein Copilot to the internal Salesforce utility bar for employees.",
      "Configure web chat deployments to expose agents on public community portals.",
      "Configure CORS, CSP, and security settings for web widget hosting."
    ],
    resources: [
      ["Einstein Copilot Deployment", "https://help.salesforce.com/s/articleView?id=sf.copilot_deploy.htm&type=5"]
    ],
    practice: [
      "Add the Einstein Copilot component to your Sales App Utility Bar.",
      "Set up a web chat deployment deployment for your Experience Cloud portal.",
      "Test the chat widget inside a mock website and verify connection parameters."
    ],
    questions: [
      "How do internal deployments differ from public-facing web widgets?",
      "What is CORS, and why is it configured for integration channels?",
      "How do you control user access permissions on external community channels?"
    ]
  },
  {
    title: "Conversational Analytics & Auditing",
    description: "Track agent performance, audit conversational histories, verify trust settings, and monitor system execution logs.",
    points: [
      "Monitor agent performance dashboards and identify failed classification runs.",
      "Audit raw conversational transcripts and trace action execution logs.",
      "Understand the Einstein Trust Layer and verify toxicity masking settings."
    ],
    resources: [
      ["Einstein Trust Layer", "https://www.salesforce.com/products/einstein/trust-layer/"]
    ],
    practice: [
      "Open Setup → Einstein Copilot Event Logs and inspect a recent transaction.",
      "Verify toxicity masking configurations inside the Einstein Trust console.",
      "Audit a conversation history transcript to locate an action routing failure."
    ],
    questions: [
      "What does the Einstein Trust Layer do to prevent data leakage?",
      "How do you trace why an Agent failed to classification-route a prompt?",
      "What metrics help admins measure adoption success of external agents?"
    ]
  }
];

window.TomCodexCourseConfig = {
  modules: agentforceModules,
  masteryKey: "tomcodex.agentforceMasteryScores.v1",
  courseName: "Salesforce Agentforce",
  recordLabel: "Agentforce",
  moduleHours: 3
};
