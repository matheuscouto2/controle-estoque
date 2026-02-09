// api.js
const apiBase = 'http://localhost:8080'; // como acima, defina se necessário

function getToken() {
  return localStorage.getItem('authToken');
}

async function request(path, options = {}) {
  const url = `${apiBase}${path}`;
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Suporte JSON
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  // Tentar json, senão retornar texto
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}