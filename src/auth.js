require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  appName: process.env.APP_NAME || 'Nexus Support Hub',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@local.test',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me-now',
  currentEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  botApiKey: process.env.BOT_API_KEY || 'change-me-bot-api-key',
  botToken: process.env.BOT_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  guildId: process.env.GUILD_ID || '',
  supportRoleIds: (process.env.SUPPORT_ROLE_IDS || '').split(',').map((x) => x.trim()).filter(Boolean),
  adminRoleIds: (process.env.ADMIN_ROLE_IDS || '').split(',').map((x) => x.trim()).filter(Boolean),
  logChannelId: process.env.LOG_CHANNEL_ID || '',
  ticketCategoryId: process.env.TICKET_CATEGORY_ID || '',
  botStatus: process.env.BOT_STATUS || 'offline',
  syncIntervalMs: Number(process.env.SYNC_INTERVAL_MS || 60000),
};
