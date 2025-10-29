
/**
 * Rotator de 4 imagens com troca por lote, shuffle/sequencial, pausa e preload.
 */
(function ImageQuadRotator(){
  const CFG = {
    container: '#galeria-rotativa',
    sources: [
      './IMGS/image_1.jpg','./IMGS/image_2.jpg','./IMGS/image_3.jpg','./IMGS/image_4.jpg',
      './IMGS/image_5.jpg','./IMGS/image_6.jpg','./IMGS/image_7.jpg','./IMGS/image_8.jpg',
      './IMGS/image_9.jpg','./IMGS/image_10.jpg','./IMGS/image_11.jpg','./IMGS/image_12.jpg'
    ],
    intervalMs: 6000,
    mode: 'shuffle',            // 'sequential' para ordem fixa
    batchSize: 4,
    preloadAhead: 6,
    fadeMs: 450,
    fallback: 'https://euaa.europa.eu/sites/default/files/styles/width_600px/public/default_images/news-default-big.png?itok=NNXAZZTc'
  };

  const grid = document.querySelector(CFG.container);
  if (!grid) return;
  const imgs = Array.from(grid.querySelectorAll('img')).slice(0, CFG.batchSize);
  if (imgs.length < CFG.batchSize) return;

  const shuffle = (arr) => arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]);

  const uniqueNextBatch = (() => {
    let index = 0;
    let pool = CFG.mode === 'shuffle' ? shuffle([...CFG.sources]) : [...CFG.sources];
    return () => {
      if (index >= pool.length || index + CFG.batchSize > pool.length) {
        pool = CFG.mode === 'shuffle' ? shuffle([...CFG.sources]) : [...CFG.sources];
        index = 0;
      }
      const batch = pool.slice(index, index + CFG.batchSize);
      index += CFG.batchSize;
      return batch;
    };
  })();

  const preload = (urls) => urls.forEach(u => { const im = new Image(); im.src = u; });

  const swapTo = (imgEl, newSrc) => new Promise(resolve => {
    imgEl.classList.add('is-fading');
    setTimeout(() => {
      imgEl.onload = () => { imgEl.classList.remove('is-fading'); resolve(); };
      imgEl.onerror = () => { imgEl.src = CFG.fallback; imgEl.classList.remove('is-fading'); resolve(); };
      imgEl.src = newSrc;
    }, CFG.fadeMs * 0.5);
  });

  // carregar se usam data-src
  imgs.forEach(img => {
    if (img.dataset && img.dataset.src && !img.src) {
      img.src = img.dataset.src;
      img.addEventListener('error', () => { img.src = CFG.fallback; }, { once: true });
    }
  });

  let paused = false;
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });
  grid.addEventListener('mouseenter', () => { paused = true; });
  grid.addEventListener('mouseleave', () => { paused = false; });

  const tick = async () => {
    if (paused) return;
    const batch = uniqueNextBatch();
    preload(batch.slice(0, CFG.preloadAhead));
    await Promise.all(imgs.map((el, i) => swapTo(el, batch[i])));
  };

  setInterval(tick, CFG.intervalMs);
})();
