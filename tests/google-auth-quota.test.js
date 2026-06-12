/** @jest-environment node */

import express from "express";
import http from "node:http";
import { registerHostedAuthRoutes, checkAiQuota } from "../server/hosted-auth.js";
import { registerAiTrainerRoute } from "../server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";
import { registerAiCodeReviewRoute } from "../server/ai-code-review-route.example.js";
import { registerAiInterviewRoute } from "../server/ai-interview-route.example.js";
import { registerAiTranscriptionRoute } from "../server/ai-transcription-route.js";

function createFetchMock() {
  const values = new Map();
  const sets = new Map();
  return jest.fn(async (url, options) => {
    // Check if it's a Gemini API call
    if (url.includes("generativelanguage.googleapis.com")) {
      const bodyObj = JSON.parse(options.body || "{}");
      const promptText = bodyObj.contents?.[0]?.parts?.[0]?.text || "";
      let mockResponse = {};
      if (promptText.includes("creating a mastery test")) {
        mockResponse = {
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify(["Q1: Sample Question?", "Q2: Question?", "Q3: Question?", "Q4: Question?", "Q5: Question?", "Q6: Question?", "Q7: Question?", "Q8: Question?", "Q9: Question?", "Q10: Question?", "Q11: Question?", "Q12: Question?", "Q13: Question?", "Q14: Question?", "Q15: Question?"]) }]
            }
          }]
        };
      } else if (promptText.includes("evaluating a student's answers")) {
        mockResponse = {
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify({ score: 90, summary: "Excellent", feedback: [] }) }]
            }
          }]
        };
      } else if (promptText.includes("Review the Salesforce artifact") || promptText.includes("Code Reviewer")) {
        mockResponse = {
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify({ score: 85, summary: "Good code", findings: [] }) }]
            }
          }]
        };
      } else if (promptText.includes("interview questions for a")) {
        mockResponse = {
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify([
                { question: "Why Salesforce? 1", type: "technical", keywords: [], answerGuide: "" },
                { question: "Why Salesforce? 2", type: "technical", keywords: [], answerGuide: "" },
                { question: "Why Salesforce? 3", type: "technical", keywords: [], answerGuide: "" },
                { question: "Why Salesforce? 4", type: "technical", keywords: [], answerGuide: "" },
                { question: "Why Salesforce? 5", type: "technical", keywords: [], answerGuide: "" }
              ]) }]
            }
          }]
        };
      } else {
        mockResponse = {
          candidates: [{
            content: {
              parts: [{ text: "Simulated response from Gemini" }]
            }
          }]
        };
      }
      return { ok: true, json: async () => mockResponse };
    }
    
    // Otherwise, treat as Redis command
    const [command, ...args] = JSON.parse(options.body);
    let result = null;
    if (command === "GET") result = values.get(args[0]) ?? null;
    if (command === "SET") {
      if (args.includes("NX") && values.has(args[0])) result = null;
      else {
        values.set(args[0], args[1]);
        result = "OK";
      }
    }
    if (command === "DEL") result = values.delete(args[0]) ? 1 : 0;
    if (command === "SADD") {
      const set = sets.get(args[0]) || new Set();
      const previousSize = set.size;
      set.add(args[1]);
      sets.set(args[0], set);
      result = set.size - previousSize;
    }
    if (command === "SMEMBERS") result = [...(sets.get(args[0]) || [])];
    return { ok: true, json: async () => ({ result }) };
  });
}

