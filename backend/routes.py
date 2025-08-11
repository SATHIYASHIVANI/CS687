from flask import Blueprint, request, jsonify
from recommendation import get_recommendations

recipe_routes = Blueprint("recipe_routes", __name__)

@recipe_routes.route("/")
def home():
    return jsonify({"message": "Welcome to SmartRecipe AI API"})

@recipe_routes.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    preferences = data.get("preferences", [])
    allergies = data.get("allergies", [])

    recipes = get_recommendations(preferences, allergies)
    return jsonify({
        "preferences": preferences,
        "allergies": allergies,
        "recommendations": recipes
    })
