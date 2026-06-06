import express from "express";
import path from "node:path";
import { registerAiTrainerRoute } from "../server/ai-trainer-route.example.js";
import { registerAiEvaluatorRoute } from "../server/ai-evaluator-route.example.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
registerAiTrainerRoute(app);
registerAiEvaluatorRoute(app);
app.get("/", (_request, response) => response.sendFile(path.resolve("index.html")));
app.use(express.static(path.resolve(".")));

export default app;
