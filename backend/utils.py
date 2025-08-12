def filter_allergies(recipes, allergies):
    if not allergies:
        return recipes
    allergies = [a.lower() for a in allergies]
    filtered = []
    for recipe in recipes:
        if not any(ingredient.lower() in allergies for ingredient in recipe["ingredients"]):
            filtered.append(recipe)
    return filtered