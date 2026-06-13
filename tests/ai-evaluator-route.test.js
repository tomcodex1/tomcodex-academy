/** @jest-environment node */

import express from "express";
import http from "node:http";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";
import { jest } from "@jest/globals";

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const req = http.request({
      hostname: "127.0.0.1",
      port: server.address().port,
      path,
      method,
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
    }, (response) => {
      let text = "";
      response.on("data", (chunk) => { text += chunk; });
      response.on("end", () => resolve({
        status: response.statusCode,
        data: text ? JSON.parse(text) : {}
      }));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

describe("AI Evaluator Route", () => {
  let server;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
    const app = express();
    app.use(express.json());
    registerAiEvaluatorRoute(app);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(async () => {
    global.fetch = originalFetch;
    await new Promise((resolve) => server.close(resolve));
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_API_KEY;
    delete process.env.AI_API_URL;
    delete process.env.AI_MODEL;
  });

  describe("POST /api/ai/evaluate-mastery", () => {
    test("rejects request if minimum answered questions/answers is not met", async () => {
      const response = await request(server, "POST", "/api/ai/evaluate-mastery", {
        questions: ["Q1"],
        answers: ["A1"],
        minimumQuestionCount: 5
      });
      expect(response.status).toBe(400);
      expect(response.data.error).toContain("minimum of 5 answered questions is required");
    });

    test("runs Gemini evaluation when API key is available", async () => {
      process.env.GEMINI_API_KEY = "test-gemini-key";
      const mockResult = {
        score: 85,
        summary: "Good job",
        feedback: [{ question: "Q1", score: 85, feedback: "Correct" }]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(mockResult) }] } }]
        })
      });

      const response = await request(server, "POST", "/api/ai/evaluate-mastery", {
        course: "Admin",
        module: "Basics",
        questions: Array(15).fill("Question"),
        answers: Array(15).fill("Answer")
      });

      expect(response.status).toBe(200);
      expect(response.data.score).toBe(85);
      expect(response.data.passed).toBe(true);
      expect(response.data.summary).toBe("Good job");
      expect(response.data.source).toBe("centralized-ai-api");
    });

    test("handles Gemini evaluation failure gracefully", async () => {
      process.env.GEMINI_API_KEY = "test-gemini-key";
      global.fetch.mockResolvedValueOnce({
        ok: false
      });

      const response = await request(server, "POST", "/api/ai/evaluate-mastery", {
        course: "Admin",
        module: "Basics",
        questions: Array(15).fill("Question"),
        answers: Array(15).fill("Answer")
      });

      expect(response.status).toBe(502);
      expect(response.data.error).toBe("Gemini mastery evaluation failed.");
    });

    test("falls back to generic AI provider when no Gemini key is set but general AI key exists", async () => {
      process.env.AI_API_KEY = "generic-api-key";
      process.env.AI_API_URL = "https://ai-provider.test/v1";
      process.env.AI_MODEL = "llama";

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          score: 90,
          summary: "Great",
          feedback: []
        })
      });

      const response = await request(server, "POST", "/api/ai/evaluate-mastery", {
        course: "Admin",
        module: "Basics",
        questions: Array(15).fill("Question"),
        answers: Array(15).fill("Answer")
      });

      expect(response.status).toBe(200);
      expect(response.data.score).toBe(90);
      expect(response.data.passed).toBe(true);
      expect(response.data.summary).toBe("Great");
    });

    test("fails with 503 if no AI provider is configured", async () => {
      const response = await request(server, "POST", "/api/ai/evaluate-mastery", {
        course: "Admin",
        module: "Basics",
        questions: Array(15).fill("Question"),
        answers: Array(15).fill("Answer")
      });

      expect(response.status).toBe(503);
      expect(response.data.error).toBe("AI evaluator is not configured.");
    });
  });

  describe("POST /api/ai/verify-lab", () => {
    test("rejects request if criteria are missing", async () => {
      const response = await request(server, "POST", "/api/ai/verify-lab", {
        criteria: [],
        studentAnswers: {}
      });
      expect(response.status).toBe(400);
      expect(response.data.error).toContain("No criteria provided");
    });

    test("applies rule-based validation for numbers, minLength and acceptedValues", async () => {
      const criteria = [
        { id: "c1", type: "number", minValue: 10, maxValue: 50, hint: "Enter between 10 and 50" },
        { id: "c2", minLength: 5, hint: "Enter at least 5 chars" },
        { id: "c3", acceptedValues: ["Salesforce", "CRM"], hint: "Must include Salesforce" }
      ];

      const response = await request(server, "POST", "/api/ai/verify-lab", {
        criteria,
        studentAnswers: {
          c1: "25",
          c2: "hello",
          c3: "We use Salesforce here"
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.passed).toBe(true);
      expect(response.data.score).toBe(100);
      expect(response.data.criteriaResults[0].passed).toBe(true);
      expect(response.data.criteriaResults[1].passed).toBe(true);
      expect(response.data.criteriaResults[2].passed).toBe(true);
    });

    test("escalates rule failures to AI verification if key is available", async () => {
      process.env.GEMINI_API_KEY = "test-gemini-key";
      const criteria = [
        { id: "c1", acceptedValues: ["Match"], hint: "Must be correct" }
      ];

      const mockAiResults = [
        { id: "c1", passed: true, feedback: "Understood" }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(mockAiResults) }] } }]
        })
      });

      const response = await request(server, "POST", "/api/ai/verify-lab", {
        criteria,
        studentAnswers: {
          c1: "Unsure answer"
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.passed).toBe(true);
      expect(response.data.criteriaResults[0].passed).toBe(true);
      expect(response.data.criteriaResults[0].confidence).toBe("ai");
    });

    test("fails lab if rules fail and no AI verification is available", async () => {
      const criteria = [
        { id: "c1", acceptedValues: ["Match"], hint: "Must be correct" }
      ];

      const response = await request(server, "POST", "/api/ai/verify-lab", {
        criteria,
        studentAnswers: {
          c1: "Unsure answer"
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.passed).toBe(false);
      expect(response.data.criteriaResults[0].passed).toBe(false);
      expect(response.data.criteriaResults[0].confidence).toBe("needs-ai");
    });
  });
});
