
// Neve e ajustes só se <body> tiver classe 'christmas'
(function snowfall(){
  if (!document.body.classList.contains('christmas')) return;
  const root = document.getElementById('snow');
  if (!root) return;
  const COUNT = Math.min(100, Math.floor(window.innerWidth / 10));
  for (let i = 0; i < COUNT; i++){
    const flake = document.createElement('i');
    flake.className = 'snowflake';
    const size = 2 + Math.random()*5;
    flake.style.width = size+'px';
    flake.style.height = size+'px';
    flake.style.left = (Math.random()*100)+'vw';
    flake.style.animationDelay = (Math.random()*10)+'s';
    flake.style.animationDuration = (8 + Math.random()*6)+'s, ' + (5 + Math.random()*3)+'s';
    root.appendChild(flake);
  }
})();
