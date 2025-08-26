const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnEntrar = document.getElementById('btnEntrar');
const mensagemDiv = document.getElementById('mensagem');

const usuariosDemo = [
  { email: 'admin@oblivio.com', senha: '123456', nome: 'Administrador' },
  { email: 'user@oblivio.com', senha: 'user123', nome: 'Usuário Demo' }
];

function mostrarMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo} show`;
  setTimeout(() => mensagemDiv.classList.remove('show'), 5000);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarFormulario() {
  let valido = true;
  document.querySelectorAll('.erro-campo').forEach(e => e.textContent = '');

  if (!emailInput.value.trim()) {
    document.getElementById('email-erro').textContent = 'Email é obrigatório';
    valido = false;
  } else if (!validarEmail(emailInput.value.trim())) {
    document.getElementById('email-erro').textContent = 'Email inválido';
    valido = false;
  }

  if (!senhaInput.value) {
    document.getElementById('senha-erro').textContent = 'Senha é obrigatória';
    valido = false;
  } else if (senhaInput.value.length < 3) {
    document.getElementById('senha-erro').textContent = 'Senha muito curta';
    valido = false;
  }

  return valido;
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const usuario = usuariosDemo.find(u => u.email === emailInput.value.trim() && u.senha === senhaInput.value);
  if(usuario){
    mostrarMensagem(`Bem-vindo(a), ${usuario.nome}!`, 'sucesso');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } else {
    mostrarMensagem('Email ou senha incorretos', 'erro');
  }
});
