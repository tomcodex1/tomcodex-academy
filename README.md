# Salesforce Master Dashboard

Vanilla HTML, CSS, and JavaScript version of Vijay's Salesforce learning dashboard.

## Features

- Navigate through a continuous Salesforce learning path with no fixed day limit
- Switch between Dashboard, AI Trainer, Practice, and Roadmap tabs
- Generate a focused mission and recall test for every study day
- Save completed mission tasks and habits in browser storage
- Search and filter syllabus phases
- Preview the AI trainer form without exposing API keys
- Responsive and keyboard-friendly interface

## Folder Structure

```text
salesforce-master-dashboard/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- app.js
|-- assets/
|   `-- .gitkeep
`-- README.md
```

## How to Run

1. Run `npm install`.
2. Copy `.env.example` to `.env` and set a real Google AI Studio `GEMINI_API_KEY`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

Opening `index.html` directly does not connect Zentom to Gemini because the secure backend routes are unavailable.

### Demo course roles

The access screen is a password-free preview. It never requests passwords, OTP codes, payment information, or third-party credentials. Learner preview follows sequential module locks, while admin curriculum preview opens every Admin and Apex course module. Replace preview roles with backend-verified authorization before using the site for sensitive admin access.

Checklist progress is stored locally in the browser. Clearing site data resets the saved progress.

## Important API Key Rule

**Security warning:** never place Gemini, Groq, OpenRouter, or any provider API key in frontend files such as `js/app.js` or `js/ai-client.js`.
Use centralized backend routes and read API keys only from backend environment variables.

The centralized browser AI client is `js/ai-client.js`. It calls `POST /api/ai/evaluate-mastery`.
Configure the real provider key on the backend using `.env.example`; the browser must never receive the API key.
During static local development, a deterministic fallback evaluator keeps the 80% module-gating flow testable.

Every module mastery attempt uses a fresh minimum of **15 AI-generated questions**. All 15 questions must be answered, and the learner must score at least **80%** before the next module unlocks. The backend evaluator validates the minimum question count again.

## Centralized Gemini AI Trainer

The AI Trainer supports Normal Mode, Flash Mode, and Deep Trainer Mode. The frontend sends only the selected speed mode and student question to `POST /api/ai/trainer`.

Configure the backend with:

```env
AI_PROVIDER=gemini
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_google_ai_studio_api_key_here
AI_SPEED_MODE=auto
```

`GEMINI_MODEL` defaults to `gemini-2.5-flash` in the backend example. Speed-mode prompt switching is defined in `server/ai-trainer-route.example.js`.

The site-wide floating Zentom guide uses automatic mode selection. It chooses a quick, normal, or deep response based on the doubt, so students do not need to choose a mode manually.

## Vercel Deployment

The static academy pages deploy from the project root. Requests under `/api/*` are routed to the Vercel serverless Express handler in `api/index.js`.

Configure `AI_PROVIDER`, `GEMINI_MODEL`, `GEMINI_API_KEY`, and `AI_SPEED_MODE` in the Vercel project environment variables before deploying to production.
