import random


def classify_ticket(description: str):
    """
    Temporary mock classifier.
    Replace with real LLM API later.
    """

    categories = ['billing', 'technical', 'account', 'general']
    priorities = ['low', 'medium', 'high', 'critical']

    description_lower = description.lower()

    if "payment" in description_lower or "refund" in description_lower:
        category = "billing"
    elif "error" in description_lower or "bug" in description_lower:
        category = "technical"
    elif "login" in description_lower or "password" in description_lower:
        category = "account"
    else:
        category = random.choice(categories)

    priority = random.choice(priorities)

    return {
        "category": category,
        "priority": priority
    }