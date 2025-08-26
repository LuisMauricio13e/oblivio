/* script.js - reorganizado e seguro (evento único, delegação, persistência snapshot) */

(() => {
  /* ---------- Dados (mantidos) ---------- */
  const produtos = [
    { id: 1, nome: "Colar Tribal Amazônico", categoria: "colares", preco: 45.00, imagem: "img/colar-tribal.jpg", descricao: "Colar artesanal feito com sementes amazônicas autênticas." },
    { id: 2, nome: "Pulseira Lunar Mística", categoria: "pulseiras", preco: 30.00, imagem: "img/pulseira-lunar.jpg", descricao: "Pulseira inspirada nas fases da lua com pedras naturais." },
    { id: 3, nome: "Totem Protetor de Madeira", categoria: "decoracao", preco: 80.00, imagem: "img/totem.jpg", descricao: "Escultura artesanal em madeira com símbolos de proteção." },
    { id: 4, nome: "Colar de Cristais Energéticos", categoria: "colares", preco: 65.00, imagem: "img/colar-cristais.jpg", descricao: "Colar com cristais selecionados para harmonização energética." },
    { id: 5, nome: "Pulseira de Âmbar Báltico", categoria: "pulseiras", preco: 120.00, imagem: "img/pulseira-ambar.jpg", descricao: "Pulseira com âmbar báltico autêntico, conhecido por suas propriedades curativas." },
    { id: 6, nome: "Anel Rúnico de Prata", categoria: "aneis", preco: 95.00, imagem: "img/anel-runico.jpg", descricao: "Anel em prata 925 com runas vikings gravadas à mão." },
    { id: 7, nome: "Incenso de Sálvia Branca", categoria: "incensos", preco: 25.00, imagem: "img/incenso-salvia.jpg", descricao: "Incenso natural de sálvia branca para limpeza energética." },
    { id: 8, nome: "Mandala Decorativa Grande", categoria: "decoracao", preco: 150.00, imagem: "img/mandala.jpg", descricao: "Mandala artesanal em madeira pintada à mão, 40cm de diâmetro." },
    { id: 9, nome: "Colar Pentagrama Gótico", categoria: "colares", preco: 55.00, imagem: "img/colar-pentagrama.jpg", descricao: "Colar com pentagrama em metal envelhecido, estilo gótico." },
    { id: 10, nome: "Pulseira Chakras Equilibrio", categoria: "pulseiras", preco: 40.00, imagem: "img/pulseira-chakras.jpg", descricao: "Pulseira com pedras representando os 7 chakras principais." },
    { id: 11, nome: "Anel Celta de Aço", categoria: "aneis", preco: 70.00, imagem: "img/anel-celta.jpg", descricao: "Anel com nó celta tradicional em aço inoxidável." },
    { id: 12, nome: "Kit Incensos Variados", categoria: "incensos", preco: 35.00, imagem: "img/kit-incensos.jpg", descricao: "Kit com 6 tipos diferentes de incensos naturais." }
  ];

  /* ---------- Estado local ---------- */
  let carrinho = []; // em memória: produtos reconstruídos com quantidade
  let produtosContainer, contadorCarrinho, modalCarrinho, itensCarrinhoContainer, totalCarrinhoSpan;
  let currentViewProdutos = produtos; // lista atualmente exibida

  /* ---------- Utils ---------- */
  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const escapeHTML = (s) => (typeof s === 'string') ? s.replace(/[&<>"'`=\/]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[c]) : s;

  /* ---------- Persistência (snapshot id+quantidade) ---------- */
  function salvarSnapshot() {
    const snap = carrinho.map(i => ({ id: i.id, quantidade: i.quantidade }));
    localStorage.setItem('carrinho', JSON.stringify(snap));
  }
  function carregarSnapshot() {
    const snap = JSON.parse(localStorage.getItem('carrinho') || '[]');
    carrinho = snap.map(s => {
      const p = produtos.find(x => x.id === s.id);
      return p ? ({ ...p, quantidade: s.quantidade }) : null;
    }).filter(Boolean);
  }

  /* ---------- Render de cards (uma única operação) ---------- */
  function renderProdutos(list) {
    currentViewProdutos = list;
    if (!produtosContainer) return;
    if (!list || list.length === 0) {
      produtosContainer.innerHTML = `<div class="sem-produtos"><h3>🔍 Nenhum produto encontrado</h3><p>Tente ajustar sua busca ou filtros.</p></div>`;
      return;
    }

    let html = '';
    list.forEach(p => {
      html += `
        <article class="card-produto" data-id="${p.id}" data-categoria="${escapeHTML(p.categoria)}" role="article">
          <img src="${escapeHTML(p.imagem)}" loading="lazy" width="400" height="200" alt="${escapeHTML(p.nome)}" onerror="this.src='img/placeholder.jpg'">
          <h3>${escapeHTML(p.nome)}</h3>
          <p>${escapeHTML(p.descricao)}</p>
          <div class="preco">${formatBRL(p.preco)}</div>
          <button class="btn-adicionar" data-id="${p.id}" aria-label="Adicionar ${escapeHTML(p.nome)} ao carrinho">Adicionar ao carrinho</button>
        </article>
      `;
    });

    produtosContainer.innerHTML = html;
  }

  /* ---------- Filtrar e buscar ---------- */
  function filtrarCategoria(categoria) {
    if (categoria === 'todos') {
      renderProdutos(produtos);
    } else {
      renderProdutos(produtos.filter(p => p.categoria === categoria));
    }
  }

  function buscarProdutos(termo) {
    const q = (termo || '').toLowerCase().trim();
    if (!q) { renderProdutos(produtos); return; }
    const resultado = produtos.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      p.descricao.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
    renderProdutos(resultado);
  }

  /* ---------- Carrinho (manipulação) ---------- */
  function atualizarContador() {
    if (!contadorCarrinho) return;
    const total = carrinho.reduce((s, it) => s + (Number(it.quantidade) || 0), 0);
    contadorCarrinho.textContent = total;
  }

  function atualizarModal() {
    if (!itensCarrinhoContainer || !totalCarrinhoSpan) return;
    if (!carrinho || carrinho.length === 0) {
      itensCarrinhoContainer.innerHTML = `<div class="carrinho-vazio"><h4>Seu carrinho está vazio.</h4><p>Adicione produtos para continuar.</p></div>`;
      totalCarrinhoSpan.textContent = formatBRL(0);
      return;
    }
    let html = '';
    let total = 0;
    carrinho.forEach(it => {
      total += it.preco * it.quantidade;
      html += `
        <div class="item-carrinho" data-id="${it.id}">
          <img src="${escapeHTML(it.imagem)}" loading="lazy" width="100" height="80" alt="${escapeHTML(it.nome)}" onerror="this.src='img/placeholder.jpg'">
          <div class="item-info">
            <h5>${escapeHTML(it.nome)}</h5>
            <div class="quantidade-controle">
              <button class="btn-quantidade diminui" data-id="${it.id}" aria-label="Diminuir quantidade">-</button>
              <span class="qtd">${it.quantidade}</span>
              <button class="btn-quantidade aumenta" data-id="${it.id}" aria-label="Aumentar quantidade">+</button>
            </div>
            <div class="item-preco">${formatBRL(it.preco * it.quantidade)}</div>
          </div>
          <button class="btn-remover" data-id="${it.id}" aria-label="Remover item">Remover</button>
        </div>
      `;
    });
    itensCarrinhoContainer.innerHTML = html;

    itensCarrinhoContainer.querySelectorAll('.btn-quantidade.diminui').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        const item = carrinho.find(i => i.id === id);
        if (item) {
          item.quantidade = Math.max(1, item.quantidade - 1);
          salvarSnapshot(); atualizarContador(); atualizarModal();
        }
      };
    });
    itensCarrinhoContainer.querySelectorAll('.btn-quantidade.aumenta').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        const item = carrinho.find(i => i.id === id);
        if (item) {
          item.quantidade += 1;
          salvarSnapshot(); atualizarContador(); atualizarModal();
        }
      };
    });
    itensCarrinhoContainer.querySelectorAll('.btn-remover').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        carrinho = carrinho.filter(i => i.id !== id);
        salvarSnapshot(); atualizarContador(); atualizarModal();
        mostrarNotificacao('Produto removido do carrinho.');
      };
    });
    totalCarrinhoSpan.textContent = formatBRL(total);
  }

  function adicionarAoCarrinho(id) {
    const item = produtos.find(p => p.id === id);
    if (!item) return;
    const existente = carrinho.find(c => c.id === id);
    if (existente) { existente.quantidade += 1; }
    else { carrinho.push({...item, quantidade:1}); }
    salvarSnapshot();
    atualizarContador();
    mostrarNotificacao(`"${item.nome}" adicionado ao carrinho.`);
  }

  /* ---------- Notificação ---------- */
  let timeoutNotif;
  function mostrarNotificacao(msg) {
    const el = document.getElementById('notificacao');
    const span = document.getElementById('mensagemNotificacao');
    if (!el || !span) return;
    span.textContent = msg;
    el.classList.add('show');
    clearTimeout(timeoutNotif);
    timeoutNotif = setTimeout(()=>el.classList.remove('show'), 2500);
  }

  /* ---------- Inicialização ---------- */
  function init() {
    produtosContainer = document.getElementById('produtos');
    contadorCarrinho = document.getElementById('contadorCarrinho');
    modalCarrinho = document.getElementById('modalCarrinho');
    itensCarrinhoContainer = document.getElementById('itensCarrinho');
    totalCarrinhoSpan = document.getElementById('totalCarrinho');

    // carregar snapshot localStorage
    carregarSnapshot();
    atualizarContador();

    // render inicial
    renderProdutos(produtos);

    // delegação: adicionar ao carrinho
    produtosContainer.addEventListener('click', e => {
      const btn = e.target.closest('.btn-adicionar');
      if (btn) adicionarAoCarrinho(Number(btn.dataset.id));
    });

    // busca
    document.getElementById('botao').onclick = () => buscarProdutos(document.getElementById('busca').value);

    // filtros categorias
    document.querySelectorAll('.categorias button').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.categorias button').forEach(b=>b.classList.remove('categoria-ativa'));
        btn.classList.add('categoria-ativa');
        filtrarCategoria(btn.dataset.categoria);
      };
    });

    // modal carrinho
    document.getElementById('carrinhoBtn').onclick = () => modalCarrinho.setAttribute('aria-hidden', 'false');
    modalCarrinho.querySelector('.fechar').onclick = () => modalCarrinho.setAttribute('aria-hidden', 'true');
    document.getElementById('limparCarrinho').onclick = () => { carrinho = []; salvarSnapshot(); atualizarContador(); atualizarModal(); };
    document.getElementById('finalizarCompra').onclick = () => { carrinho=[]; salvarSnapshot(); atualizarContador(); atualizarModal(); mostrarNotificacao('Compra finalizada!'); };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
