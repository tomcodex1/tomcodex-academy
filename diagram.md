# Salesforce Master Dashboard Architecture

## System Overview

The Salesforce Master Dashboard is an AI-powered learning platform designed to help users learn Salesforce through personalized learning paths, hands-on projects, and interview preparation. The system provides a comprehensive learning experience from basic administration to advanced development and architecture.

## Architecture Components

### Frontend Components

1. **Authentication Layer**
   - Login/Registration System
   - Role-based Access (Student/Tutor)
   - Secure authentication with verification

2. **Dashboard Interface**
   - Main Dashboard (dashboard.html)
   - Learning Progress Tracking
   - Personalized Learning Path
   - AI Tutor Interface

3. **Learning Modules**
   - Admin Foundations
   - Apex Development
   - Flow Automation
   - Lightning Web Components
   - Integration & DevOps

4. **AI Features**
   - AI Tutor (Zentom AI)
   - Practice Lab
   - Interview Preparation
   - Code Review AI

5. **Progress Tracking**
   - Daily Missions
   - Habit Tracker
   - Skill Progress Meters
   - Continuous Learning Path

### Backend Services

1. **Learning Service**
   - Curriculum Management
   - Progress Tracking
   - Personalized Path Generation

2. **AI Services**
   - Natural Language Processing
   - Code Evaluation
   - Interview Simulation
   - Feedback Generation

3. **Data Management**
   - User Profiles
   - Learning Records
   - Course Materials
   - Assessment Results

## User Flow

1. **Authentication**
   - User login/registration
   - Role verification (Student/Tutor)
   - Session management

2. **Learning Journey**
   - Personalized learning path generation
   - Daily mission assignment
   - Progress tracking and feedback
   - Continuous skill development

3. **AI Interaction**
   - Question answering
   - Code review
   - Interview practice
   - Performance evaluation

## Key Features

1. **Personalized Learning**
   - Adaptive learning paths
   - Skill-based progression
   - Continuous career development

2. **Hands-on Practice**
   - Salesforce org integration
   - Project-based learning
   - Real-world scenarios

3. **AI-Powered Support**
   - 24/7 AI tutor
   - Instant feedback
   - Personalized guidance

4. **Career Preparation**
   - Interview simulation
   - Certification guidance
   - Workplace skills development

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (with Tailwind CSS)
- **Client-Side Logic**: Vanilla JavaScript with modular components
- **AI Integration**: Custom AI client (ai-client.js)
- **Data Storage**: LocalStorage for user state and progress
- **Authentication**: Custom auth system with role-based access
- **UI Components**: Custom components with consistent styling

## File Structure

```
salesforce-master-dashboard/
├── index.html              # Main login/entry page
├── dashboard.html          # Main dashboard interface
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication
│   ├── ai-client.js        # AI integration
│   ├── learning-service.js # Learning management
│   └── ...                 # Other feature modules
├── assets/                 # Images and static assets
├── server/                 # Backend services (if applicable)
└── docs/                   # Documentation
```

## Data Flow

1. **User Interaction** → Frontend Components
2. **Frontend Components** → AI Services (via ai-client.js)
3. **AI Services** → Backend Processing
4. **Backend Processing** → Data Storage/Retrieval
5. **Data Storage/Retrieval** → UI Updates

## Security Considerations

- Role-based access control
- Secure authentication
- Client-side data validation
- Protection of user learning data
