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
console.log(`[ANTI-NUKE LOGGED] ${eventType} - ${actionTaken}`);
} catch (err) {
console.error('[DB LOG ERROR]', err.message);
}
}

module.exports = { logSecurityEvent };

const { logSecurityEvent } = require('./logger');

client.on('channelDelete', async (channel) => {
// Kunin ang audit logs para malaman kung sino ang nagbura
const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 12 }); // 12 = CHANNEL_DELETE
const entry = auditLogs.entries.first();
const executor = entry ? entry.executor : { username: 'Unknown', id: '000000000' };

// 1. Isagawa ang Anti-Nuke action (halimbawa: i-ban ang executor)
await channel.guild.members.ban(executor.id, { reason: 'Anti-Nuke: Channel Deletion' });

// 2. I-record agad sa Dashboard Database
await logSecurityEvent(
'CHANNEL_DELETE',
channel.name,
channel.id,
`${executor.username}#${executor.discriminator || '0'}`,
executor.id,
'USER_BANNED'
);
});


client.on('guildMemberAdd', async (member) => {
if (member.user.bot) {
const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 28 }); // 28 = BOT_ADD
const entry = auditLogs.entries.first();
const executor = entry ? entry.executor : { username: 'Unknown', id: '000000000' };

// Kick ang bot
await member.kick('Anti-Nuke: Unauthorized Bot');

// I-log sa Dashboard
await logSecurityEvent(
    'UNAUTHORIZED_BOT',
    `${member.user.username}`,
    member.id,
    `${executor.username}`,
    executor.id,
    'BOT_KICKED'
);
}
});