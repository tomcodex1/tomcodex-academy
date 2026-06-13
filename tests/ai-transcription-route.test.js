/** @jest-environment node */

import express from "express";
import http from "node:http";
import { registerAiTranscriptionRoute } from "../server/ai-transcription-route.js";
import { aiEngine } from "../server/ai-engine.js";
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

describe("AI Transcription Route", () => {
  let server;
  let spyRun;

  beforeEach(async () => {
    spyRun = jest.spyOn(aiEngine, "run").mockImplementation(() => Promise.resolve({ text: "Mock transcription result" }));
    const app = express();
    app.use(express.json({ limit: "20mb" }));
    registerAiTranscriptionRoute(app);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(async () => {
    spyRun.mockRestore();
    await new Promise((resolve) => server.close(resolve));
  });

  test("rejects unsupported audio MIME types", async () => {
    const response = await request(server, "POST", "/api/ai/transcribe-interview", {
      audio: "a".repeat(150),
      mimeType: "audio/invalid",
      language: "en-IN",
      question: "Sample question"
    });
    expect(response.status).toBe(400);
    expect(response.data.error).toContain("A supported microphone recording is required");
  });

  test("rejects audio payloads that are too short", async () => {
    const response = await request(server, "POST", "/api/ai/transcribe-interview", {
      audio: "short",
      mimeType: "audio/webm",
      language: "en-IN",
      question: "Sample question"
    });
    expect(response.status).toBe(400);
    expect(response.data.error).toContain("A supported microphone recording is required");
  });

  test("rejects audio payloads that are too large", async () => {
    const response = await request(server, "POST", "/api/ai/transcribe-interview", {
      audio: "a".repeat(14_000_001),
      mimeType: "audio/webm",
      language: "en-IN",
      question: "Sample question"
    });
    expect(response.status).toBe(413);
    expect(response.data.error).toContain("recording is too long");
  }, 20000);

  test("returns transcribed text successfully", async () => {
    const audioData = "a".repeat(200);
    const response = await request(server, "POST", "/api/ai/transcribe-interview", {
      audio: audioData,
      mimeType: "audio/webm",
      language: "en-IN",
      question: "Sample question"
    });

    expect(response.status).toBe(200);
    expect(response.data.text).toBe("Mock transcription result");
    expect(spyRun).toHaveBeenCalledWith("transcribe", {
      audio: audioData,
      mimeType: "audio/webm",
      language: "en-IN",
      question: "Sample question"
    }, expect.any(Object));
  });

  test("propagates AI engine runner errors with correct status", async () => {
    const errorObj = new Error("Custom transcription runner error");
    errorObj.statusCode = 503;
    spyRun.mockRejectedValueOnce(errorObj);

    const response = await request(server, "POST", "/api/ai/transcribe-interview", {
      audio: "a".repeat(200),
      mimeType: "audio/webm",
      language: "en",
      question: "Sample"
    });

    expect(response.status).toBe(503);
    expect(response.data.error).toBe("Custom transcription runner error");
  });
});
