// fornecedores.js
document.addEventListener('DOMContentLoaded', () => {
  carregarFornecedores();
  const form = document.getElementById('formFornecedor');
  form.addEventListener('submit', salvarFornecedor);
});

async function carregarFornecedores() {
  try {
    const data = await request('/fornecedores', { method: 'GET' });
    const tbody = document.querySelector('#tblFornecedores tbody');
    tbody.innerHTML = '';

    data.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="width: 10%;">
          <button class="btn-edit"
            onclick="editarFornecedor(${f.id}, '${f.nome.replace(/'/g, "\\'")}', '${(f.telefone || '').replace(/'/g, "\\'")}')">
            Editar
          </button>
          <button class="btn-delete"
            onclick="excluirFornecedor(${f.id})">
            Excluir
          </button>
        </td>
        <td style="display: none;">${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.telefone || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar fornecedores', err);
  }
}

function editarFornecedor(id, nome, telefone) {
  document.getElementById('fornecedorId').value = id;
  document.getElementById('nomeFornecedor').value = nome;
  document.getElementById('telefoneFornecedor').value = telefone;

  const modal = new bootstrap.Modal(document.getElementById('modalFornecedor'));
  modal.show();
}

async function salvarFornecedor(e) {
  e.preventDefault();

  const id = document.getElementById('fornecedorId').value;
  const nome = document.getElementById('nomeFornecedor').value.trim();
  const telefone = document.getElementById('telefoneFornecedor').value.trim();

  try {
    if (id) {
      await request('/fornecedores', {
        method: 'PUT',
        body: JSON.stringify({ id, nome, telefone }),
      });
    } else {
      await request('/fornecedores', {
        method: 'POST',
        body: JSON.stringify({ nome, telefone }),
      });
    }

    // fechar modal
    const modalEl = document.getElementById('modalFornecedor');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // limpar
    document.getElementById('fornecedorId').value = '';
    document.getElementById('nomeFornecedor').value = '';
    document.getElementById('telefoneFornecedor').value = '';

    carregarFornecedores();
  } catch (err) {
    console.error('Erro ao salvar fornecedor', err);
  }
}

async function excluirFornecedor(id) {
  if (!confirm('Confirmar exclusão?')) return;

  try {
    await request(`/fornecedores/${id}`, { method: 'DELETE' });
    carregarFornecedores();
  } catch (err) {
    console.error('Erro ao excluir fornecedor', err);
  }
}
