document.addEventListener("DOMContentLoaded", () => {
  carregarFornecedores();
  const form = document.getElementById("formFornecedor");
  form.addEventListener("submit", salvarFornecedor);
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

let pagFornecedores;

async function carregarFornecedores() {
  const data = await request('/fornecedores');
  pagFornecedores = criarPaginacao(data, 10);
  renderFornecedores();
}

function renderFornecedores() {
  const tbody = document.querySelector('#tblFornecedores tbody');
  tbody.innerHTML = '';

  getPagina(pagFornecedores).forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td style="display: none;">${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.telefone || "-"}</td>
        <td style="width: 15%; text-align: right;">
          <button class="btn-edit"
            onclick="editarFornecedor(${f.id}, '${f.nome.replace(/'/g, "\\'")}', '${(f.telefone || "").replace(/'/g, "\\'")}')">
            <i class="fa fa-edit" style="margin-right: 5px;"></i>Editar
          </button>
          <button class="btn-delete"
            onclick="excluirFornecedor(${f.id})">
            <i class="fa fa-trash" style="margin-right: 5px;"></i>Excluir
          </button>
        </td>
      `;
    tbody.appendChild(tr);
  });

  renderPaginacao(pagFornecedores, 'pagFornecedores', renderFornecedores);
}

function editarFornecedor(id, nome, telefone) {
  document.getElementById("fornecedorId").value = id;
  document.getElementById("nomeFornecedor").value = nome;
  document.getElementById("telefoneFornecedor").value = telefone;

  const modal = new bootstrap.Modal(document.getElementById("modalFornecedor"));
  modal.show();
}

async function salvarFornecedor(e) {
  e.preventDefault();

  const id = document.getElementById("fornecedorId").value;
  const nome = document.getElementById("nomeFornecedor").value.trim();
  const telefone = document.getElementById("telefoneFornecedor").value.trim();

  if (!nome || !telefone) {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Todos os campos são obrigatórios"
        });
        return;
    }

  try {
    if (id) {
      await request("/fornecedores", {
        method: "PUT",
        body: JSON.stringify({ id, nome, telefone }),
      });
    } else {
      await request("/fornecedores", {
        method: "POST",
        body: JSON.stringify({ nome, telefone }),
      });
    }

    const modalEl = document.getElementById("modalFornecedor");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    document.getElementById("fornecedorId").value = "";
    document.getElementById("nomeFornecedor").value = "";
    document.getElementById("telefoneFornecedor").value = "";

    carregarFornecedores();
  } catch (err) {
    console.error("Erro ao salvar fornecedor", err);
  }
}

async function excluirFornecedor(id) {
  if (!confirm("Confirmar exclusão?")) return;

  try {
    await request(`/fornecedores/${id}`, { method: "DELETE" });
    carregarFornecedores();
  } catch (err) {
    console.error("Erro ao excluir fornecedor", err);
  }
}
