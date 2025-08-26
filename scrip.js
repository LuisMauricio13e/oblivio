const produtos = [
  {
    id: 1,
    nome: "Colar Tribal",
    categoria: "colares",
    preco: 45.00,
    imagem: "img/colar.jpg",
    descricao: "Feito com sementes amazônicas."
  },
  {
    id: 2,
    nome: "Pulseira Lunar",
    categoria: "pulseiras",
    preco: 30.00,
    imagem: "img/pulseira.jpg",
    descricao: "Inspirada nas fases da lua."
  },
  {
    id: 3,
    nome: "Totem de Madeira",
    categoria: "decoracao",
    preco: 80.00,
    imagem: "img/totem.jpg",
    descricao: "Escultura artesanal com símbolos alternativos."
  }
];

function exibirProdutos(lista) {
  const catalogo = document.getElementById("catalogo");
  catalogo.innerHTML = "";
  lista.forEach(produto => {
    catalogo.innerHTML += `
      <div class="card">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h2>${produto.nome}</h2>
        <p>${produto.descricao}</p>
        <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
      </div>
    `;
  });
}

function filtrarCategoria(categoria) {
  if (categoria === "todos") {
    exibirProdutos(produtos);
  } else {
    const filtrados = produtos.filter(p => p.categoria === categoria);
    exibirProdutos(filtrados);
  }
}

function adicionarAoCarrinho(id) {
  alert(`Produto ${id} adicionado ao carrinho!`);
}

document.getElementById("busca").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  exibirProdutos(filtrados);
});

document.getElementById("loginBtn").addEventListener("click", function () {
  window.location.href = "login.html";
});

exibirProdutos(produtos);

