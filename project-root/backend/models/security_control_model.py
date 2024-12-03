# backend/models/security_control_model.py
def get_effective_controls(db, classification):
    control_data = db.SecurityControls.find_one({"classification": classification})
    return control_data.get("effective_controls", []) if control_data else []

