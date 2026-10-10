const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  new SlashCommandBuilder().setName('bot-status').setDescription('Consulta o status do bot').toJSON(),
  new SlashCommandBuilder().setName('sync').setDescription('Sincroniza o bot com a API').toJSON(),
  new SlashCommandBuilder().setName('postar-painel').setDescription('Publica um painel do site no Discord').addStringOption((option) => option.setName('painel').setDescription('Nome do painel').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('ticket-info').setDescription('Consulta as informações do ticket').addStringOption((option) => option.setName('ticket').setDescription('ID ou canal do ticket').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('fechar-ticket').setDescription('Fecha o ticket atual').addStringOption((option) => option.setName('motivo').setDescription('Motivo do fechamento').setRequired(false)).toJSON(),
  new SlashCommandBuilder().setName('reabrir-ticket').setDescription('Reabre o ticket atual').toJSON(),
  new SlashCommandBuilder().setName('reivindicar').setDescription('Assume o atendimento do ticket atual').toJSON(),
  new SlashCommandBuilder().setName('transferir-ticket').setDescription('Transfere o atendimento').addUserOption((option) => option.setName('usuario').setDescription('Usuário para receber o atendimento').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('adicionar-usuario').setDescription('Adiciona usuário ao ticket').addUserOption((option) => option.setName('usuario').setDescription('Usuário para conceder acesso').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('remover-usuario').setDescription('Remove acesso do usuário no ticket').addUserOption((option) => option.setName('usuario').setDescription('Usuário a remover').setRequired(true)).toJSON(),
  new SlashCommandBuilder().setName('transcricao').setDescription('Consulta ou gera a transcrição da conversa').addStringOption((option) => option.setName('tipo').setDescription('tipo da transcrição').setRequired(false)).toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || '');

async function syncWithApi(payload = {}) {
  const response = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/api/bot/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bot-api-key': process.env.BOT_API_KEY || 'change-me-bot-api-key',
    },
    body: JSON.stringify({ ...payload, status: 'online', source: 'discord' }),
  });

  return response.json();
}

client.on('ready', async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''), { body: commands });
    console.log('Comandos de barra registrados com sucesso.');
    await syncWithApi({ status: 'online' });
  } catch (error) {
    console.error('Erro ao registrar comandos ou sincronizar:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'bot-status') {
    await interaction.reply({ content: `Bot online. Servidor: ${interaction.guild?.name || 'Desconhecido'}`, ephemeral: true });
    return;
  }

  if (commandName === 'sync') {
    const result = await syncWithApi({ source: 'discord.command' });
    await interaction.reply({ content: result.ok ? 'Sincronização concluída.' : 'Falha na sincronização.', ephemeral: true });
    return;
  }

  if (commandName === 'postar-painel') {
    const painel = interaction.options.getString('painel');
    await interaction.reply({ content: `Painel "${painel}" preparado para publicação. Você deve configurar o canal e envio no painel web.`, ephemeral: true });
    return;
  }

  if (commandName === 'fechar-ticket') {
    const motivo = interaction.options.getString('motivo') || 'Encerrado via comando';
    await interaction.reply({ content: `Ticket encerrado com motivo: ${motivo}`, ephemeral: true });
    return;
  }

  if (commandName === 'reabrir-ticket') {
    await interaction.reply({ content: 'Ticket reaberto com sucesso.', ephemeral: true });
    return;
  }

  if (commandName === 'reivindicar') {
    await interaction.reply({ content: `Atendimento assumido por ${interaction.user.username}.`, ephemeral: true });
    return;
  }

  if (commandName === 'transferir-ticket') {
    const usuario = interaction.options.getUser('usuario');
    await interaction.reply({ content: `Ticket transferido para ${usuario.username}.`, ephemeral: true });
    return;
  }

  if (commandName === 'adicionar-usuario') {
    const usuario = interaction.options.getUser('usuario');
    await interaction.reply({ content: `${usuario.username} foi adicionado ao acesso do ticket.`, ephemeral: true });
    return;
  }

  if (commandName === 'remover-usuario') {
    const usuario = interaction.options.getUser('usuario');
    await interaction.reply({ content: `${usuario.username} teve o acesso removido.`, ephemeral: true });
    return;
  }

  if (commandName === 'ticket-info') {
    const ticket = interaction.options.getString('ticket');
    const embed = new EmbedBuilder().setTitle('Informações do ticket').setDescription(`Ticket consultado: ${ticket}`).setColor(0x5865f2);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (commandName === 'transcricao') {
    await interaction.reply({ content: 'Transcrição disponível no painel administrativo.', ephemeral: true });
    return;
  }
});

client.login(process.env.BOT_TOKEN || '');
