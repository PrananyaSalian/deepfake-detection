from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json
from predict import predict_image  # your existing predict function

app = Flask(__name__)
CORS(app)

# ----------------------
# Users storage
# ----------------------
USER_FILE = "users.json"

# Load users from file
if os.path.exists(USER_FILE):
    with open(USER_FILE, "r") as f:
        users = json.load(f)
else:
    users = {}

def save_users():
    with open(USER_FILE, "w") as f:
        json.dump(users, f)

# ----------------------
# Signup endpoint
# ----------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    if email in users:
        return jsonify({"success": False, "message": "User already exists"}), 400

    users[email] = password
    save_users()
    return jsonify({"success": True, "message": "Signup successful"})

# ----------------------
# Login endpoint
# ----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    if users.get(email) == password:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ----------------------
# Image prediction endpoint
# ----------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files["file"]
    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", file.filename)
    file.save(path)

    label, prob = predict_image(path)
    return jsonify({"success": True, "label": label, "probability": prob})

# ----------------------
if __name__ == "__main__":
    app.run(debug=True)
