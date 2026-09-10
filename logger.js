const db = require('./db');

async function logSecurityEvent(eventType, targetName, targetId, executorName, executorId, actionTaken) {
try {
const query = `
    INSERT INTO security_events 
    (event_type, target_name, target_id, executor_name, executor_id, action_taken) 
    VALUES (?, ?, ?, ?, ?, ?)
`;
await db.query(query, [
    eventType,
    targetName,
    targetId,
    executorName,
    executorId,
    actionTaken
]);
console.log(`[DATABASE LOGGED] ${eventType} | Target: ${targetName} | Executor: ${executorName}`);
} catch (err) {
console.error('[DATABASE LOG ERROR]', err.message);
}
}

module.exports = { logSecurityEvent };