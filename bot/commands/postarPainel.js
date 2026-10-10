const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('postar-painel')
    .setDescription('Publica um painel de suporte no canal')
    .addStringOption(option => option.setName('painel_id').setDescription('ID ou nome do painel').setRequired(true))
    .addChannelOption(option => option.setName('canal').setDescription('Canal para publicar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const painelId = interaction.options.getString('painel_id');
      const canal = interaction.options.getChannel('canal');

      const response = await fetch(`${process.env.API_URL}/api/panels`, {
        headers: { 'Authorization': `Bearer dummy-token` },
      });

      const data = await response.json();
      const painel = data.panels?.find(p => p.id == painelId || p.name === painelId);

      if (!painel) {
        return await interaction.editReply({ content: `❌ Painel não encontrado.` });
      }

      const embed = new EmbedBuilder()
        .setTitle(painel.title || 'Painel de Suporte')
        .setDescription(painel.description || 'Clique no botão abaixo para abrir um ticket.')
        .setColor(0x5865f2)
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`ticket_create_${painel.id}`)
          .setLabel('📝 Abrir Ticket')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`ticket_faq_${painel.id}`)
          .setLabel('❓ FAQ')
          .setStyle(ButtonStyle.Secondary)
      );

      const sentMessage = await canal.send({ embeds: [embed], components: [row] });

      await interaction.editReply({
        content: `✅ Painel publicado com sucesso no canal ${canal}.\nID da mensagem: ${sentMessage.id}`,
      });

      console.log(`Painel ${painel.id} publicado em ${canal.id}`);
    } catch (error) {
      console.error('Erro em postar-painel:', error);
      await interaction.editReply({ content: `❌ Erro ao publicar painel: ${error.message}` });
    }
  },
};
