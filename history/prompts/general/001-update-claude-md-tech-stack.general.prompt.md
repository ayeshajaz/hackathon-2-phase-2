---
id: 001
title: Update CLAUDE.md with project tech stack
stage: general
date: 2026-02-10
surface: agent
model: claude-haiku-4-5-20251001
feature: none
branch: master
user: C.z
command: none
labels: ["configuration", "tech-stack", "agents", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - CLAUDE.md
tests:
  - none
---

## Prompt

Update the claude.md file based on my project requirements. In this file:

Use Auth Agent for authentication
Use Frontend Agent for frontend development (e.g., Next.js)
Use DB Agent for database design and operations
Use Backend Agent for FastAPI development

Below are my project requirements:
""""
Basic Level Functionality
Objective: Using Claude Code and Spec-Kit Plus transform the console app into a modern multi-user web application with persistent storage.
💡Development Approach: Use the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.
Requirements
Implement all 5 Basic Level features as a web application
Create RESTful API endpoints
Build responsive frontend interface
Store data in Neon Serverless PostgreSQL database
Authentication – Implement user signup/signin using Better Auth
Technology Stack
Layer
Technology
Frontend
Next.js 16+ (App Router)
Backend
Python FastAPI
ORM
SQLModel
Database
Neon Serverless PostgreSQL
Spec-Driven
Claude Code + Spec-Kit Plus
Authentication
Better Auth

Better Auth can be configured to issue JWT (JSON Web Token) tokens when users log in. These tokens are self-contained credentials that include user information and can be verified by any service that knows the secret key.
How It Works
User logs in on Frontend → Better Auth creates a session and issues a JWT token
Frontend makes API call → Includes the JWT token in the Authorization: Bearer <token> header
Backend receives request → Extracts token from header, verifies signature using shared secret
Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL
Backend filters data → Returns only tasks belonging to that user
 """

## Response snapshot

Successfully updated CLAUDE.md file with comprehensive project configuration including:

1. **Project Technology Stack Section** - Added table defining the complete tech stack (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)

2. **Authentication Architecture** - Documented the JWT authentication flow with 5-step process from login to data filtering, including security requirements

3. **Specialized Agent Usage Guidelines** - Created detailed guidelines for four specialized agents:
   - Authentication Agent (auth-security-specialist) - for signup/signin, JWT, Better Auth integration
   - Frontend Agent (nextjs-app-builder) - for Next.js App Router, UI components, forms
   - Database Agent (database-schema-design) - for schema design, SQLModel models, relationships
   - Backend Agent (backend-api-architect) - for FastAPI routes, RESTful endpoints, middleware

4. **Agent Coordination** - Added multi-agent workflow example showing proper sequence: Database → Backend → Auth → Frontend → Optimization

Each agent section includes:
- Clear use cases and responsibilities
- Example invocations with user prompts
- Integration points with other agents

## Outcome

- ✅ Impact: CLAUDE.md now contains project-specific guidance for tech stack and agent usage, ensuring consistent development approach across all features
- 🧪 Tests: No tests required (configuration file)
- 📁 Files: Modified CLAUDE.md (added ~170 lines of project-specific configuration)
- 🔁 Next prompts: Ready to begin feature development using /sp.specify workflow with proper agent delegation
- 🧠 Reflection: Configuration establishes clear boundaries for agent responsibilities and ensures JWT authentication flow is properly understood across all layers

## Evaluation notes (flywheel)

- Failure modes observed: None - configuration completed successfully
- Graders run and results (PASS/FAIL): N/A (configuration task)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Begin first feature specification using /sp.specify to test agent coordination workflow
