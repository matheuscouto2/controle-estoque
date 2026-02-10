document.addEventListener("DOMContentLoaded", () => {
  carregarCategorias();
  const form = document.getElementById("formCategoria");
  form.addEventListener("submit", salvarCategoria);
});

function criarPaginacao(data, pageSize = 10) {
  return {
    data,
    pageSize,
    page: 1,
    totalPages: Math.ceil(data.length / pageSize)
  };
}

function getPagina(paginacao) {
  const start = (paginacao.page - 1) * paginacao.pageSize;
  return paginacao.data.slice(start, start + paginacao.pageSize);
}

function renderPaginacao(paginacao, ulId, onChange) {
  const ul = document.getElementById(ulId);
  ul.innerHTML = '';

  for (let i = 1; i <= paginacao.totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === paginacao.page ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.onclick = e => {
      e.preventDefault();
      paginacao.page = i;
      onChange();
    };
    ul.appendChild(li);
  }
}

let pagCategorias;

async function carregarCategorias() {
  const data = await request('/categorias');
  pagCategorias = criarPaginacao(data, 3);
  renderCategorias();
}

function renderCategorias() {
  const tbody = document.querySelector('#tblCategorias tbody');
  tbody.innerHTML = '';

  getPagina(pagCategorias).forEach(cat => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="display:none">${cat.id}</td>
      <td>${cat.nome}</td>
      <td style="width:15%; text-align:right">
        <button class="btn-edit"
          onclick="editarCategoria(${cat.id}, '${cat.nome.replace(/'/g, "\\'")}')">
          <i class="fa fa-edit"></i> Editar
        </button>
        <button class="btn-delete"
          onclick="excluirCategoria(${cat.id})">
          <i class="fa fa-trash"></i> Excluir
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPaginacao(pagCategorias, 'pagCategorias', renderCategorias);
}

function editarCategoria(id, nome) {
  document.getElementById("categoriaId").value = id;
  document.getElementById("nomeCategoria").value = nome;
  const modal = new bootstrap.Modal(document.getElementById("modalCategoria"));
  modal.show();
}

async function salvarCategoria(e) {
  e.preventDefault();
  const id = document.getElementById("categoriaId").value;
  const nome = document.getElementById("nomeCategoria").value.trim();

  try {
    if (id) {
      await request(`/categorias`, {
        method: "PUT",
        body: JSON.stringify({ id, nome }),
      });
    } else {
      await request("/categorias", {
        method: "POST",
        body: JSON.stringify({ nome }),
      });
    }
    const modalEl = document.getElementById("modalCategoria");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    document.getElementById("categoriaId").value = "";
    document.getElementById("nomeCategoria").value = "";
    carregarCategorias();
  } catch (err) {
    console.error("Erro ao salvar categoria", err);
  }
}

async function excluirCategoria(id) {
  if (!confirm("Confirmar exclusão?")) return;
  try {
    await request(`/categorias/${id}`, { method: "DELETE" });
    carregarCategorias();
  } catch (err) {
    console.error("Erro ao excluir categoria", err);
  }
}
