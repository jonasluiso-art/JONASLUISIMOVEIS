// WhatsApp do Jonas: todo link com data-wa vira wa.me com a mensagem do atributo
const WA = '5562984816360';
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa || 'Olá, Jonas! Vim pelo site.')}`;
  a.target = '_blank'; a.rel = 'noopener';
});

// cabeçalho sólido ao rolar
const topo = document.querySelector('.topo');
const solid = () => topo && topo.classList.toggle('solido', scrollY > 40);
addEventListener('scroll', solid, { passive: true }); solid();

// revelar ao rolar
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('on'), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// lightbox: qualquer <a data-lb> dentro de [data-galeria]
document.querySelectorAll('[data-galeria]').forEach(g => {
  const itens = [...g.querySelectorAll('a[data-lb]')];
  if (!itens.length) return;
  let lb = document.querySelector('.lb');
  if (!lb) {
    lb = document.createElement('div'); lb.className = 'lb';
    lb.innerHTML = '<button class="x" aria-label="Fechar">×</button><button class="p" aria-label="Anterior">‹</button><img alt=""><button class="n" aria-label="Próxima">›</button><div class="cap"></div>';
    document.body.append(lb);
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('x')) lb.classList.remove('on'); });
    addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') lb.classList.remove('on'); if (e.key === 'ArrowLeft') lb._go(-1); if (e.key === 'ArrowRight') lb._go(1); });
    lb.querySelector('.p').onclick = () => lb._go(-1);
    lb.querySelector('.n').onclick = () => lb._go(1);
  }
  let i = 0;
  // cada galeria navega só pelas próprias fotos
  const show = k => { i = (k + itens.length) % itens.length; lb.querySelector('img').src = itens[i].href; lb.querySelector('.cap').textContent = itens[i].dataset.lb; lb.classList.add('on'); lb._go = d => show(i + d); };
  itens.forEach((a, k) => a.addEventListener('click', e => { e.preventDefault(); show(k); }));
});

// ---- Pixel da Meta, só carrega após o visitante aceitar os cookies (LGPD) ----
const PIXEL = '862360542503781';
const lerConsent = () => { try { return localStorage.getItem('jl-cookies'); } catch (e) { return null; } };
const gravarConsent = v => { try { localStorage.setItem('jl-cookies', v); } catch (e) {} };
// envia evento só se o pixel estiver carregado; antes do aceite não faz nada
window.jlTrack = (...args) => { if (window.fbq) window.fbq(...args); };

function carregarPixel() {
  if (window.fbq) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL);
  fbq('track', 'PageView');
  const paginas = { '/inside-park-home': 'Inside Park Home', '/opus-compactos': 'Etiqueta Opus Compactos' };
  const nome = Object.keys(paginas).find(p => location.pathname.startsWith(p));
  if (nome) fbq('track', 'ViewContent', { content_name: paginas[nome], content_category: 'Oportunidade' });
}

// clique em qualquer link de WhatsApp = Lead
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*="wa.me/"]');
  if (a) jlTrack('track', 'Lead', { content_name: document.title, origem: (a.textContent || '').trim().slice(0, 60) });
});

if (lerConsent() === 'sim') carregarPixel();
else if (!lerConsent()) {
  const b = document.createElement('div');
  b.className = 'cookies'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
  b.innerHTML = '<p>Usamos cookies para medir visitas e melhorar os anúncios. Você aceita?</p><div><button type="button" data-c="nao">Recusar</button><button type="button" data-c="sim" class="ok">Aceitar</button></div>';
  b.addEventListener('click', e => {
    const v = e.target.dataset && e.target.dataset.c; if (!v) return;
    gravarConsent(v); b.remove(); if (v === 'sim') carregarPixel();
  });
  document.body.append(b);
}
