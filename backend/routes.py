from flask import Blueprint, request, jsonify
from recipes import RECIPES
from ollama_ai import generate_recipe_with_ollama
import logging
from urllib.parse import quote

routes = Blueprint('routes', __name__)

# Add endpoint to return all recipes as a JSON array
@routes.route('/recipes', methods=['GET'])
def get_all_recipes():
    return jsonify(RECIPES)

@routes.route('/chat-cook', methods=['POST'])
def chat_cook():
    data = request.get_json()
    user_message = (data.get('message') or '').strip()
    if not user_message:
        return jsonify({'error': 'No message provided.'}), 400

    # Use Ollama to generate a chat response
    from ollama_ai import generate_chat_response_with_ollama
    ai_reply = generate_chat_response_with_ollama(user_message)
    return jsonify({'reply': ai_reply})

@routes.route('/search', methods=['POST'])
def search_recipe():
    data = request.get_json(silent=True) or {}
    search_term = (data.get("name") or "").strip().lower()
    logging.info(f"[SEARCH] term='{search_term}'")

    # 1) Return all if empty (NO AI CALL)
    if not search_term:
        logging.info("[SEARCH] returning all recipes")
        return jsonify(RECIPES)

    # 2) Local partial matches (fast path)
    results = [
        r for r in RECIPES
        if (search_term in r["name"].lower())
           or (search_term in r.get("cuisine", "").lower())
           or any(search_term in ing.lower() for ing in r.get("ingredients", []))
    ]
    if results:
        logging.info(f"[SEARCH] local matches: {[r['name'] for r in results]}")
        return jsonify(results)
    # 3) AI fallback (only now do we invoke the model, and only once)
    logging.info("[SEARCH] no local match; calling Ollama")
    try:
        ai = generate_recipe_with_ollama(search_term)
        # Always use a generic placeholder image for AI recipes if no image is available
        import os
        def ensure_image_url(obj):
            # Try name-based placeholder first
            name = (obj.get("name") or "recipe").lower().replace(" ", "_")
            placeholder_path = f"c:/Users/Shivani/Desktop/Capstone Project/CS687/backend/static/placeholder_{name}.jpg"
            url_base = "http://10.30.16.92:5000/static"
            if os.path.exists(placeholder_path):
                obj["image_url"] = f"{url_base}/placeholder_{name}.jpg"
            else:
                obj["image_url"] = obj.get("image_url") or f"{url_base}/placeholder_recipe.jpg"
            return obj

        if isinstance(ai, dict) and ai.get("error") == "no_recipe":
            logging.info("[SEARCH] AI says no_recipe")
            return jsonify({"error": "AI could not generate a recipe for this query."}), 404
        if isinstance(ai, dict) and ai and not ai.get("error"):
            ai = ensure_image_url(ai)
            return jsonify([ai])
        if isinstance(ai, dict) and "ai_text" not in ai and "error" not in ai:
            recipe = {
                "name": ai.get("name", search_term.title()),
                "image_url": ai.get("image_url", ""),
                "ingredients": ai.get("ingredients", []),
                "nutrition": ai.get("nutrition", {}),
                "instructions": ai.get("instructions", []),
                "cuisine": ai.get("cuisine", "Unknown")
            }
            recipe = ensure_image_url(recipe)
            logging.info(f"[SEARCH] AI structured recipe for '{search_term}'")
            return jsonify([recipe])
        if isinstance(ai, dict) and ai.get("ai_text"):
            logging.info(f"[SEARCH] AI plaintext fallback for '{search_term}'")
            recipe = {
                "name": search_term.title(),
                "image_url": "http://10.30.16.92:5000/static/placeholder_recipe.jpg",
                "ingredients": [],
                "nutrition": {},
                "instructions": [],
                "cuisine": "Unknown",
                "ai_text": ai["ai_text"]
            }
            return jsonify([recipe])
        logging.warning(f"[SEARCH] AI unusable payload: {ai}")
        return jsonify({"error": "AI did not return a usable recipe."}), 502
    except Exception as e:
        logging.exception(f"[SEARCH] AI call failed: {e}")
        return jsonify({"error": "AI call failed", "details": str(e)}), 502

# Allergy check endpoint
@routes.route('/allergy-check', methods=['POST'])
def allergy_check():
    data = request.get_json(silent=True) or {}
    recipe_name = (data.get("name") or "").strip().lower()
    allergies = [a.lower() for a in (data.get("allergies") or [])]
    matched_allergies = []
    recipe = next((r for r in RECIPES if r["name"].lower() == recipe_name), None)
    if recipe:
        for ingredient in recipe.get("ingredients", []):
            if ingredient.lower() in allergies:
                matched_allergies.append(ingredient)
    return jsonify({
        "allergy_risk": bool(matched_allergies),
        "matched_allergies": matched_allergies
    })
