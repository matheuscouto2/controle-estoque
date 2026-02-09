// auth.js
const apiBase = 'http://localhost:8080'; // ex: 'https://api.seusite.com' ou vazio se mesmo domínio
const loginForm = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  try {
    const res = await fetch(`${apiBase}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });

    if (!res.ok) throw new Error('Login inválido');
    const data = await res.json();
    // supondo que retorna token; ajuste conforme sua API
    const token = data.token || data.accessToken || null;
    if (!token) throw new Error('Resposta sem token');

    localStorage.setItem('authToken', token);
    window.location.href = 'categorias.html'; // ou outra página inicial
  } catch (err) {
    console.error(err);
    errorDiv.textContent = 'Usuário ou senha inválidos';
    errorDiv.classList.remove('d-none');
  }
});

// Função de logout simples
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}