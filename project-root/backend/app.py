# backend/app.py
from flask import Flask, render_template
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['CySecAssureDB']

# Import routes
from routes.collections import collections_bp
from routes.controls import controls_bp

# Register Blueprints
app.register_blueprint(collections_bp, url_prefix='/api/collections')
app.register_blueprint(controls_bp, url_prefix='/api/controls')

# Serve the HTML file at the root route
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)

