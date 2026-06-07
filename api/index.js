import express from "express";
import path from "node:path";
import { registerAiTrainerRoute } from "../server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";

const app = express();

app.use((_request, response, next) => {
  response.set({
    "Content-Security-Policy": "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "Permissions-Policy": "camera=(), geolocation=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  });
  next();
});
app.use(express.json({ limit: "1mb" }));
registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
app.get("/", (_request, response) => response.sendFile(path.resolve("index.html")));
app.use(express.static(path.resolve(".")));

export default app;
