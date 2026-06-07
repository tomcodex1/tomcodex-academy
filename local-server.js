import "dotenv/config";
import express from "express";
import { registerAiTrainerRoute } from "./server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "./server/ai-evaluator-route.example.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

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
app.use(express.static("."));

app.listen(port, () => {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  console.log(`Zentom Academy: http://localhost:${port}`);
  console.log(`Gemini Flash: ${configured ? "configured" : "not configured"}`);
});
