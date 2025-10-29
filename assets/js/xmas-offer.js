
(function xmasOffer(){
  if (!document.body.classList.contains('christmas')) return;

  const WA_NUMBER = '5524999995793';
  const COUPON = 'NATAL5';
  const OFFER_DEADLINE = (() => {
    const y = new Date().getFullYear();
    return new Date(y, 11, 31, 23, 59, 59); // 31/12
  })();

  const root = document.getElementById('xmas-offer');
  const dialog = root?.querySelector('[role="dialog"]');
  const btnClose = document.getElementById('xmas-offer-close');
  const coupon = document.getElementById('xmas-coupon');
  const btnCopy = document.getElementById('xmas-copy');
  const wa = document.getElementById('xmas-wa');
  const deadline = document.getElementById('xmas-deadline');
  if (!root || !dialog || !wa) return;

  try { deadline.textContent = OFFER_DEADLINE.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' }); }
  catch { deadline.textContent = '31/12'; }

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const waBase = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
  const msg = `Olá! Quero aproveitar a oferta de Natal 🎄
Cupom: ${COUPON}
Evento: [data] • [cidade] • [tema]
Poderiam verificar disponibilidade e me enviar o orçamento?`;
  wa.href = `${waBase}?phone=${WA_NUMBER}&text=${encodeURIComponent(msg)}`;

  let lastFocused = null;
  function open() {
    if (sessionStorage.getItem('xmas_offer_seen') === '1') return;
    root.classList.remove('hidden');
    root.removeAttribute('aria-hidden');
    lastFocused = document.activeElement;
    setTimeout(()=> btnClose?.focus(), 0);
    document.addEventListener('keydown', onKey);
    sessionStorage.setItem('xmas_offer_seen','1');
  }
  function close() {
    root.classList.add('hidden');
    root.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', onKey);
    lastFocused && lastFocused.focus?.();
  }
  function onKey(e){
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const focusables = dialog.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length-1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  btnClose?.addEventListener('click', close);
  root.querySelector('.absolute.inset-0')?.addEventListener('click', close);
  btnCopy?.addEventListener('click', async ()=> {
    try { await navigator.clipboard.writeText(COUPON); btnCopy.textContent = 'Copiado!'; setTimeout(()=> btnCopy.textContent = 'Copiar', 1800); }
    catch { btnCopy.textContent = 'Falhou :('; setTimeout(()=> btnCopy.textContent = 'Copiar', 1800); }
  });

  const showAfter = setTimeout(open, 6000);
  let scrolled = false;
  const onScroll = () => {
    if (scrolled) return;
    const pct = (window.scrollY || document.documentElement.scrollTop) / (document.documentElement.scrollHeight - innerHeight);
    if (pct >= 0.5) { scrolled = true; open(); window.removeEventListener('scroll', onScroll); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  let exitArmed = true;
  document.addEventListener('mousemove', (e) => {
    if (!exitArmed) return;
    if (e.clientY < 10) { open(); exitArmed = false; }
  });

  if (Date.now() > +OFFER_DEADLINE) {
    clearTimeout(showAfter);
    window.removeEventListener('scroll', onScroll);
  }
})();
