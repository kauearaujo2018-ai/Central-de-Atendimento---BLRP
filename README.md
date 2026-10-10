type BotSyncRequest = {
  status?: 'online' | 'offline';
  source?: string;
  apiKey?: string;
  lastSync?: string;
  error?: string | null;
};

export default async function handler(req: any, res: any) {
  try {
    const headers = req?.headers || {};
    const body: BotSyncRequest = req?.body || {};
    const apiKey = headers['x-bot-api-key'] || body.apiKey || '';

    if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
      return res.status(401).json({ ok: false, message: 'Chave BOT_API_KEY inválida.' });
    }

    const payload = {
      status: body.status || 'online',
      source: body.source || 'base44-function',
      lastSync: body.lastSync || new Date().toISOString(),
      error: body.error || null,
    };

    return res.status(200).json({
      ok: true,
      message: 'Sincronização do bot registrada pela Base44.',
      payload,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: 'Erro interno da sincronização do bot.',
      error: error?.message || 'Erro desconhecido',
    });
  }
}
