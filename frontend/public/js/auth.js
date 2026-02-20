const apiBase = 'https://controle-estoque-e4nc.onrender.com';
const loginForm = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  showLoading();

  try {
    const res = await fetch(`${apiBase}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });

    if (!res.ok) throw new Error('Login inválido');

    const data = await res.json();
    const token = data.token || data.accessToken || null;

    if (!token) throw new Error('Resposta sem token');

    localStorage.setItem('authToken', token);
    window.location.href = 'index.html';

  } catch (err) {
    console.error(err);
    errorDiv.textContent = 'Usuário ou senha inválidos';
    errorDiv.classList.remove('d-none');

  } finally {
    hideLoading();
  }
});

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}