const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all events
router.get('/events', async (req, res) => {
try {
const [rows] = await db.query('SELECT * FROM security_events ORDER BY created_at DESC');
res.json(rows);
} catch (err) {
console.error('Fetch Error:', err);
res.status(500).json({ error: 'Database query failed' });
}
});

// DELETE events with Admin Password Protection
router.delete('/events/clear', async (req, res) => {
const { serverName, password } = req.body;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

if (password !== ADMIN_PASSWORD) {
return res.status(401).json({ error: 'Maling Admin Password! Access Denied.' });
}

try {
if (serverName === 'ALL') {
    await db.query('DELETE FROM security_events');
} else {
    await db.query('DELETE FROM security_events WHERE guild_name = ?', [serverName]);
}
res.json({ message: `Matagumpay na nabura ang logs para sa: ${serverName}` });
} catch (err) {
console.error('Clear Error:', err);
res.status(500).json({ error: 'Failed to clear logs from database' });
}
});

module.exports = router;