function request(server, method, path, body, cookie = "") {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const request = http.request({
      hostname: "127.0.0.1",
      port: server.address().port,
      path,
      method,
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload), Cookie: cookie }
    }, (response) => {
      let text = "";
      response.on("data", (chunk) => { text += chunk; });
      response.on("end", () => resolve({
        status: response.statusCode,
        headers: response.headers,
        data: text ? (contentType(response) === "json" ? JSON.parse(text) : text) : {}
      }));
    });
    request.on("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

function contentType(response) {
  const type = response.headers["content-type"] || "";
  if (type.includes("json")) return "json";
  return "text";
}

describe("Google Auth and Quotas", () => {
  let server;

  beforeEach(async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    process.env.AUTH_SESSION_SECRET = "a-long-test-session-secret";
    process.env.AI_PROVIDER = "gemini";
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    
    global.fetch = createFetchMock();
    const app = express();
    app.use(express.json());
    registerHostedAuthRoutes(app);
    
    // Mount quota check
    app.post(/\/api\/ai\/.*/, checkAiQuota);
    
    // Register routes
    registerAiTrainerRoute(app);
    registerAiEvaluatorRoute(app);
    registerAiCodeReviewRoute(app);
    registerAiInterviewRoute(app);
    registerAiTranscriptionRoute(app);
    
    // Add a test AI route protected by checkAiQuota
    app.post("/api/ai/test-endpoint", (req, res) => {
      res.json({ success: true });
    });
    
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "AUTH_SESSION_SECRET", "AI_PROVIDER", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"].forEach((key) => delete process.env[key]);
  });

  test("GET /api/auth/google redirects to mock auth page by default", async () => {
    const res = await request(server, "GET", "/api/auth/google");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/google-mock-auth.html");
  });

  test("GET /api/auth/google/callback registers / logs in user in mock mode", async () => {
    const res = await request(server, "GET", "/api/auth/google/callback?mock=true&email=vijay@gmail.com&name=Vijay");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/learner-dashboard");
    expect(res.headers["set-cookie"]).toBeDefined();
    
    // Check session
    const cookie = String(res.headers["set-cookie"]?.[0] || "").split(";")[0];
    const sessionRes = await request(server, "GET", "/api/auth-session", null, cookie);
    expect(sessionRes.status).toBe(200);
    expect(sessionRes.data.identity.email).toBe("vijay@gmail.com");
    expect(sessionRes.data.identity.name).toBe("Vijay");
    expect(sessionRes.data.identity.usage.requestsToday).toBe(0);
  });

  test("checkAiQuota rate limits POST requests to 50", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=quota-test@gmail.com&name=QuotaTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    for (let i = 0; i < 50; i++) {
      const res = await request(server, "POST", "/api/ai/test-endpoint", {}, cookie);
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
    }
    
    const limitRes = await request(server, "POST", "/api/ai/test-endpoint", {}, cookie);
    expect(limitRes.status).toBe(429);
    expect(limitRes.data.error).toBe("Daily AI Limit Reached");
    
    const settingsRes = await request(server, "PUT", "/api/student-settings", { personalApiKey: "my-custom-key" }, cookie);
    expect(settingsRes.status).toBe(200);
    
    const bypassRes = await request(server, "POST", "/api/ai/test-endpoint", {}, cookie);
    expect(bypassRes.status).toBe(200);
  });

  test("trainer endpoint resolves personal API key", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=trainer-test@gmail.com&name=TrainerTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    await request(server, "PUT", "/api/student-settings", { personalApiKey: "custom-trainer-key" }, cookie);
    
    const res = await request(server, "POST", "/api/ai/trainer", { topic: "Flow", answerMode: "Simple Mode", doubt: "What is flow?" }, cookie);
    expect(res.status).toBe(200);
    expect(res.data.answer).toContain("Simulated response");
  });

  test("questions generator endpoint resolves personal API key", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=q-test@gmail.com&name=QTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    await request(server, "PUT", "/api/student-settings", { personalApiKey: "custom-q-key" }, cookie);
    
    const res = await request(server, "POST", "/api/ai/generate-mastery-questions", { course: "Admin", module: "Basics", lessonPoints: [], practice: [] }, cookie);
    expect(res.status).toBe(200);
    expect(res.data.questions).toHaveLength(15);
  });

  test("interview simulator endpoint resolves personal API key", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=int-test@gmail.com&name=IntTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    await request(server, "PUT", "/api/student-settings", { personalApiKey: "custom-int-key" }, cookie);
    
    const res = await request(server, "POST", "/api/ai/interview-questions", { role: "Salesforce Administrator", difficulty: "Beginner", format: "technical", count: 3 }, cookie);
    expect(res.status).toBe(200);
    expect(res.data.questions).toHaveLength(3);
  });

  test("code reviewer endpoint resolves personal API key", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=code-test@gmail.com&name=CodeTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    await request(server, "PUT", "/api/student-settings", { personalApiKey: "custom-code-key" }, cookie);
    
    const res = await request(server, "POST", "/api/ai/code-review", { artifactType: "apex", focus: "full", artifact: "public class SampleTriggerHandler { public void handle() {} }" }, cookie);
    expect(res.status).toBe(200);
    expect(res.data.score).toBe(85);
  });

  test("mastery evaluator endpoint resolves personal API key and performs evaluation", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=eval-test@gmail.com&name=EvalTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    await request(server, "PUT", "/api/student-settings", { personalApiKey: "custom-eval-key" }, cookie);
    await request(server, "POST", "/api/student-upgrade", {}, cookie);
    
    const res = await request(server, "POST", "/api/ai/evaluate-mastery", {
      course: "Admin",
      module: "Security",
      questions: Array(15).fill("Question?"),
      answers: Array(15).fill("Answer text"),
      lessonPoints: []
    }, cookie);
    expect(res.status).toBe(200);
    expect(res.data.score).toBe(90);
    expect(res.data.passed).toBe(true);
  });

  test("mastery evaluator endpoint blocks free-tier users requesting gated modules", async () => {
    const authRes = await request(server, "GET", "/api/auth/google/callback?mock=true&email=gate-test@gmail.com&name=GateTest");
    const cookie = String(authRes.headers["set-cookie"]?.[0] || "").split(";")[0];
    
    // Attempt to evaluate "Security" module (index > 0) without upgrading to Founder
    const res = await request(server, "POST", "/api/ai/evaluate-mastery", {
      course: "Admin",
      module: "Security",
      questions: Array(15).fill("Question?"),
      answers: Array(15).fill("Answer text"),
      lessonPoints: []
    }, cookie);
    
    expect(res.status).toBe(403);
    expect(res.data.error).toBe("Founder Access Required");
    expect(res.data.message).toContain("locked under the Free Starter tier");
  });
});
