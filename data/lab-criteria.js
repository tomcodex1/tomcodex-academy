// Trailhead-style "Check My Work" verification criteria for each course module.
// Each criterion has a question + acceptable answer keywords/values.
// AI checks student answers against these criteria.

export const LAB_CRITERIA = {

  // ─── SALESFORCE ADMIN · MODULE 1 ────────────────────────────────────────────
  "admin-0": {
    moduleId: "admin-0",
    courseName: "Salesforce Administrator",
    moduleName: "Salesforce Platform Foundations",
    labTitle: "Explore Your Salesforce Developer Org",
    labInstructions: `
      <p class="text-sm text-slate-600 leading-relaxed">Complete these steps in your <strong>Salesforce Developer Org or Trailhead Playground</strong>, then answer the Check My Work questions below to verify your setup.</p>
      <ol class="mt-3 space-y-2 text-sm text-slate-600 list-decimal pl-5">
        <li>Log in to your Salesforce Developer Org at <strong>login.salesforce.com</strong></li>
        <li>Click the <strong>App Launcher</strong> (9-dot grid icon, top-left) and count the available apps</li>
        <li>Go to <strong>Setup</strong> (gear icon → Setup) and note the Setup Home URL</li>
        <li>Navigate to <strong>Setup → Company Information</strong> and note your org Edition and Org ID</li>
        <li>Go to <strong>Setup → Object Manager</strong> and count how many standard objects appear on page 1</li>
        <li>Navigate to <strong>Setup → Users</strong> and find your own Profile name</li>
      </ol>
    `,
    criteria: [
      {
        id: "c1",
        question: "What type/edition is your Salesforce org? (e.g. Developer Edition, Trailhead Playground)",
        type: "text",
        acceptedValues: ["developer edition", "developer", "trailhead playground", "playground", "enterprise", "professional", "sandbox"],
        hint: "Go to Setup → Company Information → look for 'Organization Edition' field."
      },
      {
        id: "c2",
        question: "How many apps are visible in your App Launcher? (click the 9-dot grid icon)",
        type: "number",
        minValue: 5,
        maxValue: 40,
        hint: "Click the 9-dot App Launcher icon top-left. Count all visible app tiles."
      },
      {
        id: "c3",
        question: "In Setup → Object Manager, what is the API Name of the very first standard object listed?",
        type: "text",
        acceptedValues: ["account", "accounts"],
        hint: "Setup → Object Manager. Objects are listed alphabetically. 'Account' is usually first."
      },
      {
        id: "c4",
        question: "What is your user Profile name? (Setup → Users → find your name)",
        type: "text",
        acceptedValues: ["system administrator", "administrator", "standard user", "admin", "salesforce.com profile"],
        hint: "Setup → Users → locate your name → check the Profile column."
      },
      {
        id: "c5",
        question: "What URL does your Salesforce org use? (the part before .lightning.force.com or .salesforce.com)",
        type: "text",
        minLength: 3,
        hint: "Look at your browser address bar when logged in. The subdomain before .lightning.force.com is your org's unique URL."
      }
    ]
  },

  // ─── APEX DEVELOPMENT · MODULE 1 ────────────────────────────────────────────
  "apex-0": {
    moduleId: "apex-0",
    courseName: "Apex Development",
    moduleName: "Apex and the Salesforce Runtime",
    labTitle: "Write Your First Anonymous Apex Script",
    labInstructions: `
      <p class="text-sm text-slate-600 leading-relaxed">Complete these steps in your Salesforce org's <strong>Developer Console</strong>, then answer the Check My Work questions below.</p>
      <ol class="mt-3 space-y-2 text-sm text-slate-600 list-decimal pl-5">
        <li>Go to Setup → <strong>Developer Console</strong> (or click top-right name → Developer Console)</li>
        <li>Click <strong>Debug → Open Execute Anonymous Window</strong></li>
        <li>Type this code: <code class="bg-slate-100 px-1 rounded text-xs">System.debug('Hello Salesforce!');</code></li>
        <li>Click <strong>Execute</strong> and check the Logs panel at the bottom</li>
        <li>Open the log entry and find the DEBUG line with your message</li>
        <li>Note the log level shown (e.g. USER_DEBUG)</li>
      </ol>
    `,
    criteria: [
      {
        id: "c1",
        question: "What menu option in Developer Console did you use to open the code execution window?",
        type: "text",
        acceptedValues: ["execute anonymous", "debug execute anonymous", "open execute anonymous window", "execute anonymous window"],
        hint: "In Developer Console: Debug menu → Open Execute Anonymous Window."
      },
      {
        id: "c2",
        question: "What log level appears next to your System.debug output in the log?",
        type: "text",
        acceptedValues: ["user_debug", "USER_DEBUG", "debug"],
        hint: "Open the log entry. Your System.debug line shows as USER_DEBUG in the log."
      },
      {
        id: "c3",
        question: "What exact text did your debug statement print? (what you passed to System.debug)",
        type: "text",
        minLength: 3,
        hint: "Look at the log output. The text after USER_DEBUG|[1]| is your debug message."
      },
      {
        id: "c4",
        question: "What is the Apex class used for printing output in Salesforce?",
        type: "text",
        acceptedValues: ["system", "system.debug", "system class"],
        hint: "You used System.debug(). 'System' is a built-in Apex class for logging."
      },
      {
        id: "c5",
        question: "Where in the Developer Console can you see the execution logs after running Apex?",
        type: "text",
        acceptedValues: ["logs panel", "logs", "log panel", "bottom panel", "log tab"],
        hint: "After execution, the log appears in the Logs panel at the bottom of Developer Console."
      }
    ]
  },

  // ─── SALESFORCE FLOW · MODULE 1 ────────────────────────────────────────────
  "flow-0": {
    moduleId: "flow-0",
    courseName: "Salesforce Flow",
    moduleName: "Flow Builder Foundations",
    labTitle: "Create Your First Screen Flow",
    labInstructions: `
      <p class="text-sm text-slate-600 leading-relaxed">Complete these steps in your Salesforce org using <strong>Flow Builder</strong>, then answer the Check My Work questions below.</p>
      <ol class="mt-3 space-y-2 text-sm text-slate-600 list-decimal pl-5">
        <li>Go to <strong>Setup → Process Automation → Flows</strong></li>
        <li>Click <strong>New Flow</strong></li>
        <li>Select <strong>Screen Flow</strong> as the flow type</li>
        <li>Click <strong>Create</strong> — Flow Builder opens</li>
        <li>Click <strong>+</strong> on the canvas and add a <strong>Screen element</strong></li>
        <li>Give the screen a label e.g. "Welcome Screen"</li>
        <li>Add a <strong>Display Text</strong> component with any message</li>
        <li>Click <strong>Done</strong> then <strong>Save</strong> the flow with any name</li>
      </ol>
    `,
    criteria: [
      {
        id: "c1",
        question: "What type of Flow did you create?",
        type: "text",
        acceptedValues: ["screen flow", "screen"],
        hint: "When creating a new flow, you chose 'Screen Flow' from the flow type options."
      },
      {
        id: "c2",
        question: "What is the name you gave to your Screen element (the label on the screen)?",
        type: "text",
        minLength: 2,
        hint: "When you configured the Screen element, you gave it a label like 'Welcome Screen'."
      },
      {
        id: "c3",
        question: "What component type did you add inside the Screen to display a message?",
        type: "text",
        acceptedValues: ["display text", "text display", "text", "display"],
        hint: "Inside the Screen element, you added a 'Display Text' component."
      },
      {
        id: "c4",
        question: "Where in Setup did you navigate to find Flow Builder?",
        type: "text",
        acceptedValues: ["process automation flows", "process automation", "setup flows", "flows"],
        hint: "Setup → Process Automation → Flows is where all flows are managed."
      },
      {
        id: "c5",
        question: "What is the name you saved your Flow as?",
        type: "text",
        minLength: 2,
        hint: "When you clicked Save, you gave your flow a name. Enter that name here."
      }
    ]
  },

  // ─── LWC · MODULE 1 ──────────────────────────────────────────────────────────
  "lwc-0": {
    moduleId: "lwc-0",
    courseName: "Lightning Web Components",
    moduleName: "LWC and Web Platform Foundations",
    labTitle: "Set Up VS Code & Salesforce CLI",
    labInstructions: `
      <p class="text-sm text-slate-600 leading-relaxed">Complete these steps to set up your LWC development environment, then answer the Check My Work questions below.</p>
      <ol class="mt-3 space-y-2 text-sm text-slate-600 list-decimal pl-5">
        <li>Download and install <strong>VS Code</strong> from code.visualstudio.com</li>
        <li>Install the <strong>Salesforce Extension Pack</strong> from VS Code Extensions marketplace</li>
        <li>Install <strong>Salesforce CLI</strong> from developer.salesforce.com/tools/sfdxcli</li>
        <li>Open Terminal in VS Code and run: <code class="bg-slate-100 px-1 rounded text-xs">sf --version</code></li>
        <li>Note the CLI version number shown</li>
        <li>Run: <code class="bg-slate-100 px-1 rounded text-xs">sf org login web</code> to authenticate your org</li>
      </ol>
    `,
    criteria: [
      {
        id: "c1",
        question: "What is the name of the Salesforce VS Code extension pack you installed?",
        type: "text",
        acceptedValues: ["salesforce extension pack", "salesforce extensions", "salesforce extension"],
        hint: "Search 'Salesforce' in VS Code Extensions. Install 'Salesforce Extension Pack'."
      },
      {
        id: "c2",
        question: "What command did you run to check the Salesforce CLI version?",
        type: "text",
        acceptedValues: ["sf --version", "sfdx --version", "sf version"],
        hint: "In the VS Code terminal, type: sf --version"
      },
      {
        id: "c3",
        question: "What version of Salesforce CLI is installed on your machine? (paste the version number)",
        type: "text",
        minLength: 3,
        hint: "Run 'sf --version' in your terminal. It prints something like '@salesforce/cli/2.x.x'"
      },
      {
        id: "c4",
        question: "What command is used to authenticate and connect VS Code to your Salesforce org?",
        type: "text",
        acceptedValues: ["sf org login web", "sfdx force:auth:web:login", "sf org login"],
        hint: "The command is: sf org login web — this opens a browser to log in."
      },
      {
        id: "c5",
        question: "What is the file extension used for Lightning Web Component HTML template files?",
        type: "text",
        acceptedValues: [".html", "html"],
        hint: "LWC files use .html for templates, .js for logic, and .css for styling."
      }
    ]
  }
};

export function getCriteria(courseKey, moduleIndex) {
  return LAB_CRITERIA[`${courseKey}-${moduleIndex}`] || null;
}
