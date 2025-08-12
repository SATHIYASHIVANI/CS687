from flask import Blueprint, request, jsonify
from recommdation import get_recommendations
from recipes import RECIPES

routes = Blueprint('routes', __name__)

@routes.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    preferences = data.get("preferences", [])
    allergies = data.get("allergies", [])
    recommendations = get_recommendations(preferences, allergies)
    return jsonify(recommendations)

@routes.route('/search', methods=['POST'])
def search_recipe():
    data = request.get_json()
    recipe_name = data.get("name", "").lower()
    for recipe in RECIPES:
        if recipe["name"].lower() == recipe_name:
            return jsonify(recipe)
    return jsonify({"error": "Recipe not found"}), 404

@routes.route('/allergy-check', methods=['POST'])
def allergy_check():
    data = request.get_json()
    recipe_name = data.get("name", "").lower()
    user_allergies = [a.lower() for a in data.get("allergies", [])]
    for recipe in RECIPES:
        if recipe["name"].lower() == recipe_name:
            matched_allergies = [
                ingredient for ingredient in recipe["ingredients"]
                if ingredient.lower() in user_allergies
            ]
            return jsonify({
                "recipe": recipe["name"],
                "allergy_risk": len(matched_allergies) > 0,
                "matched_allergies": matched_allergies
            })
    return jsonify({"error": "Recipe not found"}), 404