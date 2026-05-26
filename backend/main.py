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
    return {"message": "ShadowTrace Agent Backend Running"}


def _security_status(risk_score: int) -> str:
    if risk_score >= 75:
        return "HIGH RISK"
    if risk_score >= 40:
        return "MEDIUM RISK"
    if risk_score >= 15:
        return "LOW RISK"
    return "MINIMAL RISK"


def _build_analysis(email, username, breach_data, username_data, risk_score):
    status = _security_status(risk_score)
    bf = breach_data["breaches_found"]
    services = breach_data["services"]
    exposed = breach_data.get("exposed_data", [])
    first_year = breach_data.get("first_breach_year")
    ra = username_data["reused_accounts"]
    platforms = username_data.get("platforms_found", [])

    lines = ["ShadowTrace Agent completed investigation.\n", "Threat Assessment:"]

    if bf == 0 and ra == 0:
        lines.append(
            f"No known breaches were found for {email}, and the username "
            f"'{username}' was not detected on the platforms checked. "
            "Exposure profile is minimal."
        )
    elif bf == 0:
        lines.append(
            f"The email {email} was not found in known breach databases, but "
            f"the username '{username}' appears on {ra} platform(s), "
            "indicating potential cross-site account linkage."
        )
    elif ra == 0:
        lines.append(
            f"The email {email} was found in {bf} known data breach(es), "
            f"exposing credentials and personal data. The username "
            f"'{username}' was not detected on the platforms checked."
        )
    else:
        lines.append(
            f"The email {email} appears in {bf} known data breach(es), and "
            f"the username '{username}' was identified on {ra} platform(s). "
            "The combination of breach exposure and cross-platform identity "
            "reuse elevates credential-stuffing risk."
        )

    if services:
        lines.append("")
        lines.append("Breach Exposure:")
        lines.append("Affected services: " + ", ".join(services) + ".")
        if exposed:
            lines.append("Data types exposed: " + ", ".join(exposed) + ".")
        if first_year:
            lines.append(f"Earliest known breach: {first_year}.")

    if platforms:
        lines.append("")
        lines.append("Attack Surface Analysis:")
        lines.append(
            f"The username '{username}' was located on: "
            + ", ".join(platforms) + "."
        )
        lines.append(
            "Attackers who obtain credentials from one breach can attempt "
            "the same username on these platforms (credential stuffing)."
        )

    lines.append("")
    lines.append(f"Security Status: {status}")
    return "\n".join(lines)


def _build_recommendations(breach_data, username_data, risk_score):
    recs = []
    bf = breach_data["breaches_found"]
    services = breach_data["services"]
    exposed = breach_data.get("exposed_data", [])
    ra = username_data["reused_accounts"]
    platforms = username_data.get("platforms_found", [])

    if bf > 0:
        svc_preview = ", ".join(services[:3]) + ("..." if len(services) > 3 else "")
        recs.append(f"Rotate passwords on the {bf} breached service(s): {svc_preview}")
        if "Passwords" in exposed:
            recs.append("Assume leaked passwords are public; revoke them anywhere they were reused")
        if "Phone numbers" in exposed:
            recs.append("Watch for SMS phishing and SIM-swap attempts on the exposed phone number")

    if ra > 0:
        plat_preview = ", ".join(platforms[:3]) + ("..." if len(platforms) > 3 else "")
        recs.append(f"Audit your accounts on {plat_preview} and rotate passwords there")
        recs.append("Use a different username on high-value accounts (banking, primary email)")

    if risk_score >= 40:
        recs.append("Enable multi-factor authentication on every account that supports it")
        recs.append("Subscribe to a breach-monitoring service for ongoing alerts")
    elif risk_score >= 15:
        recs.append("Enable multi-factor authentication on your primary email and financial accounts")

    if not recs:
        recs.append("Your current exposure footprint is minimal — maintain good hygiene")
        recs.append("Use a password manager with unique passwords per site")
        recs.append("Enable MFA where available")

    return recs


@app.post("/scan")
def scan(data: ScanRequest):
    breach_data = check_breaches(data.email)
    username_data = check_username(data.username)
    risk_score = calculate_risk(
        breach_data["breaches_found"],
        username_data["reused_accounts"],
    )

    ai_analysis = _build_analysis(
        data.email, data.username, breach_data, username_data, risk_score
    )
    recommendations = _build_recommendations(breach_data, username_data, risk_score)

    return {
        "email": data.email,
        "username": data.username,
        "breaches_found": breach_data["breaches_found"],
        "services": breach_data["services"],
        "exposed_data": breach_data.get("exposed_data", []),
        "first_breach_year": breach_data.get("first_breach_year"),
        "reused_accounts": username_data["reused_accounts"],
        "platforms_found": username_data.get("platforms_found", []),
        "platforms_checked": username_data.get("platforms_checked", []),
        "username_risk_level": username_data.get("risk_level", "low"),
        "risk_score": risk_score,
        "security_status": _security_status(risk_score),
        "ai_analysis": ai_analysis,
        "recommendations": recommendations,
        "agent_steps": [
            "Planning investigation",
            "Checking breach exposure",
            "Analyzing username reuse",
            "Calculating risk",
            "Generating remediation report",
        ],
    }


@app.post("/approve-report")
def approve_report():
    return {
        "status": "success",
        "message": "Remediation report created successfully.",
        "github_issue": "ShadowTrace remediation issue created.",
        "agent_action": "GitHub MCP workflow simulated successfully.",
    }


