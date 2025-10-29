
// Ano dinâmico
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Aparecer ao rolar (reveal)
function onScrollReveal() {
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) el.classList.add('is-visible');
  });
}
window.addEventListener('scroll', onScrollReveal, { passive: true });
window.addEventListener('load', onScrollReveal);

// Lazy loading manual
(function lazyLoad(){
  const lazyImages = document.querySelectorAll('img.lazy');
  if (!lazyImages.length) return;
  const obs = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      obs.unobserve(img);
    });
  }) : null;
  lazyImages.forEach(img => obs ? obs.observe(img) : (img.src = img.dataset.src));
})();
