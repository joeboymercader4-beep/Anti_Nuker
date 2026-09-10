const db = require('../config/db');

class SecurityService {
async getAllEvents(limit = 50) {
const [rows] = await db.query(
    'SELECT * FROM security_events ORDER BY id DESC LIMIT ?', 
    [limit]
);
return rows;
}

async logEvent(eventType, targetName, targetId, executorName, executorId, actionTaken) {
const query = `
    INSERT INTO security_events 
    (event_type, target_name, target_id, executor_name, executor_id, action_taken) 
    VALUES (?, ?, ?, ?, ?, ?)
`;
const [result] = await db.query(query, [
    eventType, 
    targetName, 
    targetId, 
    executorName, 
    executorId, 
    actionTaken
]);
return result.insertId;
}
}

module.exports = new SecurityService();