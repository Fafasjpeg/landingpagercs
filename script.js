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
    aviso('Recebemos seus dados! Em breve um especialista entrará em contato.', 'ok');
  } catch {
    aviso('Não foi possível enviar agora. Tente novamente.', 'erro');
  } finally {
    btn.disabled = false;
  }
});

// Banner LGPD
const cookies = document.getElementById('cookies');
try { if (!localStorage.getItem('cookies')) cookies.hidden = false; } catch { cookies.hidden = false; }
cookies.addEventListener('click', (e) => {
  const acao = e.target.dataset.cookie;
  if (!acao) return;
  if (acao !== 'config') {
    try { localStorage.setItem('cookies', acao); } catch {}
  }
  cookies.hidden = true;
});
