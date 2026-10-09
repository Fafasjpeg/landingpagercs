// Página de obrigado: avisa o Meta Pixel que um diagnóstico foi solicitado, só quando o envio ao n8n foi confirmado
// (script.js grava 'lead_ok' no sessionStorage antes de redirecionar para cá).
// Evento CUSTOM de propósito: não usamos Lead/Contact (eventos padrão de conversão) aqui.
const PIXEL_ID = '822735764193077';
function carregarPixel() {
  if (window.fbq) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
}
function eventoCustom(nome) { if (window.fbq) fbq('trackCustom', nome); }

carregarPixel();

let enviou = false;
try {
  enviou = sessionStorage.getItem('lead_ok') === '1';
  sessionStorage.removeItem('lead_ok'); // evita contar Lead de novo ao recarregar a página
} catch {}
if (enviou) eventoCustom('DiagnosticoSolicitado');

// Banner LGPD (mesma chave da página principal: quem já aceitou não vê de novo)
const cookies = document.getElementById('cookies');
let escolha = null;
try { escolha = localStorage.getItem('cookies'); } catch {}
if (!escolha) cookies.hidden = false;
cookies.addEventListener('click', (e) => {
  if (!e.target.dataset.cookie) return;
  try { localStorage.setItem('cookies', e.target.dataset.cookie); } catch {}
  cookies.hidden = true;
});

// Entrada suave dos blocos
const itens = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
  }), { threshold: .12 });
  itens.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; obs.observe(el); });
} else {
  itens.forEach((el) => el.classList.add('in'));
}
