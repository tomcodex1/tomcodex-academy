/**
 * 60 Realistic Salesforce Administrator Exam Practice Questions
 */
const ADMIN_PREP_QUESTIONS = [
  // --- Category: Configuration and Setup (12 questions) ---
  {
    id: 1,
    category: "Configuration and Setup",
    question: "An administrator needs to restrict users from logging in to Salesforce from outside the corporate network. Which feature should be used?",
    options: [
      "Login Hours on the Profile",
      "Login IP Ranges on the Profile",
      "Network Access Settings under Setup",
      "Geographic Restrictions in Session Settings"
    ],
    correctIndex: 1,
    explanation: "Login IP Ranges defined on the user's Profile restrict login access to only specified IP ranges. Logins from outside these ranges will be denied. Network Access at the organization level is used to bypass activation verification, not to restrict access."
  },
  {
    id: 2,
    category: "Configuration and Setup",
    question: "Cloud Kicks wants to allow users to see currency amounts in both their local currency and the corporate currency. Which feature should the administrator enable?",
    options: [
      "Advanced Currency Management",
      "Parenthetical Currency Conversion",
      "Multi-Currency",
      "Collaborative Forecasting"
    ],
    correctIndex: 2,
    explanation: "Enabling Multi-Currency allows the organization to support multiple currencies. When enabled, parenthetical currency conversion is automatically activated, showing the user's local currency alongside the corporate currency on records."
  },
  {
    id: 3,
    category: "Configuration and Setup",
    question: "A user reports they cannot log in to Salesforce. The administrator checks their user record and notices there are no login attempts in the Login History. What is the most likely cause?",
    options: [
      "The user's password has expired.",
      "The user is locked out due to too many invalid login attempts.",
      "The user is entering the wrong username or logging into the wrong URL.",
      "The user's profile has login hours restricted."
    ],
    correctIndex: 2,
    explanation: "If there are no login attempts registered in the Salesforce Login History, the request never reached the Salesforce org. The user is either logging into the wrong URL (e.g., test.salesforce.com instead of login.salesforce.com) or misspelled their username."
  },
  {
    id: 4,
    category: "Configuration and Setup",
    question: "An administrator wants to change the default locale for a single user without changing the locale settings for the entire company. How can this be accomplished?",
    options: [
      "Modify the locale settings on the company profile.",
      "Change the locale on the user's personal detail page.",
      "Assign a new profile with the desired locale configuration.",
      "Update the locale via a permission set assigned to the user."
    ],
    correctIndex: 1,
    explanation: "Locale settings can be customized for individual users on their personal detail settings page under User Settings. This overrides the organization's default locale."
  },
  {
    id: 5,
    category: "Configuration and Setup",
    question: "A company operates on a 13-period custom fiscal year. How will this impact the use of standard forecasting and standard reports?",
    options: [
      "Standard forecasting will function normally, but standard report intervals cannot be changed.",
      "Custom fiscal years cannot be used with forecasting.",
      "Custom fiscal years must be defined annually and cannot be disabled once enabled.",
      "Custom fiscal years will automatically generate custom reporting periods."
    ],
    correctIndex: 2,
    explanation: "Once custom fiscal years are enabled, they cannot be disabled. They require defining custom periods for each year and impact standard date filters in reports, forecasts, and quotas."
  },
  {
    id: 6,
    category: "Configuration and Setup",
    question: "An administrator is tasked with setting up login hours for a customer support team. What happens if a user is logged in when the restricted hours begin?",
    options: [
      "The user is allowed to continue working but cannot create new records.",
      "The user is logged out immediately and any unsaved work is lost.",
      "The user can stay logged in until they refresh the browser page.",
      "The user's session remains active, but they receive a warning popup."
    ],
    correctIndex: 1,
    explanation: "When login hours end, Salesforce terminates the user's active session immediately, logging them out. Any unsaved changes are lost."
  },
  {
    id: 7,
    category: "Configuration and Setup",
    question: "An administrator needs to grant temporary access to a developer to troubleshoot an issue. How can this access be provided securely without sharing credentials?",
    options: [
      "Share the administrator's password via a secure manager.",
      "Ask the developer to request access via the 'Grant Login Access' feature.",
      "Create a temporary administrator account for the developer.",
      "Add the developer's IP address to the Network Access whitelist."
    ],
    correctIndex: 1,
    explanation: "Users can grant login access to administrators or support agents. This allows the administrator or developer to log in as the user for a specified duration without knowing their password."
  },
  {
    id: 8,
    category: "Configuration and Setup",
    question: "Which feature allows an administrator to customize the landing page tabs and layout for different business departments in Salesforce?",
    options: [
      "Custom Profiles",
      "Lightning Apps",
      "Page Layouts",
      "Record Types"
    ],
    correctIndex: 1,
    explanation: "Lightning Apps allow administrators to group navigation tabs, utility bar items, and branding together. Different apps can be assigned to different profiles to customize the workspace for each business department."
  },
  {
    id: 9,
    category: "Configuration and Setup",
    question: "A company has a requirement to track dynamic exchange rates on a daily basis. What should the administrator configure?",
    options: [
      "Advanced Currency Management",
      "Multi-Currency with manual exchange updates",
      "An AppExchange integration for daily rates using Advanced Currency Management",
      "A custom object to calculate daily conversions"
    ],
    correctIndex: 2,
    explanation: "Advanced Currency Management (ACM) allows tracking dated exchange rates, which maps exchange rates to specific date ranges on opportunities. AppExchange tools or custom integrations are typically used to automate daily updates within ACM."
  },
  {
    id: 10,
    category: "Configuration and Setup",
    question: "A support team manager needs to see the support operations dashboard when logging in. What should the administrator configure?",
    options: [
      "Set the Support Dashboard as the Home Page in the Support App settings.",
      "Create a custom visualforce page to load on login.",
      "Add the dashboard component to the Home Page layout and assign it to the manager's profile.",
      "Schedule the dashboard to email the manager daily at 8:00 AM."
    ],
    correctIndex: 2,
    explanation: "Adding a dashboard component to a custom Home Page layout using Lightning App Builder, and assigning that Home Page to the support manager's profile, ensures they see the dashboard on their landing page."
  },
  {
    id: 11,
    category: "Configuration and Setup",
    question: "Which setting under Company Information controls the default timezone, locale, and language for new users?",
    options: [
      "Organization default settings",
      "User settings template",
      "Language and Region Settings",
      "Fiscal Year Settings"
    ],
    correctIndex: 0,
    explanation: "The default locale, language, and timezone settings defined in the Company Information page act as the default fallback for all new users created in the organization."
  },
  {
    id: 12,
    category: "Configuration and Setup",
    question: "A user is unable to find a specific custom app in the App Launcher. What should the administrator check first?",
    options: [
      "If the app is marked Active in the App Manager.",
      "If the user's Profile has visible access to the app.",
      "If the app is added to the user's Page Layout.",
      "If the user has the 'Customize Application' permission."
    ],
    correctIndex: 1,
    explanation: "App visibility is controlled by Profile assignments and Permission Sets. The first check should be whether the user's profile has been granted access to the specific Lightning App."
  },

  // --- Category: Object Manager and Lightning App Builder (12 questions) ---
  {
    id: 13,
    category: "Object Manager and Lightning App Builder",
    question: "An administrator needs to create a relationship between two custom objects where deleting the parent record does NOT delete the child records. What relationship type should be used?",
    options: [
      "Master-Detail Relationship",
      "Lookup Relationship",
      "Many-to-Many Relationship",
      "External Lookup Relationship"
    ],
    correctIndex: 1,
    explanation: "In a Lookup relationship, deleting the parent record does not cascade-delete the child records (though you can configure the behavior to clear the field, restrict deletion, or delete the lookup record). In a Master-Detail relationship, deleting the master record always deletes all associated detail records."
  },
  {
    id: 14,
    category: "Object Manager and Lightning App Builder",
    question: "A custom object called 'Project' has a Master-Detail relationship with the Account object. What happens to the Project records if the associated Account is deleted?",
    options: [
      "The Project records are orphaned but remain active.",
      "The Account cannot be deleted while Project records exist.",
      "The Project records are deleted and sent to the Recycle Bin.",
      "The parent lookup on the Project record is set to null."
    ],
    correctIndex: 2,
    explanation: "Because Project is the detail side of a Master-Detail relationship, deleting the parent Account record automatically deletes all related child Project records (cascade delete)."
  },
  {
    id: 15,
    category: "Object Manager and Lightning App Builder",
    question: "How can an administrator enforce that a custom field is populated only when an Opportunity is moved to the 'Closed Won' stage?",
    options: [
      "Mark the field as Required on the field settings.",
      "Create a Validation Rule on the Opportunity object.",
      "Add the field to the Opportunity stage page layout.",
      "Set field-level security to read-only for other stages."
    ],
    correctIndex: 1,
    explanation: "A Validation Rule can conditionally enforce field requirements based on other criteria, such as checking if StageName is 'Closed Won' and the target field is blank (ISBLANK)."
  },
  {
    id: 16,
    category: "Object Manager and Lightning App Builder",
    question: "What is the maximum number of Master-Detail relationships a custom object can have?",
    options: [
      "1",
      "2",
      "5",
      "10"
    ],
    correctIndex: 1,
    explanation: "A custom object can have a maximum of 2 Master-Detail relationships."
  },
  {
    id: 17,
    category: "Object Manager and Lightning App Builder",
    question: "An administrator wants to show a rich text warning component on Account records, but only if the Account is marked as 'Inactive'. What tool should be used?",
    options: [
      "Lightning App Builder conditional visibility",
      "Page Layout properties",
      "Validation Rules",
      "Dynamic Forms"
    ],
    correctIndex: 0,
    explanation: "Lightning App Builder supports conditional component visibility, allowing components (like Rich Text) to be shown or hidden dynamically based on record field values (e.g., Status = 'Inactive')."
  },
  {
    id: 18,
    category: "Object Manager and Lightning App Builder",
    question: "A sales manager needs to view a read-only field that displays the total amount of all Closed Won Opportunities related to an Account. What field type should the administrator create?",
    options: [
      "Formula Field",
      "Roll-Up Summary Field",
      "Lookup Relationship Field",
      "Text Area (Long) with Flow calculation"
    ],
    correctIndex: 1,
    explanation: "Roll-Up Summary fields calculate values from related detail records (like Opportunities on Accounts) and can be filtered by criteria (such as Stage = 'Closed Won')."
  },
  {
    id: 19,
    category: "Object Manager and Lightning App Builder",
    question: "An administrator is designing a custom page layout. They want to arrange fields into collapsible, organized sections. Where should they configure this?",
    options: [
      "Object Manager > Fields & Relationships",
      "Object Manager > Page Layouts",
      "Lightning App Builder",
      "Schema Builder"
    ],
    correctIndex: 1,
    explanation: "Collapsible field sections are configured in the Page Layout Editor under Object Manager > Page Layouts (or using Section components in Dynamic Forms within Lightning App Builder)."
  },
  {
    id: 20,
    category: "Object Manager and Lightning App Builder",
    question: "A company wants to capture different information for 'Hardware' sales vs 'Software' sales on the Opportunity object, including different stages. What should the administrator configure?",
    options: [
      "Two different Page Layouts and two custom Opportunity objects.",
      "Two Record Types, each assigned to a different Page Layout and Sales Process.",
      "Two validation rules and a dynamic component layout.",
      "A custom picklist field that updates field visibility via CSS."
    ],
    correctIndex: 1,
    explanation: "Record Types allow you to offer different business processes (like Sales Processes/stages), picklist values, and page layouts to different users based on their profile or chosen category."
  },
  {
    id: 21,
    category: "Object Manager and Lightning App Builder",
    question: "What is a benefit of using Dynamic Forms in Lightning App Builder?",
    options: [
      "It allows you to bypass Validation Rules.",
      "It allows you to place individual fields anywhere on a Lightning Page without relying on a standard page layout.",
      "It automatically creates custom fields based on user input.",
      "It translates field labels into multiple languages dynamically."
    ],
    correctIndex: 1,
    explanation: "Dynamic Forms migrate record details into individual fields and sections in Lightning App Builder, enabling field-level visibility rules and flexible layout placement directly on the Lightning page."
  },
  {
    id: 22,
    category: "Object Manager and Lightning App Builder",
    question: "An administrator wants to prevent users from deleting custom fields that are currently referenced in Apex code or validation rules. What is true about deleting these fields?",
    options: [
      "Salesforce allows deletion, but will throw a runtime error in Apex.",
      "Salesforce prevents the deletion of custom fields if they are referenced in active code or formulas.",
      "Fields must be deactivated first before they can be deleted.",
      "The administrator must delete the apex class before deleting the field."
    ],
    correctIndex: 1,
    explanation: "Salesforce prevents the deletion of any custom fields that are hardcoded or referenced in active Apex, validation rules, formulas, or flows (dependency tracking)."
  },
  {
    id: 23,
    category: "Object Manager and Lightning App Builder",
    question: "Which field type should be used to display an image or calculated link based on criteria on the record, without writing apex?",
    options: [
      "Rich Text field",
      "Formula field with IMAGE() function",
      "URL field",
      "Hyperlink object type"
    ],
    correctIndex: 1,
    explanation: "Formula fields support the `IMAGE()` and `HYPERLINK()` functions, allowing administrators to display custom icons, flags, or calculated links dynamically."
  },
  {
    id: 24,
    category: "Object Manager and Lightning App Builder",
    question: "An administrator needs to create a custom picklist field on Case that inherits its values from a single global list. What should they configure?",
    options: [
      "A local picklist with a validation rule.",
      "A Global Value Set.",
      "A Lookup relationship to a custom value object.",
      "An AppExchange Picklist controller."
    ],
    correctIndex: 1,
    explanation: "Global Value Sets allow you to share picklist values across multiple fields and objects. The fields inherit the values, and updating the Global Value Set updates all associated fields."
  },

  // --- Category: Sales and Marketing Applications (8 questions) ---
  {
    id: 25,
    category: "Sales and Marketing Applications",
    question: "When converting a Lead in Salesforce, which three objects can be created or updated automatically?",
    options: [
      "Account, Contact, and Opportunity",
      "Account, Lead Partner, and Opportunity",
      "Contact, Opportunity, and Quote",
      "Campaign, Account, and Contact"
    ],
    correctIndex: 0,
    explanation: "Lead conversion converts a lead record into an Account, a Contact, and optionally an Opportunity."
  },
  {
    id: 26,
    category: "Sales and Marketing Applications",
    question: "An administrator is setting up Collaborative Forecasting. What can be used to categorize opportunities into different forecast segments?",
    options: [
      "Opportunity Stages mapped to Forecast Categories",
      "Opportunity record types",
      "Sales team roles in the hierarchy",
      "The Opportunity probability percentage"
    ],
    correctIndex: 0,
    explanation: "Opportunities are grouped into forecast categories (Pipeline, Best Case, Commit, Closed) based on how their Opportunity Stage is mapped to the Forecast Category picklist value."
  },
  {
    id: 27,
    category: "Sales and Marketing Applications",
    question: "What is the function of the Campaign Influence feature in Salesforce?",
    options: [
      "It automatically sends marketing emails to campaign members.",
      "It associates multiple campaigns to a single opportunity to track ROI.",
      "It assigns leads to campaigns based on custom lead scores.",
      "It calculates the percentage of successful conversions for a sales team."
    ],
    correctIndex: 1,
    explanation: "Campaign Influence allows you to attribute sales revenue from an Opportunity to multiple marketing campaigns that touched the contact beforehand."
  },
  {
    id: 28,
    category: "Sales and Marketing Applications",
    question: "A company wants to prevent opportunities from being created without an associated Campaign. How can this be accomplished?",
    options: [
      "Make Campaign a required lookup field on the Opportunity page layout.",
      "Create a validation rule checking if CampaignId is blank.",
      "Enable campaign influence requirements in Setup.",
      "Use Lead Conversion settings to enforce campaigns."
    ],
    correctIndex: 1,
    explanation: "A validation rule on Opportunity (e.g., `ISBLANK(CampaignId)`) is the best way to enforce that a campaign is associated at the database level when an opportunity is created."
  },
  {
    id: 29,
    category: "Sales and Marketing Applications",
    question: "A sales manager wants to assign Leads to different sales queues based on the state of the lead's address. What feature should the administrator use?",
    options: [
      "Lead Assignment Rules",
      "Lead Auto-Response Rules",
      "Lead Conversion Mapping",
      "Workflow Rules"
    ],
    correctIndex: 0,
    explanation: "Lead Assignment Rules route leads to specific users or queues based on criteria like geographic state, industry, or source."
  },
  {
    id: 30,
    category: "Sales and Marketing Applications",
    question: "How can an administrator enable sales reps to collaborate and share credit on an Opportunity record?",
    options: [
      "Enable Opportunity Teams and Opportunity Splits.",
      "Create a sharing rule for Opportunity collaboration.",
      "Add a lookup field for secondary owners.",
      "Assign the sales reps to the same public group."
    ],
    correctIndex: 0,
    explanation: "Opportunity Teams define which users collaborate on an Opportunity, and Opportunity Splits allow dividing commission or revenue credit among those team members."
  },
  {
    id: 31,
    category: "Sales and Marketing Applications",
    question: "What is true about custom Lead field mapping during conversion?",
    options: [
      "Custom Lead fields must be mapped to custom fields on Account, Contact, or Opportunity.",
      "Custom Lead fields are automatically mapped to standard fields.",
      "Salesforce does not support converting custom Lead fields.",
      "Lead fields can only be converted to text fields."
    ],
    correctIndex: 0,
    explanation: "During Lead conversion, custom Lead fields must be explicitly mapped in Lead Settings to custom fields of matching data types on the Account, Contact, or Opportunity objects."
  },
  {
    id: 32,
    category: "Sales and Marketing Applications",
    question: "A marketing manager needs to import 20,000 new Campaign Members from a spreadsheet. Which tool should the administrator recommend?",
    options: [
      "Data Import Wizard",
      "Data Loader",
      "Schema Builder",
      "Campaign member import button"
    ],
    correctIndex: 0,
    explanation: "The Data Import Wizard is the recommended tool for campaign member imports up to 50,000 records, as it has a built-in wizard specifically for campaign member association and deduplication."
  },

  // --- Category: Service and Support Applications (8 questions) ---
  {
    id: 33,
    category: "Service and Support Applications",
    question: "A customer support center wants cases to be routed to different queues based on priority, and escalated to senior support reps if they remain open for 24 hours. What two features should the administrator use?",
    options: [
      "Case Assignment Rules and Escalation Rules",
      "Case Auto-Response Rules and Assignment Rules",
      "Validation Rules and Escalation Rules",
      "Flows and Case Auto-Response Rules"
    ],
    correctIndex: 0,
    explanation: "Case Assignment Rules assign new cases to appropriate queues based on criteria (priority), while Case Escalation Rules automatically escalate cases (e.g., reassigning them or notifying managers) if they remain unresolved after a certain duration."
  },
  {
    id: 34,
    category: "Service and Support Applications",
    question: "How can a company ensure that customers receive a personalized confirmation email containing a case number immediately after submitting a Web-to-Case form?",
    options: [
      "Configure Case Assignment Rules",
      "Set up Case Auto-Response Rules",
      "Create a Case Escalation Rule",
      "Deploy an Apex Trigger on Case insertion"
    ],
    correctIndex: 1,
    explanation: "Case Auto-Response Rules send automated email responses to customers based on the details of the submitted case (such as sending a confirmation for Web-to-Case)."
  },
  {
    id: 35,
    category: "Service and Support Applications",
    question: "What is a key capability of the Salesforce Knowledge feature?",
    options: [
      "It automatically answers customer cases using AI.",
      "It allows support agents to create, manage, and publish articles for internal or external audiences.",
      "It tracks employee training and certifications.",
      "It stores customer contact credentials securely."
    ],
    correctIndex: 1,
    explanation: "Salesforce Knowledge allows organizations to build and maintain a repository of articles (knowledge base) that can be shared with support reps, customers on communities, or public websites."
  },
  {
    id: 36,
    category: "Service and Support Applications",
    question: "Support agents need a way to quickly perform repetitive actions, such as sending a standard email template and closing a Case, in a single click. What should the administrator configure?",
    options: [
      "Quick Actions",
      "Macros",
      "Validation Rules",
      "Escalation Rules"
    ],
    correctIndex: 1,
    explanation: "Macros in the Service Console allow agents to automate repetitive tasks—like logging calls, sending emails, or updating case status—into a single-click script."
  },
  {
    id: 37,
    category: "Service and Support Applications",
    question: "Which feature is used to define customer support service levels (such as guaranteed 4-hour response time) and track performance against them on Cases?",
    options: [
      "Milestones and Entitlements",
      "Escalation Rules",
      "Assignment Rules",
      "Case Feed"
    ],
    correctIndex: 0,
    explanation: "Entitlements define the level of support a customer is eligible for, and Milestones track the specific time-bound steps (like First Response Time) in the support process."
  },
  {
    id: 38,
    category: "Service and Support Applications",
    question: "What happens when a customer replies to an email thread associated with an existing Case using the Email-to-Case feature?",
    options: [
      "A new Case is created with a 'Duplicate' status.",
      "The email is logged as an Email Activity on the existing Case record.",
      "The existing Case is automatically reopened.",
      "The email is sent to the case owner's personal inbox only."
    ],
    correctIndex: 1,
    explanation: "Email-to-Case uses headers and threading tokens to match replies to the original Case record and logs the email in the Case feed/activities."
  },
  {
    id: 39,
    category: "Service and Support Applications",
    question: "A company wants to set up a public self-service channel where customers can search articles, ask questions in a forum, and log cases. What product should they configure?",
    options: [
      "Experience Cloud (Communities)",
      "Service Cloud Console",
      "Salesforce Portal (Legacy)",
      "Knowledge Center App"
    ],
    correctIndex: 0,
    explanation: "Experience Cloud (formerly Communities) allows creating public or private self-service portals where customers can access forums, knowledge bases, and log cases."
  },
  {
    id: 40,
    category: "Service and Support Applications",
    question: "When a Case is deleted, what happens to the related Case Comments and Activities?",
    options: [
      "Comments and activities are kept and orphaned.",
      "They are deleted along with the Case.",
      "The Case cannot be deleted if comments exist.",
      "Comments are deleted, but activities are reassigned to the Account."
    ],
    correctIndex: 1,
    explanation: "Deleting a Case record automatically deletes all related Comments, Solutions, and standard child records associated with that case."
  },

  // --- Category: Data and Analytics Management (10 questions) ---
  {
    id: 41,
    category: "Data and Analytics Management",
    question: "An administrator needs to import a list of 60,000 Contact records into Salesforce. Which tool should be used?",
    options: [
      "Data Import Wizard",
      "Data Loader",
      "Schema Builder",
      "Import Queue"
    ],
    correctIndex: 1,
    explanation: "The Data Import Wizard supports importing up to 50,000 records. Since the administrator needs to import 60,000 records, they must use Data Loader, which supports up to 5 million records."
  },
  {
    id: 42,
    category: "Data and Analytics Management",
    question: "How can an administrator schedule a weekly export of all Salesforce data for backup purposes?",
    options: [
      "Use the Data Export Service (Weekly Export) in Setup.",
      "Write an apex batch job to export files.",
      "Schedule the Data Loader command line interface via Task Scheduler.",
      "Export dashboards to PDF weekly."
    ],
    correctIndex: 0,
    explanation: "The Data Export service in Setup allows administrators to schedule weekly or monthly automated exports of the organization's data as CSV files."
  },
  {
    id: 43,
    category: "Data and Analytics Management",
    question: "A sales operations analyst needs to create a report showing Opportunities grouped by Close Date month, and then by Account Owner. Which report format should be used?",
    options: [
      "Tabular Report",
      "Summary Report",
      "Matrix Report",
      "Joined Report"
    ],
    correctIndex: 2,
    explanation: "A Matrix Report allows grouping data by both rows (e.g., Account Owner) and columns (e.g., Close Date month) to show summarized totals in a grid layout."
  },
  {
    id: 44,
    category: "Data and Analytics Management",
    question: "A marketing coordinator wants to group Accounts into three categories ('Small', 'Medium', 'Large') in a report based on their Annual Revenue, without creating a custom field. What feature should the administrator suggest?",
    options: [
      "Summary Formulas",
      "Row-Level Formulas",
      "Bucket Fields",
      "Cross Filters"
    ],
    correctIndex: 2,
    explanation: "Bucket Fields allow grouping report records together into categories ('buckets') based on their values (like ranges of Annual Revenue) without needing a database field."
  },
  {
    id: 45,
    category: "Data and Analytics Management",
    question: "Which feature prevents duplicate Account records from being created in Salesforce by alert messaging or blocking users during save?",
    options: [
      "Validation Rules",
      "Duplicate Rules and Matching Rules",
      "Data Loader settings",
      "Import wizard deduplication options"
    ],
    correctIndex: 1,
    explanation: "Matching Rules identify potential duplicates based on criteria, and Duplicate Rules define what happens (allow with alert, or block) when duplicates are detected."
  },
  {
    id: 46,
    category: "Data and Analytics Management",
    question: "A sales representative wants to see their team's pipeline dashboard, but the dashboard currently shows the data of the Executive VP (corporate totals). What should the administrator configure so the dashboard displays data based on who is viewing it?",
    options: [
      "Set the Running User as the 'Dashboard Viewer' (Dynamic Dashboard).",
      "Schedule the dashboard to run as the Executive VP.",
      "Assign the sales representative to a higher role in the hierarchy.",
      "Create a separate dashboard for each sales rep."
    ],
    correctIndex: 0,
    explanation: "Setting the dashboard running user as the 'Dashboard Viewer' makes it a Dynamic Dashboard, where data is filtered dynamically based on the viewing user's security access."
  },
  {
    id: 47,
    category: "Data and Analytics Management",
    question: "What is a limitation of Dynamic Dashboards?",
    options: [
      "They cannot be scheduled to be refreshed automatically via email.",
      "They cannot contain more than 5 components.",
      "They can only be viewed by administrators.",
      "They cannot display data from Matrix reports."
    ],
    correctIndex: 0,
    explanation: "Dynamic dashboards cannot be scheduled to email updates, because the data differs for every viewer. They must be refreshed manually by viewing them in the browser."
  },
  {
    id: 50,
    category: "Data and Analytics Management",
    question: "What happens if a record being imported via the Data Import Wizard fails a Validation Rule in Salesforce?",
    options: [
      "The import fails entirely and rolls back all records.",
      "The specific record fails to import, but the other valid records are imported.",
      "The validation rule is temporarily bypassed.",
      "The record is imported but marked as 'Invalid'."
    ],
    correctIndex: 1,
    explanation: "In both Data Import Wizard and Data Loader, records that fail validation rules, triggers, or system restrictions fail to load individually. The system continues importing the other valid records."
  },

  // --- Category: Workflow/Process Automation (10 questions) ---
  {
    id: 51,
    category: "Workflow/Process Automation",
    question: "A business analyst needs to automate a process where a tasks checklist is created, an external system API is called, and the user is guided through a series of screens. Which tool should be used?",
    options: [
      "Workflow Rule",
      "Process Builder",
      "Screen Flow (Flow Builder)",
      "Apex Trigger"
    ],
    correctIndex: 2,
    explanation: "Screen Flows are designed to guide users through an interactive process, collect inputs, perform logic, create records, and call external integrations without code."
  },
  {
    id: 52,
    category: "Workflow/Process Automation",
    question: "An administrator wants to update the 'Rating' field on a parent Account to 'Hot' automatically whenever a child Opportunity is closed won with an amount greater than $100,000. Which automation tool is recommended?",
    options: [
      "Record-Triggered Flow",
      "Workflow Rule",
      "Assignment Rule",
      "Escalation Rule"
    ],
    correctIndex: 0,
    explanation: "Record-Triggered Flows are the recommended declarative tool for updates to related parent or child records (same-record and cross-record automation) in modern Salesforce environments."
  },
  {
    id: 53,
    category: "Workflow/Process Automation",
    question: "What is the correct order of execution when a record is saved in Salesforce?",
    options: [
      "Validation Rules, Assignment Rules, Triggers, Flows, Escalation Rules",
      "System Validation, Before Triggers, Custom Validation, After Triggers, Flows, Commit",
      "Flows, Validation Rules, Triggers, Workflows, Assignment Rules",
      "Triggers, Workflows, Validation Rules, Assignment Rules, Escalation Rules"
    ],
    correctIndex: 1,
    explanation: "The simplified order of execution is: system validation, before triggers, custom validation rules, duplicate rules, after triggers, assignment rules, auto-response rules, workflow rules, flows (record-triggered), escalation rules, and finally database commit."
  },
  {
    id: 54,
    category: "Workflow/Process Automation",
    question: "A company wants to set up a multi-step approval process for travel expenses where expenses under $1,000 are approved by the manager, and expenses over $1,000 also require VP approval. What tool should be used?",
    options: [
      "Approval Processes",
      "Validation Rules",
      "Autolaunched Flow",
      "Sharing Rules"
    ],
    correctIndex: 0,
    explanation: "Approval Processes in Salesforce allow defining structured steps, entry criteria, and approvers to guide records through official sign-offs."
  },
  {
    id: 55,
    category: "Workflow/Process Automation",
    question: "An administrator is building a Record-Triggered Flow. They want to optimize the flow to run BEFORE the record is saved to the database because it only updates fields on the triggering record. What setting should they select?",
    options: [
      "Actions and Related Records",
      "Fast Field Updates",
      "Scheduled Paths",
      "Asynchronous Path"
    ],
    correctIndex: 1,
    explanation: "Fast Field Updates (Before-Save) in Flow Builder are optimized for updates made to the same record that triggers the flow, executing up to 10x faster than after-save flows."
  },
  {
    id: 56,
    category: "Workflow/Process Automation",
    question: "A support team wants a follow-up task to be created automatically for the Case Owner exactly 3 days after a Case is closed. How can this be configured in a Record-Triggered Flow?",
    options: [
      "Create a Scheduled Flow that runs daily.",
      "Add a Scheduled Path to the Record-Triggered Flow configured for 3 days after Close Date.",
      "Use an Escalation Rule with a task output.",
      "Create a validation rule with a time trigger."
    ],
    correctIndex: 1,
    explanation: "Scheduled Paths in Record-Triggered Flows allow executing actions (like creating tasks) at a specified time offset (e.g., 3 days) relative to a date field on the triggering record."
  },
  {
    id: 57,
    category: "Workflow/Process Automation",
    question: "What can cause a flow transaction to roll back entirely during execution?",
    options: [
      "An element in the flow encounters an error (e.g., fails a validation rule or governor limit).",
      "A user closes their browser window before the flow completes.",
      "The flow runs in 'User' context instead of 'System' context.",
      "The flow contains a Decision element with no default outcome."
    ],
    correctIndex: 0,
    explanation: "In Salesforce, transactions are atomic. If any element in a flow or related trigger encounters an unhandled exception or database error, the entire transaction is rolled back, undoing all database changes made during that transaction."
  },
  {
    id: 58,
    category: "Workflow/Process Automation",
    question: "Which Flow element is used to branch the path of execution based on conditional criteria?",
    options: [
      "Assignment",
      "Decision",
      "Loop",
      "Update Records"
    ],
    correctIndex: 1,
    explanation: "Decision elements evaluate record values and criteria to route the flow's execution down different outcome paths."
  },
  {
    id: 59,
    category: "Workflow/Process Automation",
    question: "An administrator needs to store a temporary calculation value inside a Flow that will not be saved to any database field. What should they create?",
    options: [
      "A Flow Variable",
      "A Custom Field on the Flow object",
      "A Flow Constant",
      "A temporary Record variable"
    ],
    correctIndex: 0,
    explanation: "Variables are placeholders inside a Flow used to store data, collections, or calculated values during the execution of the flow."
  },
  {
    id: 60,
    category: "Workflow/Process Automation",
    question: "A company wants to send an email alert to the Sales VP when a high-value Opportunity is created. The email must use a standard email template. What two resources must the administrator configure?",
    options: [
      "An Email Template and an Email Alert action",
      "An Apex Class and an Email Alert",
      "A Flow variable and a Send Email action",
      "An Auto-Response rule and an Email Alert"
    ],
    correctIndex: 0,
    explanation: "An Email Alert references a specific Email Template and specifies the recipients. The Email Alert action is then called by a Flow to send the email."
  },
  // Add additional ones to get exactly 60 questions:
  {
    id: 61,
    category: "Data and Analytics Management",
    question: "Which report dashboard component should be used to display a single key performance metric, such as Total Closed Won Revenue?",
    options: [
      "Metric Component",
      "Gauge Component",
      "Bar Chart",
      "Table"
    ],
    correctIndex: 0,
    explanation: "A Metric Dashboard Component displays a single key value or score, making it ideal for highlighting high-level totals."
  },
  {
    id: 62,
    category: "Data and Analytics Management",
    question: "An administrator is designing a custom Report Type. What is the impact of choosing 'A records may or may not have related B records'?",
    options: [
      "It represents a database outer join, showing all A records regardless of whether related B records exist.",
      "It represents a database inner join, showing only A records that have B records.",
      "It restricts users from creating report filters.",
      "It automatically deletes orphan B records."
    ],
    correctIndex: 0,
    explanation: "Choosing 'A records may or may not have related B records' in custom Report Types creates a left outer join. This displays A records regardless of whether they have related B records."
  },
  {
    id: 63,
    category: "Data and Analytics Management",
    question: "What is the maximum number of dashboard components that can be placed on a standard Salesforce dashboard?",
    options: [
      "10",
      "20",
      "50",
      "Unlimited"
    ],
    correctIndex: 1,
    explanation: "A standard Salesforce dashboard can contain up to 20 components."
  },
  {
    id: 64,
    category: "Workflow/Process Automation",
    question: "An administrator needs to execute a flow daily at midnight to check for overdue tasks and reassign them. What type of flow should they configure?",
    options: [
      "Record-Triggered Flow",
      "Schedule-Triggered Flow",
      "Screen Flow",
      "Platform Event-Triggered Flow"
    ],
    correctIndex: 1,
    explanation: "Schedule-Triggered Flows run in the background at a specified time and frequency (e.g. daily, weekly, or once), which is ideal for batch queries and reassignments."
  }
];

// If in a module or Node environment, export the questions. Otherwise, bind to window.
if (typeof module !== "undefined" && module.exports) {
  module.exports = ADMIN_PREP_QUESTIONS;
} else {
  window.ADMIN_PREP_QUESTIONS = ADMIN_PREP_QUESTIONS;
}
