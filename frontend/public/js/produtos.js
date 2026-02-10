document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  carregarCombos();
  document.getElementById('formProduto').addEventListener('submit', salvarProduto);
});

async function carregarCombos() {
  const categorias = await request('/categorias');
  const fornecedores = await request('/fornecedores');

  categoriaProduto.innerHTML = categorias.map(c =>
    `<option value="${c.id}">${c.nome}</option>`
  ).join('');

  fornecedorProduto.innerHTML = fornecedores.map(f =>
    `<option value="${f.id}">${f.nome}</option>`
  ).join('');
}

async function carregarProdutos() {
  const data = await request('/produtos');
  const tbody = document.querySelector('#tblProdutos tbody');
  tbody.innerHTML = '';

  data.forEach(p => {
    const tr = document.createElement('tr');

    if (p.quantidade <= p.minima) {
      tr.classList.add('table-danger');
    }

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.categoriaNome}</td>
      <td>${p.fornecedorNome}</td>
      <td class="col-center">${p.quantidade}</td>
      <td class="col-center">${p.minima}</td>
      <td class="col-center">${formatarMoeda(p.valor)}</td>
      <td style="width: 15%;">
        <button class="btn-edit"
          onclick="editarProduto(${p.id})"><i class="fa fa-edit" style="margin-right: 5px;"></i>Editar</button>
        <button class="btn-delete"
          onclick="excluirProduto(${p.id})"><i class="fa fa-trash" style="margin-right: 5px;"></i>Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function editarProduto(id) {
  const p = await request(`/produtos/${id}`);

  produtoId.value = p.id;
  nomeProduto.value = p.nome;
  categoriaProduto.value = p.categoriaId;
  fornecedorProduto.value = p.fornecedorId;
  quantidadeProduto.value = p.quantidade;
  minimaProduto.value = p.minima;
  valorProduto.value = p.valor;

  new bootstrap.Modal(modalProduto).show();
}

async function salvarProduto(e) {
  e.preventDefault();

  const id = produtoId.value;
  const body = JSON.stringify({
    id,
    nome: nomeProduto.value,
    categoriaId: categoriaProduto.value,
    fornecedorId: fornecedorProduto.value,
    quantidade: quantidadeProduto.value,
    minima: minimaProduto.value,
    valor: valorProduto.value
  });

  await request('/produtos', {
    method: id ? 'PUT' : 'POST',
    body
  });

  bootstrap.Modal.getInstance(modalProduto).hide();
  formProduto.reset();
  carregarProdutos();
}

async function excluirProduto(id) {
  if (confirm('Excluir produto?')) {
    await request(`/produtos/${id}`, { method: 'DELETE' });
    carregarProdutos();
  }
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}