import requests
from concurrent.futures import ThreadPoolExecutor

PLATFORMS = {
    "GitHub":    "https://github.com/{u}",
    "Reddit":    "https://www.reddit.com/user/{u}/about.json",
    "GitLab":    "https://gitlab.com/{u}",
    "Steam":     "https://steamcommunity.com/id/{u}/",
    "Twitch":    "https://www.twitch.tv/{u}",
    "DEV":       "https://dev.to/{u}",
    "Medium":    "https://medium.com/@{u}",
    "Pinterest": "https://www.pinterest.com/{u}/",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/json",
}

def _check_one(item):
    name, url_template, username = item
    url = url_template.format(u=username)
    try:
        r = requests.get(url, headers=HEADERS, timeout=6, allow_redirects=True)
        if r.status_code == 200 and len(r.text) > 200:
            return name
    except requests.exceptions.RequestException:
        pass
    return None

def check_username(username: str):
    if not username or not username.strip():
        return {
            "reused_accounts": 0,
            "platforms_found": [],
            "platforms_checked": list(PLATFORMS.keys()),
            "risk_level": "low",
        }

    username = username.strip()
    tasks = [(name, tmpl, username) for name, tmpl in PLATFORMS.items()]

    found = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(_check_one, tasks):
            if result:
                found.append(result)

    count = len(found)
    if count >= 5:
        risk = "high"
    elif count >= 2:
        risk = "medium"
    else:
        risk = "low"

    return {
        "reused_accounts": count,
        "platforms_found": found,
        "platforms_checked": list(PLATFORMS.keys()),
        "risk_level": risk,
    }
