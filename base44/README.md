# Nexus Support Hub

Sistema completo de painel de suporte, tickets e bot Discord para atendimento profissional.

## Objetivo

Este projeto fornece uma base funcional para:

- dashboard administrativo com métricas reais;
- tickets e histórico de atividades;
- painel de criação e gestão de painéis de atendimento;
- bot Discord com comandos de barra;
- sincronização com API privada via chave `BOT_API_KEY`;
- autenticação simples baseada em JWT;
- armazenamento local em SQLite para uso em ambiente de desenvolvimento e hospedagem.

## Estrutura do projeto

- `src/server.js` — API REST e painel web
- `src/db.js` — banco SQLite e iniciais
- `src/auth.js` — autenticação JWT
- `public/` — interface administrativa
- `bot/` — bot Discord com comandos de barra
- `base44/functions/bot-sync/entry.ts` — integração com Base44

## Configuração

1. Copie `.env.example` para `.env`.
2. Ajuste os valores locais.
3. Instale as dependências:

```bash
npm install
```

4. Inicie a API:

```bash
npm run dev
```

5. Acesse o painel em:

```text
http://localhost:3000
```

## Login padrão

Credenciais de exemplo para ambiente local:

- E-mail: `admin@local.test`
- Senha: `change-me-now`

Importante: troque isso em produção e não deixe segredos em código público.

## Segurança

- Nunca expor token do Discord ou `BOT_API_KEY` no navegador;
- Use `.env` e secrets do servidor real;
- A autenticação do painel usa JWT com `JWT_SECRET`.

## Bot Discord

Para rodar o bot, entre na pasta `bot` e instale as dependências:

```bash
cd bot
npm install
cp .env.example .env
npm start
```

## Variáveis essenciais

```env
PORT=3000
JWT_SECRET=change-me-in-production
ADMIN_EMAIL=admin@local.test
ADMIN_PASSWORD=change-me-now
BOT_API_KEY=change-me-bot-api-key
BOT_TOKEN=replace-with-discord-bot-token
CLIENT_ID=replace-with-discord-application-id
GUILD_ID=replace-with-discord-server-id
LOG_CHANNEL_ID=replace-with-log-channel-id
SUPPORT_ROLE_IDS=replace-with-role-ids
ADMIN_ROLE_IDS=replace-with-admin-role-ids
TICKET_CATEGORY_ID=replace-with-category-id
```

## Observação importante

Este projeto foi montado como base funcional real e pronta para expansão, mas não pode afirmar conexão ativa com Discord ou Base44 sem as credenciais e serviços externos reais. O bot e a API devem ser iniciados em ambiente com acesso ao Discord e à hospedagem escolhida.

## Próximos passos sugeridos

- criar banco externo PostgreSQL em produção;
- configurar integração completa com canais Discord;
- implementar CRUD completo de embeds e painéis;
- ativar webhooks e logs permanentes;
- publicar em hospedagem Node.js externa com processo contínuo.
