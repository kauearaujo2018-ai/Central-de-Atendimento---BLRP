const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('criar-ticket')
    .setDescription('Cria um novo ticket de suporte')
    .addStringOption(option => option.setName('motivo').setDescription('Motivo do ticket').setRequired(true))
    .addStringOption(option => 
      option.setName('categoria').setDescription('Categoria do suporte').setRequired(false)
        .addChoices(
          { name: 'Suporte Geral', value: 'support' },
          { name: 'Denúncia', value: 'report' },
          { name: 'Bug', value: 'bug' },
          { name: 'Outro', value: 'other' }
        )
    ),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const motivo = interaction.options.getString('motivo');
      const categoria = interaction.options.getString('categoria') || 'support';

      const guild = interaction.guild;
      if (!guild) return await interaction.editReply({ content: '❌ Este comando só funciona em servidores.' });

      const categoryId = process.env.TICKET_CATEGORY_ID;
      const supportRoleIds = (process.env.SUPPORT_ROLE_IDS || '').split(',').filter(Boolean);

      const ticketNumber = Date.now();
      const channelName = `ticket-${ticketNumber}`;

      const permissionsOverwrites = [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
      ];

      supportRoleIds.forEach(roleId => {
        permissionsOverwrites.push({
          id: roleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
        });
      });

      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: 0,
        parent: categoryId || undefined,
        permissionOverwrites,
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎫 Ticket #${ticketNumber}`)
        .setColor(0x00ff00)
        .addFields(
          { name: 'Usuário', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Categoria', value: categoria, inline: true },
          { name: 'Motivo', value: motivo },
          { name: 'Status', value: '🟢 Aberto' }
        )
        .setFooter({ text: 'Nexus Support Hub' })
        .setTimestamp();

      const message = await ticketChannel.send({ embeds: [embed] });

      const ticketPayload = {
        user_id: interaction.user.id,
        user_name: interaction.user.username,
        category: categoria,
        reason: motivo,
        priority: 'normal',
        panel_id: 1,
      };

      const apiResponse = await fetch(`${process.env.API_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token',
        },
        body: JSON.stringify(ticketPayload),
      }).catch(() => null);

      if (apiResponse?.ok) {
        const apiData = await apiResponse.json();
        console.log(`Ticket #${ticketNumber} criado na API (ID: ${apiData.ticketId})`);
      } else {
        console.warn(`Falha ao registrar ticket ${ticketNumber} na API`);
      }

      await ticketChannel.send({ content: `🔧 Ticket criado. A equipe de suporte será notificada em breve.` });

      await interaction.editReply({
        content: `✅ Ticket criado com sucesso!\nCanal: ${ticketChannel}\nID: ${ticketNumber}`,
      });

    } catch (error) {
      console.error('Erro em criar-ticket:', error);
      await interaction.editReply({ content: `❌ Erro ao criar ticket: ${error.message}` });
    }
  },
};
