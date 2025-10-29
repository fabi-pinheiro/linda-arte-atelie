
(function WAmini(){
  const waBubble = document.getElementById('wa-bubble');
  const waPanel  = document.getElementById('wa-panel');
  const waClose  = document.getElementById('wa-close');
  const panelBody = document.querySelector('#wa-panel .p-4.space-y-3');
  const WA_NUMBER = '5524999995793';

  const bubble = (html, me=false) => {
    const el = document.createElement('div');
    el.className = `max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ${me ? 'ml-auto bg-rose-600 text-white' : 'bg-white text-slate-700 border border-rose-100'}`;
    el.innerHTML = html;
    panelBody.appendChild(el);
    panelBody.scrollTop = panelBody.scrollHeight;
    return el;
  };
  const chips = (items) => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap gap-2 mt-2';
    items.forEach(({label, onClick}) => {
      const b = document.createElement('button');
      b.className = 'px-3 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100';
      b.textContent = label;
      b.onclick = onClick;
      wrap.appendChild(b);
    });
    return wrap;
  };
  const askDate = (onPick) => {
    const w = document.createElement('div');
    w.className = 'mt-2 flex items-center gap-2';
    const i = document.createElement('input');
    i.type = 'date'; i.className = 'rounded-lg border px-3 py-1';
    const b = document.createElement('button');
    b.className = 'px-3 py-1 rounded-lg bg-rose-600 text-white'; b.textContent = 'OK';
    b.onclick = () => { if(i.value) onPick(i.value.split('-').reverse().join('/')); };
    w.appendChild(i); w.appendChild(b);
    return w;
  };
  const askCity = (onPick) => {
    const w = document.createElement('div');
    w.className = 'mt-2 flex items-center gap-2';
    const i = document.createElement('input'); i.placeholder = 'Cidade/Bairro'; i.className = 'rounded-lg border px-3 py-1';
    const b = document.createElement('button'); b.className = 'px-3 py-1 rounded-lg bg-rose-600 text-white'; b.textContent = 'OK';
    b.onclick = () => { if(i.value.trim()) onPick(i.value.trim()); };
    w.appendChild(i); w.appendChild(b);
    return w;
  };

  const state = { flow:null, theme:null, date:null, city:null, people:null };

  function stepTheme(next) {
    const box = bubble('Qual o <b>tema</b> do evento?');
    const options = ['Floral','Candy','Boho','Botânico','Clean','Outro'];
    box.appendChild(chips(options.map(t => ({ label:t, onClick:()=>{ state.theme=t; next(); } }))));
  }
  const stepDate = (next) => { const box = bubble('Qual a <b>data</b>?'); box.appendChild(askDate((d)=>{ state.date=d; next(); })); };
  const stepCity = (next) => { const box = bubble('Em qual <b>cidade/bairro</b> será?'); box.appendChild(askCity((c)=>{ state.city=c; next(); })); };
  function stepPeople(next) {
    const box = bubble('Quantas <b>pessoas</b> (aprox.)?');
    box.appendChild(chips([20,30,40,50,80,100].map(n => ({ label:String(n), onClick:()=>{ state.people=n; next(); } }))));
  }
  function finishOrcamento() {
    const recap = `Perfeito! Anotei:<br/>🎀 <b>${state.theme}</b> • 📅 <b>${state.date}</b> • 📍 <b>${state.city}</b> • 👥 <b>${state.people}</b>`;
    const box = bubble(recap + '<br/>Posso te enviar no WhatsApp agora:');
    const msg = `Olá! Quero orçamento.
Tema: ${state.theme}
Data: ${state.date}
Cidade: ${state.city}
Pessoas: ${state.people}`;
    const btn = document.createElement('a');
    btn.href = `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(msg)}`;
    btn.target = '_blank'; btn.rel = 'noopener';
    btn.className = 'inline-flex mt-2 px-4 py-2 rounded-xl bg-green-500 text-white';
    btn.textContent = 'Enviar no WhatsApp';
    box.appendChild(btn);
  }
  function startOrcamento(){ state.flow='orc'; state.theme=state.date=state.city=state.people=null; stepTheme(()=>stepDate(()=>stepCity(()=>stepPeople(finishOrcamento)))) }
  function startDisponibilidade(){
    state.flow='dispo'; state.date=state.city=null;
    stepDate(()=>stepCity(()=>{
      const box = bubble('Obrigado! Vou checar a agenda e já te retorno por WhatsApp.');
      const msg = `Olá! Gostaria de confirmar disponibilidade.
Data: ${state.date}
Cidade: ${state.city}`;
      const a = document.createElement('a');
      a.href = `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(msg)}`;
      a.target = '_blank'; a.rel = 'noopener';
      a.className = 'inline-flex mt-2 px-4 py-2 rounded-xl bg-green-500 text-white';
      a.textContent = 'Confirmar no WhatsApp';
      box.appendChild(a);
    }));
  }
  function startTemas(){ state.flow='temas'; const box=bubble('Temas mais pedidos: floral, candy, boho, botânico e clean. Quer escolher um?'); const options=['Floral','Candy','Boho','Botânico','Clean']; box.appendChild(chips(options.map(t=>({label:t,onClick:()=>{state.theme=t; startOrcamento();}})))); }

  waBubble?.addEventListener('click', () => waPanel.classList.remove('hidden'));
  waClose?.addEventListener('click', () => waPanel.classList.add('hidden'));
  document.querySelectorAll('.wa-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = (btn.dataset.q || btn.textContent).toLowerCase();
      if (text.includes('orçamento')) startOrcamento();
      else if (text.includes('disponibilidade') || text.includes('datas')) startDisponibilidade();
      else if (text.includes('tema')) startTemas();
    });
  });

  bubble('Oi! Posso ajudar com orçamento, disponibilidade, temas e frete. Use as opções acima 💗');
})();
