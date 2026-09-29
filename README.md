# Landing Page RCS — Torre de Controle Logístico

HTML + CSS + JS mínimo. Sem build.

## Estrutura
- `index.html`, `style.css`, `script.js` — a página
- `api/lead.js` — função da Vercel que envia o formulário ao n8n
- `assets/` — coloque aqui: `hero.webp`, `solucao.webp`, `roberto.jpg`, `pedro.jpg`, `logo-branca.png`, `logo-preta.png` (opcionais; sem elas a página usa gradientes/iniciais)

## n8n
1. No n8n, crie um nó **Webhook** (método `POST`) e copie a **Production URL**.
2. Campos recebidos (JSON): `nome, email, celular, empresa, segmento, veiculos, origem, enviado_em`.
3. Ative o workflow (a URL de produção só responde com o workflow ativo).

## Deploy na Vercel
```
npm i -g vercel
vercel                            # primeira vez (preview)
vercel env add N8N_WEBHOOK_URL    # cole a Production URL do webhook
vercel env add N8N_WEBHOOK_TOKEN  # opcional: valor do header Authorization se usar Header Auth
vercel --prod
```
Ou importe a pasta pelo painel da Vercel e cadastre as variáveis em Settings → Environment Variables.

## Testar o webhook
```
curl -X POST https://SEU-DOMINIO/api/lead -H "Content-Type: application/json" -d '{"nome":"Teste","email":"a@b.com"}'
```
