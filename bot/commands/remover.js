const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remover-usuario')
    .setDescription('Remove um usuário do ticket')
    .addUserOption(option => option.setName('usuario').setDescription('Usuário a remover').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const user = interaction.options.getUser('usuario');
      const channel = interaction.channel;

      if (!channel.name.startsWith('ticket-')) {
        return await interaction.editReply({ content: '❌ Este comando só funciona em canais de ticket.' });
      }

      await channel.permissionOverwrites.delete(user.id);

      const embed = new EmbedBuilder()
        .setTitle('👥 Usuário Removido')
        .setColor(0xff0000)
        .addFields({ name: 'Usuário', value: `${user.username}` })
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await interaction.editReply({ content: `✅ ${user.username} foi removido do ticket.` });
    } catch (error) {
      console.error('Erro em remover-usuario:', error);
      await interaction.editReply({ content: `❌ Erro ao remover usuário: ${error.message}` });
    }
  },
};
