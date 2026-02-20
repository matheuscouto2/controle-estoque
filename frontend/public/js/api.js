const apiBase = 'https://controle-estoque-e4nc.onrender.com';

function getToken() {
  return localStorage.getItem('authToken');
}

async function request(path, options = {}) {
  const url = `${apiBase}${path}`;
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}