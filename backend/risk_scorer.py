def calculate_risk(breaches: int, reused_accounts: int):
    score = (breaches * 12) + (reused_accounts * 6)
    if score > 100:
        score = 100
    return score
