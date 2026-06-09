# Salesforce Master Dashboard

Vanilla HTML, CSS, and JavaScript version of Vijay's Salesforce learning dashboard.

## Features

### Core Learning Platform
- Use one consistent global navigation across Home, Dashboard, courses, AI tools, community, progress, and account access
- Show `Sign in to Dashboard` for logged-out visitors and open the protected learner workspace after student authentication
- Identify student and tutor sessions in navigation, and show safe signed-in student profile and learning summary data on the learner dashboard
- Navigate through a continuous Salesforce learning path with no fixed day limit
- Switch between Dashboard, AI Trainer, Practice, and Roadmap tabs
- Generate a focused mission and recall test for every study day
- Save completed mission tasks and habits in browser storage
- Search and filter syllabus phases
- Preview the AI trainer form without exposing API keys
- Responsive and keyboard-friendly interface

### Enhanced Analytics Dashboard
- Visual learning progress tracking with interactive charts
- Skill gap analysis and personalized recommendations
- Time distribution and performance metrics
- Export learning data for external analysis

### Gamification System
- Achievement badges for learning milestones
- Learning streak tracking and rewards
- Community leaderboards for friendly competition
- Points system for different learning activities

### Mobile Optimization
- Mobile-first responsive design
- Offline learning capabilities with service worker
- Push notifications for learning reminders
- Progressive Web App (PWA) features for app-like experience

### Social Learning Features
- **Study Groups**: Join collaborative learning groups focused on specific Salesforce topics
- **Discussion Forums**: Engage in community discussions, ask questions, and share knowledge
- **Peer Review System**: Get feedback on your code, configurations, and automation solutions from experienced community members

### Advanced AI Features
- **Personalized Learning Paths**: Build an adaptive milestone plan from course mastery, learning activity, interview practice, goals, and weekly availability
- Reorder recommendations around detected skill gaps and preferred learning style
- Track personalized milestones and estimated completion dates in browser storage
- **Code Review AI**: Review Apex, triggers, LWC JavaScript, Flow designs, and configuration notes for Salesforce-specific security, scale, testing, and maintainability risks
- Use centralized AI when configured, with a deterministic local Salesforce-rules fallback for development
- **Adaptive Interview Simulation**: Generate technical, behavioral, or mixed role-based interviews, target a job description, score STAR story coverage, and adapt follow-up coaching to weak answer dimensions

## Folder Structure

```text
salesforce-master-dashboard/
|-- index.html
|-- analytics-enhanced.html
|-- gamification-dashboard.html
|-- study-groups.html
|-- discussion-forums.html
|-- peer-review.html
|-- personalized-paths.html
|-- code-review-ai.html
|-- css/
|   |-- style.css
|   |-- analytics-enhanced.css
|   |-- gamification.css
|   |-- study-groups.css
|   |-- discussion-forums.css
|   |-- peer-review.css
|   |-- personalized-paths.css
|   |-- code-review-ai.css
|   |-- mobile-optimized.css
|   |-- offline-indicator.css
|   |-- floating-guide.css
|   |-- floating-guide-auto.css
|   |-- auth.css
|   |-- course.css
|   |-- course-fixes.css
|   |-- interview.css
`-- js/
    |-- app.js
    |-- analytics-enhanced.js
    |-- gamification.js
    |-- study-groups.js
    |-- discussion-forums.js
    |-- peer-review.js
    |-- personalized-paths.js
    |-- code-review-ai.js
    |-- mobile-features.js
    |-- offline-indicator.js
    |-- ai-client.js
    |-- auth.js
    |-- course-admin.js
    |-- course-apex.js
    |-- course-flow.js
    |-- course-lwc.js
    |-- course-mastery.js
    |-- course-guide.js
    |-- floating-guide.js
    |-- interview.js
    |-- learner-reminders.js
    |-- learner-sync.js
    |-- learning-records.js
    |-- voice-input.js
|-- assets/
|-- api/
|-- server/
|-- data/
|-- sw.js
|-- manifest.json
`-- README.md
```

## How to Run

1. Run `npm install`.
2. Copy `.env.example` to `.env` and set a real Google AI Studio `GEMINI_API_KEY`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

### Progressive Web App Features
- To install the app as a PWA, look for the "Install" prompt in your browser or add to home screen
- The app supports offline functionality through a service worker
- Enable notifications for learning reminders and achievement alerts

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

Code Review AI sends review requests to `POST /api/ai/code-review` using the same server-only Gemini configuration. When Gemini is unavailable, the browser applies a deterministic Salesforce rules review so security, bulkification, testing, and reliability checks remain testable during local development.

The AI Interviewer sends question-generation requests to `POST /api/ai/interview-questions`. It falls back to the local role-based question bank when Gemini is unavailable.

## Vercel Deployment

The static academy pages deploy from the project root. Requests under `/api/*` are routed to the Vercel serverless Express handler in `api/index.js`.

Configure `AI_PROVIDER`, `GEMINI_MODEL`, `GEMINI_API_KEY`, and `AI_SPEED_MODE` in the Vercel project environment variables before deploying to production.

### Production account system

For persistent student registration, secure sign-in, password reset, progress synchronization, and tutor student tracking:

1. Connect an Upstash Redis database from the Vercel Marketplace.
2. Add `AUTH_SESSION_SECRET` with a long random value.
3. Add `TUTOR_EMAIL` and `TUTOR_ACCESS_CODE` for restricted tutor access.
4. Add `RESEND_API_KEY` and `RESET_FROM_EMAIL` from a verified Resend domain for password-reset email delivery.
5. Redeploy Production after the variables are available.

The Upstash integration provides `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Passwords are stored only as salted scrypt hashes, and authenticated access uses signed HTTP-only cookies.
