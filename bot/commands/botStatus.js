const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-status')
    .setDescription('Consulta o status do bot e sua última sincronização'),
  
  async execute(interaction) {
    try {
      const response = await fetch(`${process.env.API_URL}/api/bot/status`, {
        headers: { 'Authorization': `Bearer dummy-token` },
      }).catch(() => null);

      const data = response ? await response.json() : null;
      const bot = data?.bot || {};

      const embed = new EmbedBuilder()
        .setTitle('🤖 Status do Bot')
        .setColor(bot.is_online ? 0x00ff00 : 0xff0000)
        .addFields(
          { name: 'Status', value: bot.is_online ? '✅ Online' : '❌ Offline', inline: true },
          { name: 'Última sincronização', value: bot.last_sync ? new Date(bot.last_sync).toLocaleString('pt-BR') : 'Nunca', inline: true },
          { name: 'API URL', value: process.env.API_URL || 'Não configurada', inline: false },
          { name: 'Informações', value: bot.error || 'Bot funcionando normalmente' }
        )
        .setFooter({ text: `Uptime: ${Math.floor(process.uptime() / 60)} minutos` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Erro em bot-status:', error);
      await interaction.reply({ content: '❌ Erro ao consultar status do bot.', ephemeral: true });
    }
  },
};
