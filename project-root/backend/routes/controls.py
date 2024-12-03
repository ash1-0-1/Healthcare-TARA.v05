# backend/routes/controls.py
from flask import Blueprint, jsonify, request
from models.security_control_model import get_effective_controls
from app import db

controls_bp = Blueprint('controls', __name__)

@controls_bp.route('/<classification>', methods=['GET'])
def fetch_controls(classification):
    controls = get_effective_controls(db, classification)
    return jsonify(controls)

