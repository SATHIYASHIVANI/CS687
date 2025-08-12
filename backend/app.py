from flask import Flask, jsonify
from flask_cors import CORS
from routes import routes

app = Flask(__name__)
CORS(app)
app.register_blueprint(routes)

@app.route('/')
def home():
    return jsonify({"message": "SmartRecipe AI backend is running!"})

if __name__ == '__main__':
    app.run(debug=True)