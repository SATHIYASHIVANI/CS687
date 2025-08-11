def filter_allergies(recipes, allergies):
    if not allergies:
        return recipes
    return [r for r in recipes if r["allergen_free"]]
