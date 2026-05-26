# ShadowTrace Agent

ShadowTrace Agent is a cybersecurity investigation platform designed to help people understand and reduce their online exposure risks.

## Overview

ShadowTrace Agent helps users investigate whether their information may have been exposed online through breached accounts, reused usernames, or unsafe security habits.

The platform combines Gemini reasoning, Google Cloud Agent Builder, and investigation tools to:

* Check breach exposure
* Analyze username reuse
* Estimate cybersecurity risk
* Generate remediation recommendations
* Create security reports after user approval

The goal is to make cybersecurity investigations easier to understand and more accessible for everyday users.

This project is being developed for the **Google Cloud Rapid Agent Hackathon**.

---

# Problem

Most people have no easy way to understand how exposed they are online.

Emails, usernames, and credentials are frequently reused across platforms, and many users never realize their information has appeared in public breach datasets until after an attack occurs.

Existing cybersecurity tools are often:

* Difficult for non-technical users
* Expensive or enterprise-focused
* Reactive instead of preventative

ShadowTrace Agent was designed to simplify exposure investigations and help users take action before small security issues become larger risks.

---

# Features

## AI Agent Workflow

The agent performs a multi-step investigation workflow:

1. User submits exposure scan request
2. Agent plans investigation steps
3. Breach exposure analysis begins
4. Username reuse analysis begins
5. Risk score is calculated
6. Remediation report is generated
7. User approval is requested
8. GitLab MCP creates remediation issue/report

---

# Tech Stack

## Frontend

* Next.js
* Tailwind CSS
* shadcn/ui

## Backend

* FastAPI
* Python
* Pydantic

## AI + Agent Orchestration

* Gemini
* Google Cloud Agent Builder

## MCP Integration

* GitLab MCP

## Deployment

* Vercel (Frontend)
* Render/Railway (Backend)

---

# Project Architecture

```text
Frontend → FastAPI Backend → Gemini Agent Builder
          ↓
     Investigation Tools
          ↓
     Risk Analysis
          ↓
     Approval Workflow
          ↓
        GitLab MCP
          ↓
  Remediation Report Creation
```

---

# Repository Structure

```text
shadowtrace-agent/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── lib/
│
├── backend/
│   ├── agents/
│   ├── tools/
│   ├── reports/
│   ├── database/
│   ├── main.py
│   └── requirements.txt
│
├── docs/
├── demo/
└── README.md
```

---

# Backend Tools

The backend contains multiple investigation tools:

| Tool               | Purpose                      |
| ------------------ | ---------------------------- |
| breach_checker     | Investigates breach exposure |
| username_checker   | Checks username reuse        |
| risk_scorer        | Calculates cyber risk        |
| report_generator   | Creates remediation reports  |
| gitlab_mcp_creator | Creates remediation issues   |

---

# API Endpoints

## POST /scan

Starts a cybersecurity exposure investigation.

### Request

```json
{
  "email": "user@example.com",
  "username": "shadowuser"
}
```

### Response

```json
{
  "breaches_found": 3,
  "reused_accounts": 12,
  "risk_score": 82,
  "recommendations": [
    "Enable MFA",
    "Rotate passwords"
  ]
}
```

---

## POST /approve-report

Triggers GitLab MCP remediation report creation.

---

# Frontend Requirements

The UI includes:

* Email input
* Username input
* Start Scan button
* Findings dashboard
* Risk score display
* Agent reasoning timeline
* Approve Report button

---

# Agent Timeline Example

```text
✓ Planning investigation
✓ Checking breach exposure
✓ Analyzing username reuse
✓ Calculating risk
✓ Generating remediation report
⏳ Awaiting approval
```

---

# Risk Scoring

ShadowTrace calculates multiple cybersecurity risk categories:

| Category             | Score |
| -------------------- | ----- |
| Credential Exposure  | 92    |
| Password Reuse       | 70    |
| Username Correlation | 55    |
| Public Exposure      | 40    |

Overall risk is calculated from combined investigation results.

---

# GitLab MCP Integration

After user approval, the system automatically creates:

* Security remediation issue
* Markdown investigation report
* Recommended action checklist

Example remediation issue:

```markdown
# ShadowTrace Security Report

## Findings
- Email found in multiple breaches
- Username reused across services

## Risk Score
82/100

## Recommended Actions
- Rotate passwords
- Enable MFA
- Remove exposed accounts
```

---

# Local Development Setup

## Backend

```bash
cd backend
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Deployment

## Frontend

Deploy to Vercel.

## Backend

Deploy to Render or Railway.

---

# Hackathon Alignment

This project satisfies the Google Cloud Rapid Agent Hackathon requirements:

* Gemini-powered reasoning
* Google Cloud Agent Builder orchestration
* Multi-step agent workflow
* Meaningful MCP integration
* Autonomous task execution beyond chat

---

# Demo Workflow

1. User enters email + username
2. Agent begins investigation
3. Exposure findings are generated
4. Risk score is calculated
5. Remediation recommendations are generated
6. User approves action
7. GitLab MCP creates remediation issue

---

# Future Improvements

* Real breach database integrations
* Real-time monitoring
* Browser extension support
* Enterprise dashboard
* Threat intelligence enrichment
* Automated credential rotation
* SOC analyst integrations

---

# Team Roles

## Team Lead

* Project management
* Demo coordination
* Devpost submission
* Final testing

## Backend Developer

* FastAPI backend
* Risk scoring
* Database logic

## Frontend Developer

* Dashboard UI
* Workflow visualization
* Approval system

## Gemini + MCP Developer

* Agent Builder orchestration
* Gemini reasoning
* GitLab MCP integration

---

# License

MIT License

---

# Vision

ShadowTrace Agent is intended to evolve into a practical cybersecurity assistant that helps individuals and organizations identify exposure risks early, understand their security posture, and take informed remediation steps.
