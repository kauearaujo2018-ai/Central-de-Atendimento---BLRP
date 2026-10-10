const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'support.db');
const db = new Database(dbPath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    channel_id TEXT,
    category_id TEXT,
    embed_json TEXT,
    welcome_message TEXT,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_channel_id TEXT,
    user_id TEXT NOT NULL,
    user_name TEXT,
    category TEXT,
    reason TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'normal',
    assignee_id TEXT,
    assignee_name TEXT,
    opened_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    closed_at TEXT,
    close_reason TEXT,
    panel_id INTEGER,
    metadata TEXT,
    last_sync_at TEXT,
    UNIQUE(discord_channel_id)
  );

  CREATE TABLE IF NOT EXISTS ticket_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    actor TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id)
  );

  CREATE TABLE IF NOT EXISTS transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'txt',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ticket_id, type)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bot_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_online INTEGER DEFAULT 0,
    last_sync TEXT,
    uptime_seconds INTEGER DEFAULT 0,
    error TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT,
    role TEXT DEFAULT 'staff',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureDefaultSettings() {
  const defaults = [
    ['APP_NAME', 'Nexus Support Hub'],
    ['BOT_STATUS', 'offline'],
    ['SYNC_INTERVAL_MS', '60000'],
    ['ADMIN_ROLE_IDS', ''],
    ['SUPPORT_ROLE_IDS', ''],
    ['LOG_CHANNEL_ID', ''],
    ['GUILD_ID', ''],
    ['TICKET_CATEGORY_ID', ''],
    ['BOT_API_KEY', ''],
    ['BOT_TOKEN', ''],
    ['CLIENT_ID', ''],
    ['BOT_SYNC_ENABLED', 'false']
  ];

  const insert = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?) `);
  for (const [key, value] of defaults) {
    insert.run(key, value);
  }
}

function seedSampleData() {
  const panelExists = db.prepare('SELECT COUNT(*) as count FROM panels').get();
  if (panelExists.count === 0) {
    const insertPanel = db.prepare(`
      INSERT INTO panels (name, title, description, channel_id, category_id, embed_json, welcome_message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPanel.run(
      'Painel principal',
      'Atendimento BLRP',
      'Suporte para dúvidas, denúncias e problemas gerais.',
      '1010101010',
      '2020202020',
      JSON.stringify({
        title: 'Atendimento BLRP',
        description: 'Abra seu ticket para falar com nossa equipe.',
        color: 5814783,
        fields: [{ name: 'Categoria', value: 'Suporte', inline: true }]
      }),
      'Olá! Abra um ticket para receber auxílio.',
      'published'
    );
  }

  const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
  if (ticketCount.count === 0) {
    const insertTicket = db.prepare(`
      INSERT INTO tickets (user_id, user_name, category, reason, status, priority, assignee_id, assignee_name, opened_by, discord_channel_id, panel_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTicket.run(
      'user-1',
      'Jogador 01',
      'Suporte geral',
      'Preciso de ajuda para configurar acesso.',
      'open',
      'normal',
      'staff-1',
      'Atendente 01',
      'bot',
      'discord-1001',
      1,
      JSON.stringify({ source: 'demo' })
    );
  }

  const statusCount = db.prepare('SELECT COUNT(*) as count FROM bot_status').get();
  if (statusCount.count === 0) {
    db.prepare(`INSERT INTO bot_status (is_online, last_sync, uptime_seconds, error) VALUES (?, ?, ?, ?)`).run(0, new Date().toISOString(), 0, 'Ainda não sincronizado');
  }
}

ensureDefaultSettings();
seedSampleData();

module.exports = db;
