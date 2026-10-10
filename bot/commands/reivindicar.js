const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reivindicar')
    .setDescription('Assume o atendimento do ticket atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const channel = interaction.channel;

      if (!channel.name.startsWith('ticket-')) {
        return await interaction.editReply({ content: '❌ Este comando só funciona em canais de ticket.' });
      }

      const ticketId = channel.name.replace('ticket-', '');

      const apiResponse = await fetch(`${process.env.API_URL}/api/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token',
        },
        body: JSON.stringify({
          assignee_id: interaction.user.id,
          assignee_name: interaction.user.username,
        }),
      }).catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle('👤 Ticket Reivindicado')
        .setColor(0x00ff00)
        .addFields(
          { name: 'Atendente', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Status', value: '🟡 Em atendimento' }
        )
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      await interaction.editReply({ content: `✅ Você assumiu o atendimento do ticket #${ticketId}.` });
    } catch (error) {
      console.error('Erro em reivindicar:', error);
      await interaction.editReply({ content: `❌ Erro ao reivindicar ticket: ${error.message}` });
    }
  },
};
