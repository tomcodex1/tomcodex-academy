/** @jest-environment node */

import { aiEngine } from "../server/ai-engine.js";

describe("AI Engine Fallback Support", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    process.env.GEMINI_API_KEY = "test-gemini-key";
    process.env.OPENROUTER_API_KEY = "test-openrouter-key";
    process.env.GROQ_API_KEY = "test-groq-key";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GROQ_API_KEY;
  });

  test("automatically falls back to OpenRouter when Gemini returns 429", async () => {
    let geminiCalled = 0;
    let openRouterCalled = 0;

    global.fetch = jest.fn(async (url, options) => {
      if (url.includes("generativelanguage.googleapis.com")) {
        geminiCalled++;
        return {
          status: 429,
          ok: false,
          statusText: "Too Many Requests"
        };
      }
      if (url.includes("openrouter.ai")) {
        openRouterCalled++;
        return {
          status: 200,
          ok: true,
          json: async () => ({
            choices: [{ message: { content: "This is OpenRouter fallback answer" } }]
          })
        };
      }
      return { status: 404, ok: false };
    });

    const result = await aiEngine.callGemini({
      key: "test-gemini-key",
      contents: [{ parts: [{ text: "Hello" }] }],
      retries: 1
    });

    expect(geminiCalled).toBe(1);
    expect(openRouterCalled).toBe(1);
    expect(result.text).toBe("This is OpenRouter fallback answer");
    expect(result.model).toBe("openrouter/meta-llama/llama-3.3-70b-instruct:free");
  });

  test("falls back to Groq when OpenRouter key is not set", async () => {
    delete process.env.OPENROUTER_API_KEY;

    let geminiCalled = 0;
    let groqCalled = 0;

    global.fetch = jest.fn(async (url, options) => {
      if (url.includes("generativelanguage.googleapis.com")) {
        geminiCalled++;
        return {
          status: 429,
          ok: false,
          statusText: "Too Many Requests"
        };
      }
      if (url.includes("groq.com")) {
        groqCalled++;
        return {
          status: 200,
          ok: true,
          json: async () => ({
            choices: [{ message: { content: "This is Groq fallback answer" } }]
          })
        };
      }
      return { status: 404, ok: false };
    });

    const result = await aiEngine.callGemini({
      key: "test-gemini-key",
      contents: [{ parts: [{ text: "Hello" }] }],
      retries: 1
    });

    expect(geminiCalled).toBe(1);
    expect(groqCalled).toBe(1);
    expect(result.text).toBe("This is Groq fallback answer");
    expect(result.model).toBe("groq/llama-3.3-70b-versatile");
  });
});
