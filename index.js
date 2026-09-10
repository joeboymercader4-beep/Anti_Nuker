require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./apiRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// API Routes
app.use('/api', apiRoutes);

// Catch-all route para sa Express v5
app.get('/{0,}', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`[SYSTEM] Express Dashboard running on http://localhost:${PORT}`);
});