from recipes import RECIPES
from utils import filter_allergies

def get_recommendations(preferences, allergies):
    filtered_recipes = filter_allergies(RECIPES, allergies)
    if preferences:
        filtered_recipes = [
            r for r in filtered_recipes
            if "diet" in r and any(p.lower() in r["diet"].lower() for p in preferences)
        ]
    return filtered_recipes