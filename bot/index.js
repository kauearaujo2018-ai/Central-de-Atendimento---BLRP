const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`📁 Carregando ${commandFiles.length} comandos...\n`);
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  console.log(`  ✓ ${command.data.name}`);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log(`\n📁 Carregando ${eventFiles.length} eventos...\n`);
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  console.log(`  ✓ ${event.name}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

if (!process.env.BOT_TOKEN) {
  console.error('\n❌ Erro: BOT_TOKEN não está configurado no .env');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('❌ Erro: CLIENT_ID não está configurado no .env');
  process.exit(1);
}

if (!process.env.GUILD_ID) {
  console.error('❌ Erro: GUILD_ID não está configurado no .env');
  process.exit(1);
}

if (!process.env.API_URL) {
  console.error('❌ Erro: API_URL não está configurado no .env');
  process.exit(1);
}

if (!process.env.BOT_API_KEY) {
  console.error('❌ Erro: BOT_API_KEY não está configurado no .env');
  process.exit(1);
}

client.login(process.env.BOT_TOKEN);

process.on('unhandledRejection', error => {
  console.error('❌ Promise rejeitada não tratada:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});
