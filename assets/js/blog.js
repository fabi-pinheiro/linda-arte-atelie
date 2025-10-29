// Ano
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Barra de progresso de leitura
const progress = document.getElementById('progress');
function onScrollProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  if (progress) progress.style.width = (scrolled * 100) + '%';
}
addEventListener('scroll', onScrollProgress, { passive:true });

// TOC automático (h2 e h3)
(function buildTOC(){
  const toc = document.querySelector('#toc ol');
  if(!toc) return;
  const headings = document.querySelectorAll('.article-body h2, .article-body h3');
  toc.innerHTML = '';
  headings.forEach((h, idx) => {
    if(!h.id){ h.id = 'sec-' + (idx+1); }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace(/^[0-9\)\.]+\s*/,'').trim();
    if(h.tagName === 'H3'){ li.style.marginLeft = '8px'; li.style.fontSize = '.95rem'; }
    li.appendChild(a); toc.appendChild(li);
  });
})();

// Tempo de leitura (~200 wpm)
(function readTime(){
  const body = document.querySelector('.article-body');
  const out = document.getElementById('readtime');
  if(!body || !out) return;
  const text = body.innerText || '';
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  out.textContent = `~${mins} min de leitura`;
})();

// Compartilhamento
(function share(){
  const url = location.href;
  const title = document.querySelector('h1')?.textContent || 'Confira este post';
  const wa = document.getElementById('share-wa');
  const tw = document.getElementById('share-tw');
  const fb = document.getElementById('share-fb');
  const cp = document.getElementById('copy-link');

  if(wa) wa.href = `https://wa.me/?text=${encodeURIComponent(title+' — '+url)}`;
  if(tw) tw.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  if(fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if(cp) cp.addEventListener('click', (e)=>{ 
    e.preventDefault(); 
    navigator.clipboard.writeText(url).then(()=>{
      cp.textContent='Link copiado!'; 
      setTimeout(()=>cp.textContent='Copiar link',1800);
    });
  });
})();

// Lazy images com blur-up
(function lazy(){
  const imgs = document.querySelectorAll('img[loading="lazy"], img.lazy');
  if(!imgs.length) return;
  const obs = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const ds = el.dataset.src;
      if(ds){ el.src = ds; }
      el.onload = () => el.classList.add('loaded');
      obs.unobserve(el);
    });
  },{ rootMargin: '120px' }) : null;

  imgs.forEach(img=>{
    if(obs) obs.observe(img);
    else if(img.dataset.src){ img.src = img.dataset.src; }
  });
})();
