import "dotenv/config";
import express from "express";
import { registerAiTrainerRoute } from "./server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "./server/ai-evaluator-route.example.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));
registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
app.use(express.static("."));

app.listen(port, () => {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  console.log(`Zentom Academy: http://localhost:${port}`);
  console.log(`Gemini Flash: ${configured ? "configured" : "not configured"}`);
});
