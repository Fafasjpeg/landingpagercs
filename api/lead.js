// Função serverless da Vercel: repassa o lead para o webhook do n8n.
// A URL do webhook fica na variável de ambiente N8N_WEBHOOK_URL (não exposta no navegador).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return res.status(500).json({ error: 'N8N_WEBHOOK_URL não configurada' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (body.website) return res.status(200).json({ ok: true }); // honeypot: ignora bots
  delete body.website;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.N8N_WEBHOOK_TOKEN) headers.Authorization = process.env.N8N_WEBHOOK_TOKEN; // opcional (Header Auth no n8n)
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) return res.status(502).json({ error: 'n8n respondeu ' + r.status });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Falha ao contatar o n8n' });
  }
}
