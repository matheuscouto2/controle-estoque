// movimentacoes.js
document.addEventListener('DOMContentLoaded', () => {
  carregarMovimentacoes();
  carregarProdutos();

  const form = document.getElementById('formMovimentacao');
  form.addEventListener('submit', salvarMovimentacao);
});

async function carregarProdutos() {
  try {
    const produtos = await request('/produtos', { method: 'GET' });
    const select = document.getElementById('produtoMov');

    select.innerHTML = produtos.map(p =>
      `<option value="${p.id}" data-qtd="${p.quantidade}">
        ${p.nome} (Estoque: ${p.quantidade})
      </option>`
    ).join('');
  } catch (err) {
    console.error('Erro ao carregar produtos', err);
  }
}

async function carregarMovimentacoes() {
  try {
    const data = await request('/movimentacoes', { method: 'GET' });
    const tbody = document.getElementById('tblMovimentacoes');
    tbody.innerHTML = '';

    data.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="width: 10%;">
          <span class="badge ${m.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'}">
            ${m.tipo}
          </span>
        </td>
        <td>${m.produtoNome}</td>
        <td>${m.quantidade}</td>
        <td>${m.data}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar movimentações', err);
  }
}

async function salvarMovimentacao(e) {
  e.preventDefault();

  const produtoId = document.getElementById('produtoMov').value;
  const tipo = document.getElementById('tipoMov').value;
  const quantidade = Number(document.getElementById('qtdMov').value);
  const data = document.getElementById('dataMov').value;

  const option = document.getElementById('produtoMov').selectedOptions[0];
  const estoqueAtual = Number(option.dataset.qtd);

  if (tipo === 'SAIDA' && quantidade > estoqueAtual) {
    alert('Quantidade maior que o estoque disponível!');
    return;
  }

  try {
    await request('/movimentacoes', {
      method: 'POST',
      body: JSON.stringify({
        produtoId: produtoId,
        tipo,
        quantidade,
        data
      })
    });

    const modalEl = document.getElementById('modalMovimentacao');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    document.getElementById('formMovimentacao').reset();

    carregarMovimentacoes();
    carregarProdutos();
  } catch (err) {
    console.error('Erro ao salvar movimentação', err);
  }
}
