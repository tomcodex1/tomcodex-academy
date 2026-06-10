/** @jest-environment node */

import express from "express";
import http from "node:http";
import { checkAiQuota, registerHostedAcademyAiCoreRoute, registerHostedAuthRoutes } from "../server/hosted-auth.js";

function createRedisMock() {
  const values = new Map();
  const sets = new Map();
  return jest.fn(async (_url, options) => {
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
    const req = http.request({
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
        data: text ? JSON.parse(text) : {},
        cookie: String(response.headers["set-cookie"]?.[0] || "").split(";")[0]
      }));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

describe("Academy AI Core route", () => {
  let server;

  beforeEach(async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    process.env.AUTH_SESSION_SECRET = "a-long-test-session-secret";
    process.env.FREE_DAILY_AI_LIMIT = "50";
    global.fetch = createRedisMock();

    const app = express();
    app.use(express.json());
    registerHostedAuthRoutes(app);
    app.use(/\/api\/ai\/.*/, checkAiQuota);
    registerHostedAcademyAiCoreRoute(app);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "AUTH_SESSION_SECRET",
      "FREE_DAILY_AI_LIMIT"
    ].forEach((key) => delete process.env[key]);
  });

  test("verifies Admin Module 1 and persists Skill Passport progress", async () => {
    const signup = await request(server, "POST", "/api/student-signup", {
      name: "Academy Student",
      email: "academy-ai-core@example.com",
      password: "Student123"
    });
    expect(signup.status).toBe(201);

    const body = {
      task: "verify-lab",
      moduleId: "admin-module-1",
      skillId: "salesforce-platform-foundations",
      module: "Salesforce Platform Foundations",
      params: {
        moduleId: "admin-module-1",
        skillId: "salesforce-platform-foundations",
        lab: {
          labId: "admin-module-1-lab",
          labTitle: "Admin Module 1 Hands-on Lab",
          passingScore: 80,
          criteria: [
            { id: "accountName", question: "What is the exact Account Name you created?", type: "text", expectedKeywords: ["TomCodeX Training Institute"] },
            { id: "contactLastName", question: "What is the exact Contact Last Name you created?", type: "text", expectedKeywords: ["Demo Student"] },
            { id: "contactAccount", question: "Which Account is your Contact linked to?", type: "text", expectedKeywords: ["TomCodeX Training Institute"] },
            { id: "listViewName", question: "What is the name of the Account list view you created?", type: "text", expectedKeywords: ["My Active Accounts"] },
            { id: "listViewColumns", question: "Name the two columns visible in your Account list view.", type: "text", expectedKeywords: ["Account Name", "Phone"], minimumMatches: 2 }
          ]
        },
        studentAnswers: {
          accountName: "TomCodeX Training Institute",
          contactLastName: "Demo Student",
          contactAccount: "TomCodeX Training Institute",
          listViewName: "My Active Accounts",
          listViewColumns: "Account Name, Phone"
        }
      }
    };

    const result = await request(server, "POST", "/api/ai/run", body, signup.cookie);
    expect(result.status).toBe(200);
    expect(result.data.ok).toBe(true);
    expect(result.data.data.score).toBe(100);
    expect(result.data.skillPassportUpdate.status).toBe("verified");

    const progress = await request(server, "GET", "/api/student-progress", null, signup.cookie);
    const attempts = JSON.parse(progress.data.progress["tomcodex.adminLabAttempts.v1"]);
    const passport = JSON.parse(progress.data.progress["tomcodex.skillPassport.v1"]);
    const unlocks = JSON.parse(progress.data.progress["tomcodex.moduleUnlocks.v1"]);

    expect(attempts["admin-module-1"]).toHaveLength(1);
    expect(attempts["admin-module-1"][0].status).toBe("Verified");
    expect(attempts["admin-module-1:summary"].bestScore).toBe(100);
    expect(passport["salesforce-platform-foundations"].status).toBe("Verified");
    expect(passport["salesforce-platform-foundations"].pocStage).toBe("Foundation Started");
    expect(unlocks["admin-module-1"].labVerified).toBe(true);
    expect(unlocks["admin-module-1"].modulePracticeCompleted).toBe(true);
    expect(unlocks["admin-module-1"].skillPassportUpdated).toBe(true);
    expect(unlocks["admin-module-1"].nextModuleUnlockCandidate).toBe(true);
    expect(unlocks["admin-module-1"].nextModuleAccess).toBe("upgrade_required");
  });
});
