const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sync')
    .setDescription('Sincroniza o bot com a API web'),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const payload = {
        status: 'online',
        source: 'discord.command',
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

      const embed = new EmbedBuilder()
        .setTitle('🔄 Sincronização do Bot')
        .setColor(result.ok ? 0x00ff00 : 0xff0000)
        .addFields(
          { name: 'Status', value: result.ok ? '✅ Sucesso' : '❌ Falha', inline: true },
          { name: 'Mensagem', value: result.message || 'Sem resposta' },
          { name: 'Horário', value: new Date().toLocaleString('pt-BR') }
        )
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro em sync:', error);
      await interaction.editReply({ content: `❌ Erro na sincronização: ${error.message}` });
    }
  },
};
