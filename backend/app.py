from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/')
def home():
    return jsonify({"message": "SmartRecipe AI backend is running!"})

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_preferences = data.get("preferences", [])
    
    # Dummy recipe recommendation based on input
    recommendations = [
        {"title": "Avocado Toast", "ingredients": ["avocado", "bread"]},
        {"title": "Broccoli Stir Fry", "ingredients": ["broccoli", "soy sauce"]}
    ]
    
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
