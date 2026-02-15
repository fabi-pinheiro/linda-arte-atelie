<script>
(function WAminiPower(){
  const waBubble = document.getElementById('wa-bubble');
  const waPanel  = document.getElementById('wa-panel');
  const waClose  = document.getElementById('wa-close');
  const panelBody = waPanel.querySelector('.max-h-[48vh]');
  const input = document.getElementById('wa-input');
  const sendBtn = document.getElementById('wa-send');
  const WA_NUMBER = '5524999995793';

  let state = {
    flow: null,
    tipoEvento: null,
    tema: null,
    data: null,
    cidade: null,
    pessoas: null,
    pacote: null
  };

  const temasComuns = ['Floral', 'Candy', 'Boho', 'Botânico', 'Clean', 'Unicórnio', 'Dinossauro', 'Ursinho', 'Chá de Bebê', 'Safari', 'Natal', 'Réveillon', 'Outro'];

  const bubble = (html, me = false) => {
    const el = document.createElement('div');
    el.className = `max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md mb-3 ${me ? 'ml-auto bg-rose-600 text-white' : 'bg-white text-slate-700 border border-rose-100'}`;
    el.innerHTML = html;
    panelBody.appendChild(el);
    panelBody.scrollTop = panelBody.scrollHeight;
    return el;
  };

  const chips = (items) => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap gap-3 mt-3';
    items.forEach(({label, value}) => {
      const b = document.createElement('button');
      b.className = 'px-4 py-2 rounded-full bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200 transition';
      b.textContent = label;
      b.onclick = () => handleUserChoice(value);
      wrap.appendChild(b);
    });
    return wrap;
  };

  const askDate = (callback) => {
    const wrap = document.createElement('div');
    wrap.className = 'mt-3 flex gap-2';
    const i = document.createElement('input');
    i.type = 'date';
    i.className = 'px-3 py-2 rounded-lg border border-rose-200 flex-1';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.className = 'px-4 py-2 bg-rose-600 text-white rounded-lg';
    btn.onclick = () => {
      if (i.value) callback(i.value.split('-').reverse().join('/'));
    };
    wrap.appendChild(i);
    wrap.appendChild(btn);
    return wrap;
  };

  const askText = (placeholder, callback) => {
    const wrap = document.createElement('div');
    wrap.className = 'mt-3 flex gap-2';
    const i = document.createElement('input');
    i.type = 'text';
    i.placeholder = placeholder;
    i.className = 'px-3 py-2 rounded-lg border border-rose-200 flex-1';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.className = 'px-4 py-2 bg-rose-600 text-white rounded-lg';
    btn.onclick = () => {
      if (i.value.trim()) callback(i.value.trim());
    };
    wrap.appendChild(i);
    wrap.appendChild(btn);
    return wrap;
  };

  const askNumber = (callback) => askText('Quantas pessoas (aprox.)?', callback);

  const sendToWA = () => {
    let msg = 'Olá! Quero orçamento.\n';
    if (state.tipoEvento) msg += `Evento: ${state.tipoEvento}\n`;
    if (state.tema) msg += `Tema: ${state.tema}\n`;
    if (state.data) msg += `Data: ${state.data}\n`;
    if (state.cidade) msg += `Cidade: ${state.cidade}\n`;
    if (state.pessoas) msg += `Pessoas: ≈ ${state.pessoas}\n`;
    if (state.pacote) msg += `Pacote interessado: ${state.pacote}\n`;
    msg += '\nPode me ajudar? 😊';

    const link = document.createElement('a');
    link.href = `https://web.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(msg)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'inline-block mt-4 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition';
    link.textContent = 'Enviar tudo no WhatsApp 💬';
    return link;
  };

  const finalize = () => {
    const recap = `Perfeito! Aqui está o resumo:<br/>
    🎉 <strong>${state.tipoEvento || 'Evento'}</strong><br/>
    🎨 Tema: <strong>${state.tema || 'A definir'}</strong><br/>
    📅 Data: <strong>${state.date || 'A definir'}</strong><br/>
    📍 Cidade: <strong>${state.cidade || 'A definir'}</strong><br/>
    👥 Pessoas: <strong>${state.pessoas || 'A definir'}</strong><br/>
    📦 Pacote: <strong>${state.pacote || 'A definir'}</strong>`;

    const box = bubble(recap);
    box.appendChild(sendToWA());
    bubble('Estou te transferindo para o WhatsApp agora! Em breve alguém do time vai te atender ❤️');
  };

  const handleUserChoice = (value) => {
    bubble(value, true);

    if (state.flow === 'tipoEvento') {
      state.tipoEvento = value;
      bubble(`Ótimo! Um ${value.toLowerCase()} fica lindo. Qual o <strong>tema</strong> que você tem em mente?`);
      state.flow = 'tema';
      const chipsBox = bubble('');
      chipsBox.appendChild(chips(temasComuns.map(t => ({label: t, value: t}))));
    } else if (state.flow === 'tema') {
      state.tema = value;
      bubble('Tema anotado! Agora me conta: qual a <strong>data</strong> aproximada?');
      const dateBox = bubble('');
      dateBox.appendChild(askDate(d => { state.data = d; nextStepAfterData(); }));
    } else if (['orcamento', 'disponibilidade', 'tema'].includes(state.flow)) {
      // já tratado abaixo
    }
  };

  const nextStepAfterData = () => {
    bubble(`Data: ${state.data}. Em qual <strong>cidade/bairro</strong>?`);
    const cityBox = bubble('');
    cityBox.appendChild(askText('Ex: Belo Horizonte - Centro', c => {
      state.cidade = c;
      bubble(`Cidade: ${c}. Quantas <strong>pessoas</strong> aproximadamente?`);
      const peopleBox = bubble('');
      peopleBox.appendChild(askNumber(p => {
        state.pessoas = p;
        bubble(`≈ ${p} pessoas. Quer o pacote Básico (R$69) ou Completo (R$89)?`);
        const pacoteBox = bubble('');
        pacoteBox.appendChild(chips([
          {label: 'Básico R$69', value: 'Básico'},
          {label: 'Completo R$89', value: 'Completo'},
          {label: 'Personalizado', value: 'Personalizado'}
        ]));
        state.flow = 'pacote';
      }));
    }));
  };

  const processMessage = (text) => {
    const lower = text.toLowerCase();

    if (!state.flow) {
      if (lower.includes('orçamento') || lower.includes('preço') || lower.includes('quanto custa')) {
        state.flow = 'orcamento';
        bubble('Ótimo! Vamos montar um orçamento rapidinho. Primeiro: qual o <strong>tipo de evento</strong>?');
        const chipsBox = bubble('');
        chipsBox.appendChild(chips([
          {label: 'Chá de Bebê', value: 'Chá de Bebê'},
          {label: 'Aniversário Infantil', value: 'Aniversário Infantil'},
          {label: 'Mesa Posta Adulto', value: 'Mesa Posta Adulto'},
          {label: 'Natal/Réveillon', value: 'Natal/Réveillon'},
          {label: 'Outro', value: 'Outro evento'}
        ]));
        state.flow = 'tipoEvento';
      } else if (lower.includes('disponibilidade') || lower.includes('data disponível')) {
        state.flow = 'disponibilidade';
        bubble('Claro! Me diz a <strong>data</strong> que você está pensando:');
        const dateBox = bubble('');
        dateBox.appendChild(askDate(d => {
          state.data = d;
          bubble(`Data: ${d}. E a <strong>cidade/bairro</strong>?`);
          const cityBox = bubble('');
          cityBox.appendChild(askText('Ex: BH Centro', c => {
            state.cidade = c;
            bubble(`Vou checar a agenda para ${d} em ${c}. Te passo no WhatsApp em minutos!`);
            const box = bubble('');
            box.appendChild(sendToWA());
          }));
        }));
      } else if (lower.includes('tema')) {
        state.flow = 'tema';
        bubble('Temas mais pedidos: Floral, Candy, Boho, Botânico, Clean, Unicórnio, Dinossauro, Ursinho... Qual você curte?');
        const chipsBox = bubble('');
        chipsBox.appendChild(chips(temasComuns.map(t => ({label: t, value: t}))));
      } else {
        bubble('Oi! Posso te ajudar com orçamento, disponibilidade, temas ou frete. É só falar o que precisa 💕');
      }
    } else if (state.flow === 'pacote') {
      state.pacote = text;
      finalize();
    }
  };

  // Eventos
  waBubble?.addEventListener('click', () => {
    waPanel.classList.remove('hidden');
    input.disabled = false;
    sendBtn.classList.remove('hidden');
  });
  waClose?.addEventListener('click', () => waPanel.classList.add('hidden'));

  sendBtn.onclick = () => {
    if (input.value.trim()) {
      bubble(input.value, true);
      processMessage(input.value);
      input.value = '';
    }
  };
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendBtn.click(); });

  // Mensagem inicial
  setTimeout(() => {
    bubble('Oi! Sou a assistente virtual do Linda Arte Ateliê 💕<br/>Posso te ajudar com orçamento, disponibilidade, temas ou dúvidas. É só falar!');
  }, 800);
})();
</script>
