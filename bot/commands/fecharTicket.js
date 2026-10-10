const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fechar-ticket')
    .setDescription('Fecha o ticket atual')
    .addStringOption(option => option.setName('motivo').setDescription('Motivo do fechamento').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const channel = interaction.channel;
      const motivo = interaction.options.getString('motivo') || 'Encerrado pela equipe';

      if (!channel.name.startsWith('ticket-')) {
        return await interaction.editReply({ content: '❌ Este comando só funciona em canais de ticket.' });
      }

      const ticketId = channel.name.replace('ticket-', '');

      const apiResponse = await fetch(`${process.env.API_URL}/api/tickets/${ticketId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token',
        },
        body: JSON.stringify({ close_reason: motivo }),
      }).catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket Fechado')
        .setColor(0xff0000)
        .addFields(
          { name: 'Motivo', value: motivo },
          { name: 'Encerrado por', value: interaction.user.username },
          { name: 'Data', value: new Date().toLocaleString('pt-BR') }
        )
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await channel.send({ content: '⏰ Este canal será deletado em 5 segundos...' });

      setTimeout(() => channel.delete().catch(console.error), 5000);

      await interaction.editReply({ content: `✅ Ticket ${ticketId} fechado e canal será removido.` });
    } catch (error) {
      console.error('Erro em fechar-ticket:', error);
      await interaction.editReply({ content: `❌ Erro ao fechar ticket: ${error.message}` });
    }
  },
};
