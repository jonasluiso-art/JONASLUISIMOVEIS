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
