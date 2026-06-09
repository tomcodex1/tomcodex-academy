/** @jest-environment node */

import express from "express";
import http from "node:http";
import { registerHostedAuthRoutes } from "../server/hosted-auth.js";

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
        data: text ? JSON.parse(text) : {},
        cookie: String(response.headers["set-cookie"]?.[0] || "").split(";")[0]
      }));
    });
    request.on("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

describe("hosted authentication", () => {
  let server;

  beforeEach(async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    process.env.AUTH_SESSION_SECRET = "a-long-test-session-secret";
    process.env.TUTOR_EMAIL = "admin@tcx.com";
    process.env.TUTOR_ACCESS_CODE = "TutorCode123";
    global.fetch = createRedisMock();
    const app = express();
    app.use(express.json());
    registerHostedAuthRoutes(app);
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "AUTH_SESSION_SECRET", "TUTOR_EMAIL", "TUTOR_ACCESS_CODE"].forEach((key) => delete process.env[key]);
  });

  test("supports complete student and tutor account workflows", async () => {
    const account = { name: "Vijay Radhakrishnan", email: "tomcodex1@gmail.com", password: "Student123" };
    const signup = await request(server, "POST", "/api/student-signup", account);
    expect(signup.status).toBe(201);
    expect(signup.data).not.toHaveProperty("passwordHash");
    expect((await request(server, "POST", "/api/student-signup", account)).status).toBe(409);
    expect((await request(server, "POST", "/api/student-login", { email: account.email, password: "wrong" })).status).toBe(401);

    const login = await request(server, "POST", "/api/student-login", { email: account.email, password: account.password });
    expect(login.status).toBe(200);
    expect((await request(server, "GET", "/api/auth-session", null, login.cookie)).data.authenticated).toBe(true);
    expect((await request(server, "PUT", "/api/student-progress", { key: "unsupported", value: "x" }, login.cookie)).status).toBe(400);
    expect((await request(server, "PUT", "/api/student-progress", { key: "tomcodex.learningRecords.v1", value: "[]" }, login.cookie)).status).toBe(200);

    const reset = await request(server, "POST", "/api/student-forgot-password", { email: account.email });
    expect(reset.data.resetCode).toMatch(/^\d{6}$/);
    expect((await request(server, "POST", "/api/student-reset-password", { email: account.email, resetCode: reset.data.resetCode, newPassword: "Changed123" })).status).toBe(200);
    expect((await request(server, "POST", "/api/student-login", { email: account.email, password: "Changed123" })).status).toBe(200);

    const tutor = await request(server, "POST", "/api/tutor-login", { email: "admin@tcx.com", accessCode: "TutorCode123" });
    expect(tutor.status).toBe(200);
    const students = await request(server, "GET", "/api/tutor-students", null, tutor.cookie);
    expect(students.data.totals.registered).toBe(1);
    expect(students.data.students[0].email).toBe(account.email);
  });
});
