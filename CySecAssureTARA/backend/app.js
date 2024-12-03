// backend/app.js
const express = require('express');
const connectDB = require('./models/database');
const collectionsRoutes = require('./routes/collectionsRoutes');
const controlsRoutes = require('./routes/controlsRoutes');
const assetsRoutes = require('./routes/assetsRoutes'); 
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
connectDB();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Replace with frontend URL if different
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Register API routes
app.use('/api', collectionsRoutes);
app.use('/api', controlsRoutes);
app.use('/api', assetsRoutes);
app.use('/api/reports', reportRoutes); // Ensure /api/reports is mapped to reportRoutes

// Serve the reports folder as static for downloadable files
app.use('/reports', express.static(path.join(__dirname, 'reports')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

