def calculate_risk(breaches: int, reused_accounts: int):

    score = (breaches * 15) + (reused_accounts * 3)

    if score > 100:
        score = 100

    return score