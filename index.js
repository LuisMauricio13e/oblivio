const botoesCategorias = document.querySelectorAll('.categorias button');
const produtos = document.querySelectorAll('.card-produto');

botoesCategorias.forEach(botao => {
  botao.addEventListener('click', () => {
    // Define botão ativo
    botoesCategorias.forEach(b => b.classList.remove('categoria-ativa'));
    botao.classList.add('categoria-ativa');

    const categoria = botao.dataset.categoria;

    produtos.forEach(produto => {
      if(categoria === 'artesanato' || produto.dataset.categoria === categoria) {
        produto.style.display = 'block';
      } else {
        produto.style.display = 'none';
      }
    });
  });
});
