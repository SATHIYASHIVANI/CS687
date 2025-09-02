# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from routes import routes  # your Blueprint with /search, /recommend, etc.
from ollama_ai import generate_recipe_with_ollama
import logging, sys, threading

app = Flask(__name__)
CORS(app)  # enable CORS before registering routes
app.register_blueprint(routes)  # register your routes once

# logging to console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    stream=sys.stdout,
)

@app.route("/")
def home():
    return jsonify({"message": "SmartRecipe AI backend is running!"})

def warm_ollama():
    try:
        # warm the model so first request isn't slow
        generate_recipe_with_ollama("warmup minimal", timeout=60)
    except Exception:
        pass

if __name__ == "__main__":
    # start warm-up thread, then run server ONCE
    threading.Thread(target=warm_ollama, daemon=True).start()
    app.run(host="0.0.0.0", port=5000, debug=True)
