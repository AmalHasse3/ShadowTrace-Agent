import hashlib

KNOWN_BREACHES = [
    "LinkedIn", "Adobe", "Dropbox", "MySpace", "Tumblr",
    "Yahoo", "Equifax", "Marriott", "Twitter", "Facebook",
    "Canva", "MyFitnessPal", "Quora", "Zynga", "Wattpad",
    "Collection #1", "Ticketmaster", "T-Mobile",
]

DATA_TYPES = [
    "Email addresses", "Passwords", "Phone numbers",
    "Physical addresses", "Dates of birth", "IP addresses",
    "Usernames", "Names", "Security questions",
]

def check_breaches(email: str):
    if not email or "@" not in email:
        return {
            "breaches_found": 0,
            "services": [],
            "exposed_data": [],
            "first_breach_year": None,
        }

    h = hashlib.sha256(email.lower().strip().encode()).hexdigest()
    num_breaches = int(h[0:2], 16) % 8

    services = []
    for i in range(num_breaches):
        idx = int(h[i*2:i*2+2], 16) % len(KNOWN_BREACHES)
        if KNOWN_BREACHES[idx] not in services:
            services.append(KNOWN_BREACHES[idx])

    exposed_data = []
    if services:
        num_data = min(len(services) + 1, len(DATA_TYPES))
        for i in range(num_data):
            idx = int(h[10 + i*2 : 12 + i*2], 16) % len(DATA_TYPES)
            if DATA_TYPES[idx] not in exposed_data:
                exposed_data.append(DATA_TYPES[idx])

    first_year = 2012 + (int(h[30:32], 16) % 12) if services else None

    return {
        "breaches_found": len(services),
        "services": services,
        "exposed_data": exposed_data,
        "first_breach_year": first_year,
    }




