const { Events, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`\n✅ Bot conectado como ${client.user.tag}`);
    console.log(`🔧 Servidor: ${client.guilds.cache.get(process.env.GUILD_ID)?.name || 'Não encontrado'}`);

    client.user.setActivity('🎫 tickets de suporte', { type: ActivityType.Watching });

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
      const commandsPath = path.join(__dirname, '..', 'commands');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      const commands = [];
      for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        commands.push(command.data.toJSON());
      }

      console.log(`📝 Registrando ${commands.length} comandos de barra...`);

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );

      console.log(`✅ ${commands.length} comandos registrados com sucesso!\n`);
    } catch (error) {
      console.error('❌ Erro ao registrar comandos:', error);
    }

    syncWithApi(client);
    setInterval(() => syncWithApi(client), 60000);
  },
};

async function syncWithApi(client) {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const uptime = process.uptime();

    const payload = {
      status: 'online',
      source: 'discord.bot',
      lastSync: new Date().toISOString(),
      error: null,
    };

    const response = await fetch(`${process.env.API_URL}/api/bot/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bot-api-key': process.env.BOT_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.ok) {
      console.log(`[SYNC] ✅ Bot sincronizado com API (${uptime.toFixed(0)}s de uptime)`);
    } else {
      console.log(`[SYNC] ⚠️ Falha na sincronização: ${result.message}`);
    }
  } catch (error) {
    console.error(`[SYNC] ❌ Erro de conexão com API:`, error.message);
  }
}
