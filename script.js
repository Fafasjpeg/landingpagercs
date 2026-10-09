// Envio do formulário -> /api/lead (Vercel) -> webhook do n8n
const form = document.getElementById('lead-form');
const msg = document.getElementById('form-msg');
const btn = form.querySelector('button[type=submit]');

// Máscara de celular brasileiro: (11) 99999-9999
form.celular.addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  e.target.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : d.length > 2 ? d.replace(/(\d{2})(\d*)/, '($1) $2') : d;
});

function aviso(texto, tipo) { msg.textContent = texto; msg.className = 'form-msg ' + tipo; }

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let ok = true;
  [...form.elements].forEach((el) => {
    if (!el.required) return;
    const bad = !el.value.trim() || (el.type === 'email' && !el.checkValidity()) ||
      (el.name === 'celular' && el.value.replace(/\D/g, '').length < 10);
    el.classList.toggle('invalido', bad);
    if (bad) ok = false;
  });
  if (!ok) return aviso('Preencha corretamente os campos com *.', 'erro');

  const data = Object.fromEntries(new FormData(form));
  data.celular = '+55' + data.celular.replace(/\D/g, '');
  data.origem = location.href;
  data.enviado_em = new Date().toISOString();

  btn.disabled = true;
  aviso('Enviando...', '');
  try {
    const r = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(r.status);
    form.reset();
    aviso('Recebemos seus dados! Redirecionando...', 'ok');
    try { sessionStorage.setItem('lead_ok', '1'); } catch {} // a página /obrigado avisa o Pixel (evento custom, não Lead)
    location.href = '/obrigado';
  } catch {
    aviso('Não foi possível enviar agora. Tente novamente.', 'erro');
    btn.disabled = false;
  }
});

// Meta Pixel: carregado sempre (medição de desempenho do funil de vendas)
const PIXEL_ID = '822735764193077';
function carregarPixel() {
  if (window.fbq) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
}
function evento(nome) { if (window.fbq) fbq('track', nome); }

// Banner LGPD
const cookies = document.getElementById('cookies');
let escolha = null;
try { escolha = localStorage.getItem('cookies'); } catch {}
if (!escolha) cookies.hidden = false;
carregarPixel();

cookies.addEventListener('click', (e) => {
  const acao = e.target.dataset.cookie;
  if (!acao) return;
  try { localStorage.setItem('cookies', acao); } catch {}
  cookies.hidden = true;
});

document.querySelector('.wpp').addEventListener('click', () => evento('Contact'));
