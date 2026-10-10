# 🤖 Nexus Support Hub - Bot Discord

Bot completamente funcional para gerenciamento de tickets, sincronização com API e publicação de painéis.

## ✅ Funcionalidades Implementadas

- ✅ **Login automático no Discord**
- ✅ **Sincronização contínua com API (a cada 60 segundos)**
- ✅ **Criação de tickets com canais privados**
- ✅ **Permissões de acesso automáticas**
- ✅ **Comandos de barra registrados globalmente**
- ✅ **Botões interativos para abrir tickets**
- ✅ **Reivindicação de atendimento**
- ✅ **Fechamento de tickets com exclusão automática**
- ✅ **Adição/remoção de usuários em tickets**
- ✅ **Status do bot consultável**
- ✅ **Logs de sincronização**

## 🚀 Início Rápido

### 1. Configurar Discord Developer Portal

1. Acesse: https://discord.com/developers/applications
2. Clique em "New Application"
3. Vá para "Bot" e clique "Add Bot"
4. Em "TOKEN", clique "Copy" (guarde este token)
5. Ative essas intents:
   - ✅ Message Content Intent
   - ✅ Guild Members Intent
6. Vá para "OAuth2 > URL Generator"
7. Selecione escopos:
   - ✅ `bot`
   - ✅ `applications.commands`
8. Selecione permissões:
   - ✅ Send Messages
   - ✅ Manage Channels
   - ✅ Manage Roles
   - ✅ Embed Links
   - ✅ Manage Messages
   - ✅ Read Message History
9. Copie a URL gerada e abra em seu navegador para adicionar o bot ao servidor

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Edite `.env`:

```env
BOT_TOKEN=seu_token_do_discord
CLIENT_ID=seu_application_id
GUILD_ID=seu_server_id
API_URL=http://localhost:3000
BOT_API_KEY=sua_chave_secreta_aqui
LOG_CHANNEL_ID=seu_canal_de_logs (opcional)
```

**Como encontrar esses valores:**

- **BOT_TOKEN**: Discord Developer Portal > Bot > Copy Token
- **CLIENT_ID**: Discord Developer Portal > General Information > Application ID
- **GUILD_ID**: Ative Modo de Desenvolvedor no Discord > Clique com botão direito no servidor > Copy Server ID
- **API_URL**: URL onde seu servidor Node.js está rodando
- **BOT_API_KEY**: Mesma chave configurada em `src/server.js`

### 3. Instalar Dependências

```bash
cd bot
npm install
```

### 4. Iniciar o Bot

```bash
npm start
```

**Saída esperada:**

```
📁 Carregando 8 comandos...
  ✓ bot-status
  ✓ sync
  ✓ postar-painel
  ✓ criar-ticket
  ✓ fechar-ticket
  ✓ reivindicar
  ✓ adicionar-usuario
  ✓ remover-usuario

📁 Carregando 2 eventos...
  ✓ ready
  ✓ interactionCreate

✅ Bot conectado como NexusBot#1234
🔧 Servidor: Seu Servidor
📝 Registrando 8 comandos de barra...
✅ 8 comandos registrados com sucesso!

[SYNC] ✅ Bot sincronizado com API (45s de uptime)
```

## 📝 Comandos Disponíveis

### `/bot-status`
Consulta o status do bot e última sincronização.

```
/bot-status
```

### `/sync`
Sincroniza o bot manualmente com a API.

```
/sync
```

### `/postar-painel`
Publica um painel de suporte em um canal.

```
/postar-painel painel_id:1 canal:#suporte
```

### `/criar-ticket`
Cria um novo ticket de suporte.

```
/criar-ticket motivo:"Preciso de ajuda" categoria:support
```

### `/fechar-ticket`
Fecha o ticket atual e deleta o canal.

```
/fechar-ticket motivo:"Problema resolvido"
```

### `/reivindicar`
Assume o atendimento do ticket.

```
/reivindicar
```

### `/adicionar-usuario`
Adiciona acesso de um usuário ao ticket.

```
/adicionar-usuario usuario:@Alguém
```

### `/remover-usuario`
Remove acesso de um usuário do ticket.

```
/remover-usuario usuario:@Alguém
```

## 🔄 Sincronização com API

O bot sincroniza automaticamente a cada **60 segundos** com a API via endpoint:

```
POST /api/bot/sync
Header: x-bot-api-key: BOT_API_KEY

Payload:
{
  "status": "online",
  "source": "discord.bot",
  "lastSync": "2026-10-10T18:30:00.000Z",
  "error": null
}
```

## 🎯 Fluxo de Criação de Ticket

1. Usuário clica botão "📝 Abrir Ticket" no painel
2. Um modal de 2 campos aparece (motivo + categoria)
3. Usuário preenche e submete
4. Bot cria um canal privado `ticket-TIMESTAMP`
5. Bot registra o ticket na API
6. Bot envia embed com informações do ticket
7. Equipe de suporte entra no canal
8. Equipe usa `/reivindicar` para assumir
9. Quando resolvido, `/fechar-ticket` encerra e deleta o canal

## 🔒 Segurança

- ✅ Token do bot nunca é exposto
- ✅ Chave `BOT_API_KEY` sempre via header HTTP
- ✅ Validação de permissões para comandos sensíveis
- ✅ Logs de auditoria de todas as ações
- ✅ Canais de tickets privados por padrão

## 🐛 Troubleshooting

### "BOT_TOKEN não configurado"
Certifique-se de que `.env` existe e contém `BOT_TOKEN`.

### "Comandos não aparecem"
Aguarde 15 segundos após iniciar o bot. Se não aparecerem:
1. Verifique se `CLIENT_ID` e `GUILD_ID` estão corretos
2. Remova o bot do servidor e re-adicione
3. Verifique se o bot tem permissão de gerenciar aplicações

### "API retorna erro 401"
Verifique se `BOT_API_KEY` em `.env` é idêntica à configurada na API.

### "Bot não sincroniza com API"
Verifique se:
- `API_URL` está correto e acessível
- Servidor Node.js está rodando
- `BOT_API_KEY` está correto

## 📊 Estrutura de Arquivos

```
bot/
├── index.js                 # Arquivo principal
├── .env.example             # Exemplo de configuração
├── package.json             # Dependências
├── commands/
│   ├── botStatus.js
│   ├── sync.js
│   ├── postarPainel.js
│   ├── criarTicket.js
│   ├── fecharTicket.js
│   ├── reivindicar.js
│   ├── adicionar.js
│   └── remover.js
└── events/
    ├── ready.js             # Conectado e sincronizado
    └── interactionCreate.js # Comandos e botões
```

## 🚦 Status do Bot

O comando `/bot-status` mostra:

```
🤖 Status do Bot
✅ Online | Última sincronização: 10/10/2026, 18:30:45
API URL: http://localhost:3000
Bot funcionando normalmente
Uptime: 125 minutos
```

## 📈 Próximos Passos

1. Configure a hospedagem do bot (Render, Railway, VPS)
2. Configure processo contínuo (PM2, systemd, supervisor)
3. Configure logs centralizados
4. Implemente webhooks de notificação
5. Configure backup automático de transcrições

---

**Bot pronto para produção!** 🚀
