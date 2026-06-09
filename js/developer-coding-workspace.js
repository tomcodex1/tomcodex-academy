(function () {
  const STORAGE_KEY = "tomcodex.developerCodingProgress.v1";
  const exercises = [
    {
      id: "apex-bulk-service",
      category: "apex",
      difficulty: "Intermediate",
      title: "Bulkify an Apex service",
      prompt: "Refactor the service so it assigns Account owners to many Leads without querying or performing DML inside a loop.",
      requirements: ["Collect company names before querying.", "Query Accounts once.", "Update Leads in one DML operation.", "Declare intentional sharing behavior."],
      starter: `public class LeadAssignmentService {
  public static void assignOwners(List<Lead> leads) {
    for (Lead item : leads) {
      Account account = [SELECT Id, OwnerId FROM Account WHERE Name = :item.Company LIMIT 1];
      item.OwnerId = account.OwnerId;
      update item;
    }
  }
}`,
      checks: [
        ["Uses a collection", /set\s*</i],
        ["Uses a map for matching", /map\s*</i],
        ["Queries Account records", /\[\s*select[\s\S]*from\s+account/i],
        ["Performs collection DML", /\bupdate\s+\w+\s*;/i],
        ["Declares sharing", /\b(with|inherited)\s+sharing\b/i]
      ],
      coaching: "Explain how the design behaves for 200 records, missing Accounts, duplicate company names, and restricted users."
    },
    {
      id: "apex-secure-query",
      category: "apex",
      difficulty: "Advanced",
      title: "Secure an Apex account search",
      prompt: "Write an Apex method that searches Accounts by name while enforcing sharing, CRUD, and field-level access.",
      requirements: ["Use bind variables.", "Enforce sharing.", "Use USER_MODE or stripInaccessible.", "Return a limited result set."],
      starter: `public class AccountSearchService {
  public static List<Account> search(String searchTerm) {
    // Implement a secure Account search.
    return new List<Account>();
  }
}`,
      checks: [
        ["Declares sharing", /\b(with|inherited)\s+sharing\b/i],
        ["Uses a bind variable", /:\w+/],
        ["Enforces object and field access", /with\s+user_mode|security\.stripinaccessible/i],
        ["Limits returned records", /\blimit\s+\d+/i]
      ],
      coaching: "Discuss why dynamic SOQL needs escaping or bind variables, and how restricted-user tests prove access behavior."
    },
    {
      id: "soql-opportunity-query",
      category: "soql",
      difficulty: "Intermediate",
      title: "Write a selective Opportunity query",
      prompt: "Return open Opportunities closing this quarter for a supplied Account, including Account name and Opportunity owner name.",
      requirements: ["Filter by AccountId.", "Filter open opportunities.", "Filter the close-date range.", "Select relationship fields and order results."],
      starter: `SELECT Id
FROM Opportunity
WHERE AccountId = :accountId`,
      checks: [
        ["Selects Account relationship field", /account\.name/i],
        ["Selects owner relationship field", /owner\.name/i],
        ["Filters open records", /isclosed\s*=\s*false/i],
        ["Filters CloseDate", /closedate/i],
        ["Orders results", /order\s+by/i]
      ],
      coaching: "Explain selectivity, indexes, expected data volume, and how the query will be used without causing repeated execution."
    },
    {
      id: "soql-aggregate",
      category: "soql",
      difficulty: "Advanced",
      title: "Aggregate pipeline by stage",
      prompt: "Write SOQL that summarizes total pipeline amount and opportunity count by StageName for open Opportunities.",
      requirements: ["Use SUM and COUNT.", "Group by StageName.", "Exclude closed Opportunities.", "Order by total amount."],
      starter: `SELECT StageName
FROM Opportunity`,
      checks: [
        ["Uses SUM", /sum\s*\(\s*amount\s*\)/i],
        ["Uses COUNT", /count\s*\(/i],
        ["Groups by stage", /group\s+by\s+stagename/i],
        ["Excludes closed records", /isclosed\s*=\s*false/i],
        ["Orders aggregate result", /order\s+by/i]
      ],
      coaching: "Explain AggregateResult aliases, null amounts, report alternatives, and when this query may need additional filters."
    },
    {
      id: "lwc-imperative",
      category: "lwc",
      difficulty: "Intermediate",
      title: "Build a resilient imperative Apex call",
      prompt: "Implement an LWC method that calls searchAccounts imperatively and provides loading, success, empty, and error states.",
      requirements: ["Use async/await or Promise handling.", "Set loading state.", "Catch failures.", "Avoid unsafe DOM manipulation."],
      starter: `import { LightningElement } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchService.search';

export default class AccountSearch extends LightningElement {
  searchTerm = '';
  accounts = [];

  async handleSearch() {
    // Implement the call and states.
  }
}`,
      checks: [
        ["Calls imported Apex method", /searchaccounts\s*\(/i],
        ["Handles asynchronous result", /\bawait\b|\.then\s*\(/i],
        ["Tracks loading state", /isloading/i],
        ["Handles errors", /\bcatch\b|\.catch\s*\(/i],
        ["Represents empty state", /isempty|accounts\.length|!this\.accounts/i]
      ],
      coaching: "Explain when @wire is a better choice, how errors reach the UI, and how Jest tests cover success, empty, and failure paths."
    },
    {
      id: "lwc-event",
      category: "lwc",
      difficulty: "Beginner",
      title: "Dispatch a typed LWC event",
      prompt: "Write a child-component method that dispatches an accountselected CustomEvent containing only the selected Account Id.",
      requirements: ["Use CustomEvent.", "Use a lowercase event name.", "Place only the Id in detail.", "Dispatch the event."],
      starter: `import { LightningElement, api } from 'lwc';

export default class AccountRow extends LightningElement {
  @api accountId;

  handleSelect() {
    // Notify the parent.
  }
}`,
      checks: [
        ["Creates CustomEvent", /new\s+customevent\s*\(/i],
        ["Uses accountselected event", /['"]accountselected['"]/i],
        ["Provides detail payload", /detail\s*:/i],
        ["Dispatches event", /this\.dispatchevent\s*\(/i]
      ],
      coaching: "Explain event naming, data minimization, bubbles/composed choices, and how the parent handles the event."
    },
    {
      id: "debug-trigger",
      category: "debugging",
      difficulty: "Advanced",
      title: "Diagnose a failing trigger",
      prompt: "Rewrite the trigger to avoid governor-limit failures and null-pointer errors when many Contacts are inserted.",
      requirements: ["No query inside the loop.", "Handle missing AccountId.", "Use a collection lookup.", "Keep DML out of the trigger loop."],
      starter: `trigger ContactRegion on Contact (before insert) {
  for (Contact item : Trigger.new) {
    Account parent = [SELECT Id, BillingCountry FROM Account WHERE Id = :item.AccountId];
    item.Region__c = parent.BillingCountry;
  }
}`,
      checks: [
        ["Collects Account Ids", /set\s*<\s*id\s*>/i],
        ["Uses a map lookup", /map\s*<\s*id\s*,\s*account\s*>/i],
        ["Handles missing AccountId", /accountid\s*(!=|==)\s*null|null\s*(!=|==)\s*\w+\.accountid/i],
        ["Queries Accounts", /\[\s*select[\s\S]*from\s+account/i]
      ],
      coaching: "Explain the original failure modes, bulk transaction behavior, and tests for 200 Contacts plus Contacts without Accounts."
    },
    {
      id: "debug-test",
      category: "debugging",
      difficulty: "Intermediate",
      title: "Strengthen an Apex test",
      prompt: "Write a meaningful test for a bulk Lead assignment service, including assertions and a restricted or negative scenario.",
      requirements: ["Create isolated test data.", "Use Test.startTest/stopTest.", "Process multiple records.", "Assert outcomes and a negative path."],
      starter: `@IsTest
private class LeadAssignmentServiceTest {
  @IsTest
  static void assignsOwners() {
    // Build a meaningful bulk test.
  }
}`,
      checks: [
        ["Creates test data", /\binsert\b/i],
        ["Uses startTest", /test\.starttest\s*\(/i],
        ["Uses stopTest", /test\.stoptest\s*\(/i],
        ["Uses assertions", /system\.assert|assertEquals|assertNotEquals/i],
        ["Exercises multiple records", /list\s*</i]
      ],
      coaching: "Explain why coverage alone is insufficient and which assertions prove correct business behavior and limit safety."
    }
  ];

  const el = (id) => document.getElementById(id);
  let visibleExercises = [...exercises];
  let activeExercise = exercises[0];

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function commonSafetyChecks(exercise, answer) {
    if (["apex", "debugging"].includes(exercise.category)) {
      return [
        ["No SOQL inside a loop", !/for\s*\([^)]*\)\s*\{[\s\S]{0,500}\[\s*select/i.test(answer)],
        ["No DML inside a loop", !/for\s*\([^)]*\)\s*\{[\s\S]{0,500}\b(insert|update|delete|upsert)\b/i.test(answer)],
        ["No dynamic SOQL string concatenation", !/database\.query\s*\([^)]*\+/i.test(answer)],
        ["No hard-coded credentials or tokens", !/(password|secret|token)\s*=\s*['"][^'"]+['"]/i.test(answer)]
      ];
    }
    if (exercise.category === "lwc") {
      return [
        ["Avoids unsafe innerHTML", !/\.innerhtml\s*=/i.test(answer)],
        ["Avoids eval execution", !/\beval\s*\(/i.test(answer)]
      ];
    }
    return [];
  }

  function renderExerciseOptions() {
    const category = el("codingCategorySelect").value;
    visibleExercises = exercises.filter((exercise) => category === "all" || exercise.category === category);
    el("codingExerciseSelect").innerHTML = visibleExercises.map((exercise) => `<option value="${exercise.id}">${exercise.title}</option>`).join("");
    activeExercise = visibleExercises[0];
    renderExercise();
  }

  function renderExercise() {
    el("codingExerciseMeta").textContent = `${activeExercise.category.toUpperCase()} | ${activeExercise.difficulty}`;
    el("codingExerciseTitle").textContent = activeExercise.title;
    el("codingExercisePrompt").textContent = activeExercise.prompt;
    el("codingRequirements").innerHTML = activeExercise.requirements.map((requirement) => `<span>${requirement}</span>`).join("");
    el("codingAnswerInput").value = activeExercise.starter;
    el("codingValidationResult").innerHTML = "<p>Validate your solution to receive interview-focused feedback.</p>";
  }

  function renderCompletedCount() {
    el("codingCompletedCount").textContent = Object.values(loadProgress()).filter((item) => item.score >= 75).length;
  }

  function validateSolution() {
    const answer = el("codingAnswerInput").value;
    const conceptChecks = activeExercise.checks.map(([label, pattern]) => [label, pattern.test(answer)]);
    const safetyChecks = commonSafetyChecks(activeExercise, answer);
    const allChecks = [...conceptChecks, ...safetyChecks];
    const passed = allChecks.filter(([, result]) => result).length;
    const score = Math.round((passed / allChecks.length) * 100);
    const progress = loadProgress();
    progress[activeExercise.id] = { score: Math.max(score, progress[activeExercise.id]?.score || 0), updatedAt: new Date().toISOString() };
    saveProgress(progress);
    const band = score >= 75 ? "score-green" : score >= 50 ? "score-yellow" : "score-red";
    el("codingValidationResult").innerHTML = `<div class="coding-validation-heading ${band}"><strong>${score >= 75 ? "Interview-ready solution" : score >= 50 ? "Good direction, refine it" : "Important requirements are missing"}</strong><b>${score}%</b></div><div class="coding-check-list">${allChecks.map(([label, result]) => `<div class="${result ? "passed" : "failed"}">${result ? "Passed" : "Missing"}: ${label}</div>`).join("")}</div><p class="coding-coaching-note"><b>Interview coaching:</b> ${activeExercise.coaching}</p>`;
    window.TomCodexLearning?.record("coding-practice", score >= 75 ? 8 : 3, `${activeExercise.title}: ${score}%`);
    window.dispatchEvent(new CustomEvent("tomcodex:coding-progress"));
    renderCompletedCount();
  }

  el("codingCategorySelect").addEventListener("change", renderExerciseOptions);
  el("codingExerciseSelect").addEventListener("change", (event) => {
    activeExercise = exercises.find((exercise) => exercise.id === event.target.value) || exercises[0];
    renderExercise();
  });
  el("loadCodingStarterBtn").addEventListener("click", renderExercise);
  el("validateCodingAnswerBtn").addEventListener("click", validateSolution);

  renderExerciseOptions();
  renderCompletedCount();
})();
