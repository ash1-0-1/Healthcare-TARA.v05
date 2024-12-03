# backend/models/collection_model.py
def get_collections(db):
    return db.Collections.find({}, {"name": 1, "assets": 1})

