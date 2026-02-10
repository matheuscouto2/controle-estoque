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

let pagMovimentacoes;

async function carregarMovimentacoes() {
  const data = await request('/movimentacoes');
  pagMovimentacoes = criarPaginacao(data, 5);
  renderMovimentacoes();
}

function renderMovimentacoes() {
  const tbody = document.querySelector('#tblMovimentacoes tbody');
  tbody.innerHTML = '';

  getPagina(pagMovimentacoes).forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td style="width: 15%;">
          <span class="badge ${m.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'}">
            ${m.tipo}
          </span>
        </td>
        <td style="width: 10%;">${formatarData(m.data)}</td>
        <td>${m.produtoNome}</td>
        <td class="col-center">${m.quantidade}</td>
      `;
    tbody.appendChild(tr);
  });

  renderPaginacao(pagMovimentacoes, 'pagMovimentacoes', renderMovimentacoes);
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

function formatarData(dataISO) {
    if (!dataISO) return "";

    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}