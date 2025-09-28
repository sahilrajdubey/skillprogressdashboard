from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello Sahil! Flask backend is running 🚀"


if __name__ == "__main__":
    app.run(debug=True, port=5001) 