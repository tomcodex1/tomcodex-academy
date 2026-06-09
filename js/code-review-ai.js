(function () {
  const ENDPOINT = "/api/ai/code-review";
  const HISTORY_KEY = "tomcodex.aiCodeReviews.v1";
  const samples = {
    apex: `public without sharing class LeadService {
  public static void assignLeads(List<Lead> leads) {
    for (Lead item : leads) {
      Account account = [SELECT Id, OwnerId FROM Account WHERE Name = :item.Company LIMIT 1];
      item.OwnerId = account.OwnerId;
      update item;
    }
  }
}`,
    trigger: `trigger LeadAssignment on Lead (before insert, before update) {
  for (Lead item : Trigger.new) {
    Account account = [SELECT OwnerId FROM Account WHERE Name = :item.Company LIMIT 1];
    item.OwnerId = account.OwnerId;
  }
}`,
    lwc: `import { LightningElement } from 'lwc';
export default class AccountPanel extends LightningElement {
  connectedCallback() {
    this.template.querySelector('.result').innerHTML = window.location.search;
  }
}`,
    flow: `Record-triggered Flow on Case after save
- Get Records inside Loop for each Case Contact
- Update Records inside Loop
- No fault connectors
- Runs as system context without sharing`,
    configuration: `Customer support users receive System Administrator profile.
All external users can read and edit Account, Contact, and Case.
No field-level security review or restricted-user testing is planned.`
  };
  let loadedSample = "";

  const el = (id) => document.getElementById(id);

  function loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY));
      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }

  function saveHistory(item) {
    const history = loadHistory();
    history.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
  }

  function finding(severity, category, title, detail) {
    return { severity, category, title, detail };
  }

  function localReview({ artifactType, focus, context, artifact }) {
    const text = `${context}\n${artifact}`.toLowerCase();
    const findings = [];
    const add = (...args) => findings.push(finding(...args));
    const codeType = artifactType === "apex" || artifactType === "trigger";

    if (codeType && /\bwithout\s+sharing\b/i.test(artifact)) add("high", "Security", "Class bypasses record sharing", "Use with sharing or inherited sharing unless a documented system-context requirement exists.");
    if (codeType && !/\b(with|inherited|without)\s+sharing\b/i.test(artifact) && artifactType === "apex") add("medium", "Security", "Sharing behavior is implicit", "Declare with sharing or inherited sharing so record-access behavior is intentional.");
    if (codeType && /\[\s*select[\s\S]*?\]/i.test(artifact) && !/with\s+user_mode|security\.stripinaccessible/i.test(artifact)) add("high", "Security", "CRUD and field access are not enforced", "Prefer WITH USER_MODE for queries or Security.stripInaccessible() when graceful degradation is required.");
    if (codeType && /for\s*\([^)]*\)\s*\{[\s\S]{0,500}\[\s*select/i.test(artifact)) add("high", "Performance", "SOQL query appears inside a loop", "Collect identifiers first and query once outside the loop to stay within governor limits.");
    if (codeType && /for\s*\([^)]*\)\s*\{[\s\S]{0,500}\b(insert|update|delete|upsert)\b/i.test(artifact)) add("high", "Performance", "DML appears inside a loop", "Add changed records to a collection and perform one bulk DML operation after the loop.");
    if (artifactType === "trigger" && !/handler|service/i.test(artifact)) add("medium", "Maintainability", "Trigger logic is not delegated", "Keep the trigger focused on context routing and move business logic into a handler or service class.");
    if (codeType && !/@istest|system\.assert|assertEquals/i.test(artifact)) add("medium", "Testing", "No test evidence was provided", "Add positive, negative, bulk, and restricted-user tests with meaningful assertions.");
    if (codeType && /catch\s*\([^)]*\)\s*\{\s*\}/i.test(artifact)) add("high", "Reliability", "Exception is silently swallowed", "Log or surface actionable error details and preserve a recoverable failure path.");
    if (codeType && /http(request|response)|send\s*\(/i.test(artifact) && !/namedcredential|callout:/i.test(artifact)) add("high", "Security", "Callout may not use a Named Credential", "Use a Named Credential or External Credential instead of hard-coded endpoints or secrets.");
    if (artifactType === "lwc" && /\.innerhtml\s*=/i.test(artifact)) add("high", "Security", "Untrusted HTML may reach the DOM", "Avoid innerHTML for dynamic content; render values through the template so the framework can escape them.");
    if (artifactType === "lwc" && !/catch\s*\(|error/i.test(artifact)) add("medium", "Reliability", "No visible error handling", "Provide loading, empty, and error states for data and Apex failures.");
    if (artifactType === "flow" && /inside loop|get records inside loop|update records inside loop/i.test(text)) add("high", "Performance", "Database operation is described inside a Flow loop", "Move Get Records and write operations outside loops and process collections in bulk.");
    if (artifactType === "flow" && !/fault/i.test(text)) add("high", "Reliability", "Flow fault handling is missing", "Connect fault paths to logging and a useful user or operator message.");
    if ((artifactType === "flow" || artifactType === "configuration") && /system (administrator|context)|without sharing|all .* users/i.test(text)) add("high", "Security", "Access appears broader than necessary", "Apply least privilege and test the experience with restricted user personas.");
    if (artifactType === "configuration" && !/permission set|least privilege|field-level|fls/i.test(text)) add("medium", "Security", "Access design lacks least-privilege evidence", "Document object, field, record, and class access using permission sets and restricted personas.");
    if (!/test|assert|acceptance|verify|validation/i.test(text)) add("medium", "Testing", "Validation strategy is not described", "Define success, failure, bulk, permission, and rollback scenarios before deployment.");
    if (focus !== "full") {
      const focusMap = { security: "security", performance: "performance", testing: "testing" };
      findings.sort((a, b) => Number(b.category.toLowerCase() === focusMap[focus]) - Number(a.category.toLowerCase() === focusMap[focus]));
    }
    if (!findings.length) add("passed", "Quality", "No common static risks detected", "The submitted artifact avoided the high-signal issues checked locally. Continue with peer review and org-level testing.");

    const penalty = { high: 18, medium: 9, low: 4, passed: 0 };
    const score = Math.max(10, 100 - findings.reduce((sum, item) => sum + penalty[item.severity], 0));
    const highest = findings.find((item) => item.severity === "high") || findings.find((item) => item.severity === "medium");
    return {
      score,
      summary: score >= 85 ? "Strong foundation with targeted improvements" : score >= 65 ? "Review required before deployment" : "High-risk issues need attention",
      nextStep: highest ? `Fix first: ${highest.title}. Then run the review again and add proof through tests.` : "Validate the implementation with restricted users and a peer reviewer.",
      findings,
      source: "local-salesforce-rules"
    };
  }

  async function requestReview(payload) {
    try {
      const response = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(result.findings)) throw new Error(result.error || "AI review failed");
      return result;
    } catch {
      return localReview(payload);
    }
  }

  function metric(label, value) {
    const card = document.createElement("div");
    card.className = "review-metric";
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = value;
    span.textContent = label;
    card.append(strong, span);
    return card;
  }

  function renderResult(result) {
    el("reviewEmptyState").hidden = true;
    el("reviewResults").hidden = false;
    el("reviewSource").textContent = result.source === "centralized-ai-api" ? "Centralized AI review" : "Local Salesforce rules";
    el("reviewSummary").textContent = result.summary;
    el("reviewScore").textContent = `${result.score}`;
    const counts = ["high", "medium", "passed"].map((severity) => result.findings.filter((item) => item.severity === severity).length);
    el("reviewMetrics").replaceChildren(metric("High priority", counts[0]), metric("Medium priority", counts[1]), metric("Checks passed", counts[2]));
    el("findingCount").textContent = `${result.findings.length} finding${result.findings.length === 1 ? "" : "s"}`;
    el("reviewFindings").replaceChildren(...result.findings.map((item) => {
      const card = document.createElement("article");
      card.className = `review-finding ${["high", "medium", "low", "passed"].includes(item.severity) ? item.severity : "medium"}`;
      const heading = document.createElement("div");
      const severity = document.createElement("em");
      const title = document.createElement("strong");
      const detail = document.createElement("p");
      severity.textContent = item.severity || "medium";
      title.textContent = `${item.category || "Quality"}: ${item.title || "Review finding"}`;
      detail.textContent = item.detail || "Review and validate this implementation detail.";
      heading.append(severity, title);
      card.append(heading, detail);
      return card;
    }));
    el("reviewNextStep").textContent = result.nextStep;
  }

  function renderHistory() {
    const history = loadHistory();
    if (!history.length) {
      const empty = document.createElement("p");
      empty.textContent = "No AI reviews saved yet.";
      empty.className = "text-sm text-slate-500";
      el("reviewHistory").replaceChildren(empty);
      return;
    }
    el("reviewHistory").replaceChildren(...history.slice(0, 6).map((item) => {
      const card = document.createElement("article");
      card.className = "review-history-card";
      const title = document.createElement("strong");
      const summary = document.createElement("p");
      const meta = document.createElement("span");
      title.textContent = `${item.artifactType.toUpperCase()} review · ${item.score}/100`;
      summary.textContent = item.summary;
      meta.textContent = new Date(item.createdAt).toLocaleString();
      card.append(title, summary, meta);
      return card;
    }));
  }

  el("loadSampleBtn").addEventListener("click", () => {
    loadedSample = samples[el("artifactType").value];
    el("reviewArtifact").value = loadedSample;
  });
  el("artifactType").addEventListener("change", () => {
    if (el("reviewArtifact").value === loadedSample) {
      loadedSample = samples[el("artifactType").value];
      el("reviewArtifact").value = loadedSample;
    }
  });
  el("clearHistoryBtn").addEventListener("click", () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); });
  el("aiReviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = { artifactType: el("artifactType").value, focus: el("reviewFocus").value, context: el("reviewContext").value.trim(), artifact: el("reviewArtifact").value.trim() };
    if (payload.artifact.length < 20) return;
    const button = el("runReviewBtn");
    button.disabled = true;
    button.textContent = "Reviewing...";
    const result = await requestReview(payload);
    button.disabled = false;
    button.textContent = "Run AI code review";
    renderResult(result);
    saveHistory({ artifactType: payload.artifactType, focus: payload.focus, score: result.score, summary: result.summary, createdAt: new Date().toISOString() });
    window.TomCodexLearning?.record("task", 10, `Completed AI ${payload.artifactType} review (${result.score}/100)`);
    renderHistory();
  });

  renderHistory();
})();
