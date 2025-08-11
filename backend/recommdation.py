from data import RECIPES
from utils import filter_allergies

def get_recommendations(preferences, allergies):
    filtered_recipes = filter_allergies(RECIPES, allergies)

    # Filter by preferences if provided
    if preferences:
        filtered_recipes = [r for r in filtered_recipes if any(p.lower() in r["diet"].lower() for p in preferences)]

    return filtered_recipes
