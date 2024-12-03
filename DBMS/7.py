import pandas as pd
from pymongo import MongoClient
import json

# Step 1: Read the Excel file
file_path = '7.AI,ML,AnalyticsServices.xlsx'
df = pd.read_excel(file_path)

# Step 2: Convert DataFrame to JSON format
data_json = json.loads(df.to_json(orient='records'))

# Step 3: Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection string if needed
db = client['CySecAssureDB']
collection = db['7. AI, Machine Learning, and Analytics Services']

# Step 4: Insert data into MongoDB
collection.insert_many(data_json)

# Verify data insertion by retrieving it back
for document in collection.find():
    print(document)

