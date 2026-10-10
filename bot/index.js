# Bot Discord — Nexus Support Hub

Este diretório contém o bot responsável por publicar painéis, receber comandos de suporte e sincronizar status com o painel web.

## Requisitos

- Node.js 18+
- Discord Developer Portal com bot criado
- Servidor Discord com permissões apropriadas
- URL da API web válida

## Configuração

1. Copie `.env.example` para `.env`
2. Ajuste os valores de:
   - `BOT_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `API_URL`
   - `BOT_API_KEY`
3. Instale as dependências:

```bash
npm install
```

4. Inicie o bot:

```bash
npm start
```

## Permissões mínimas recomendadas

- View Channel
- Send Messages
- Manage Channels
- Manage Roles
- Read Message History
- Embed Links
- Use External Emojis
- Add Reactions
- View Audit Log

## Comandos disponíveis

- /bot-status
- /postar-painel
- /fechar-ticket
- /reabrir-ticket
- /reivindicar
- /transferir-ticket
- /adicionar-usuario
- /remover-usuario
- /ticket-info
- /transcricao
- /sync

## Importante

Este bot não deve expor tokens ou chaves em código font. Sempre use variáveis de ambiente ou secrets.
