require('dotenv').config();
const { Client, GatewayIntentBits, AuditLogEvent } = require('discord.js');
const { logSecurityEvent } = require('./logger');

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildModeration
]
});

client.once('ready', () => {
console.log(`[BOT READY] Logged in as ${client.user.tag}`);
});

// 1. Channel Creation Event
client.on('channelCreate', async (channel) => {
if (!channel.guild) return;

try {
const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate });
const entry = auditLogs.entries.first();

const executorName = entry ? `${entry.executor.username}` : 'Unknown User';
const executorId = entry ? entry.executor.id : '000000000000000000';

await logSecurityEvent(
    'CHANNEL_CREATE',
    `#${channel.name}`,
    channel.id,
    executorName,
    executorId,
    'LOGGED_ONLY'
);
} catch (err) {
console.error('[EVENT ERROR - channelCreate]', err.message);
}
});

// 2. Channel Deletion Event
client.on('channelDelete', async (channel) => {
if (!channel.guild) return;

try {
const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
const entry = auditLogs.entries.first();

const executorName = entry ? `${entry.executor.username}` : 'Unknown User';
const executorId = entry ? entry.executor.id : '000000000000000000';

await logSecurityEvent(
    'CHANNEL_DELETE',
    `#${channel.name}`,
    channel.id,
    executorName,
    executorId,
    'LOGGED_ONLY'
);
} catch (err) {
console.error('[EVENT ERROR - channelDelete]', err.message);
}
});

// 3. Role Creation Event
client.on('roleCreate', async (role) => {
if (!role.guild) return;

try {
const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate });
const entry = auditLogs.entries.first();

const executorName = entry ? `${entry.executor.username}` : 'Unknown User';
const executorId = entry ? entry.executor.id : '000000000000000000';

await logSecurityEvent(
    'ROLE_CREATE',
    `@${role.name}`,
    role.id,
    executorName,
    executorId,
    'LOGGED_ONLY'
);
} catch (err) {
console.error('[EVENT ERROR - roleCreate]', err.message);
}
});

// 4. Unauthorized Bot Detection Event
client.on('guildMemberAdd', async (member) => {
if (member.user.bot) {
try {
    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
    const entry = auditLogs.entries.first();

    const executorName = entry ? `${entry.executor.username}` : 'Unknown User';
    const executorId = entry ? entry.executor.id : '000000000000000000';

    await member.kick('Anti-Nuke: Unauthorized Bot Addition');

    await logSecurityEvent(
    'UNAUTHORIZED_BOT',
    `${member.user.username}`,
    member.id,
    executorName,
    executorId,
    'BOT_KICKED'
    );
} catch (err) {
    console.error('[EVENT ERROR - guildMemberAdd]', err.message);
}
}
});

client.login(process.env.DISCORD_TOKEN);