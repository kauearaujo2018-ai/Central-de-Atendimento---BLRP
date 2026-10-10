const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adicionar-usuario')
    .setDescription('Adiciona um usuário ao ticket')
    .addUserOption(option => option.setName('usuario').setDescription('Usuário a adicionar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const user = interaction.options.getUser('usuario');
      const channel = interaction.channel;

      if (!channel.name.startsWith('ticket-')) {
        return await interaction.editReply({ content: '❌ Este comando só funciona em canais de ticket.' });
      }

      await channel.permissionOverwrites.create(user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      const embed = new EmbedBuilder()
        .setTitle('👥 Usuário Adicionado')
        .setColor(0x00ff00)
        .addFields({ name: 'Usuário', value: `<@${user.id}>` })
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await interaction.editReply({ content: `✅ ${user.username} foi adicionado ao ticket.` });
    } catch (error) {
      console.error('Erro em adicionar-usuario:', error);
      await interaction.editReply({ content: `❌ Erro ao adicionar usuário: ${error.message}` });
    }
  },
};
