# backend/routes/collections.py
from flask import Blueprint, jsonify
from models.collection_model import get_collections
from app import db

collections_bp = Blueprint('collections', __name__)

@collections_bp.route('/', methods=['GET'])
def fetch_collections():
    collections = list(get_collections(db))
    return jsonify(collections)

