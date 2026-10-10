const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    } else if (interaction.isChatInputCommand()) {
      const commandsPath = path.join(__dirname, '..', 'commands');
      const command = require(path.join(commandsPath, `${interaction.commandName}.js`)) || 
                      require(path.join(commandsPath, `${interaction.commandName.replace(/-/g, '')}.js`));
      
      if (!command) {
        return await interaction.reply({ content: '❌ Comando não encontrado.', ephemeral: true });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Erro ao executar comando.', ephemeral: true });
      }
    }
  },
};

async function handleButtonInteraction(interaction) {
  const customId = interaction.customId;

  if (customId.startsWith('ticket_create_')) {
    const painelId = customId.replace('ticket_create_', '');
    await interaction.showModal(createTicketModal(painelId));
  } else if (customId.startsWith('ticket_faq_')) {
    await interaction.reply({
      content: `❓ **FAQ do Suporte**\n\n1. **Como abrir um ticket?**\nClique no botão "Abrir Ticket" e preencha as informações.\n\n2. **Quanto tempo leva para responder?**\nNossa equipe responde em até 24 horas.\n\n3. **Posso reivindicar um ticket?**\nSim! Use \`/reivindicar\` em um canal de ticket.`,
      ephemeral: true,
    });
  }
}

function createTicketModal(painelId) {
  const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${painelId}`)
    .setTitle('Abrir Ticket');

  const reasonInput = new TextInputBuilder()
    .setCustomId('ticket_reason')
    .setLabel('Qual é o seu problema?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const categoryInput = new TextInputBuilder()
    .setCustomId('ticket_category')
    .setLabel('Categoria (Suporte/Bug/Denúncia)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setValue('Suporte');

  modal.addComponents(
    new ActionRowBuilder().addComponents(reasonInput),
    new ActionRowBuilder().addComponents(categoryInput)
  );

  return modal;
}
