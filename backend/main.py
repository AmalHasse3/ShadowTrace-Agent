from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from breach_checker import check_breaches
from username_checker import check_username
from risk_scorer import calculate_risk

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    email: str
    username: str


@app.get("/")
def home():
    return {
        "message": "ShadowTrace Agent Backend Running"
    }


@app.post("/scan")
def scan(data: ScanRequest):

    breach_data = check_breaches(data.email)

    username_data = check_username(data.username)

    risk_score = calculate_risk(
        breach_data["breaches_found"],
        username_data["reused_accounts"]
    )

    ai_analysis = """
ShadowTrace Agent completed investigation successfully.

Threat Assessment:
Multiple indicators suggest elevated exposure risk caused by
credential leakage and username reuse patterns.

Attack Surface Analysis:
The detected reuse behavior increases the probability of
credential stuffing and account compromise attempts.

Recommended Actions:
- Enable MFA on all accounts
- Rotate exposed passwords immediately
- Avoid username reuse across platforms
- Monitor future credential leak exposure
- Audit connected services regularly

Security Status:
HIGH RISK
"""

    return {
        "email": data.email,

        "username": data.username,

        "breaches_found": breach_data["breaches_found"],

        "services": breach_data["services"],

        "reused_accounts": username_data["reused_accounts"],

        "risk_score": risk_score,

        "ai_analysis": ai_analysis,

        "recommendations": [
            "Enable MFA",
            "Rotate passwords",
            "Avoid username reuse",
            "Monitor future credential leaks",
            "Audit connected accounts"
        ],

        "agent_steps": [
            "Planning investigation",
            "Checking breach exposure",
            "Analyzing username reuse",
            "Calculating risk",
            "Generating remediation report"
        ]
    }


@app.post("/approve-report")
def approve_report():

    return {
        "status": "success",

        "message": "Remediation report created successfully.",

        "github_issue":
        "ShadowTrace remediation issue created.",

        "agent_action":
        "GitHub MCP workflow simulated successfully."
    }