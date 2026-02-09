document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

/* -------------------- DASHBOARD -------------------- */
function loadDashboard() {
     fetch(apiBase + "/dashboard", {
        headers: getHeaders()
    })
        .then(r => {
            console.log(r.status);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text(); // pega como texto
        })
        .then(t => {
            if (!t) throw new Error('Resposta vazia da API');
            const d = JSON.parse(t); // converte para JSON
            renderDashboard(d);
        })
        .catch(err => console.error('Erro ao carregar dashboard', err));
}

function renderDashboard(d) {
    // Cards resumo
    document.getElementById("cards").innerHTML = `
        <div class="card">PRODUTOS <strong>${d.totalProdutos}</strong></div>
        <div class="card danger">ESTOQUE BAIXO <strong>${d.produtosBaixoEstoque}</strong></div>
        <div class="card">ENTRADAS MENSAL <strong>${d.entradasMes}</strong></div>
        <div class="card">SAÍDAS MENSAL <strong>${d.saidasMes}</strong></div>
        <div class="card success">VALOR ESTOQUE <strong>${formatarMoeda(d.valorTotalEstoque)}</strong></div>
    `;

    montarGraficoEntradasSaidas(d.graficoEntradasSaidas);
    montarGraficoBaixoEstoque(d.produtosCriticos);
    montarTabelaMovimentacoes(d.ultimasMovimentacoes);
}

function montarGraficoEntradasSaidas(dados) {
    const ctx = document.getElementById("graficoEntradasSaidas");
    if (!ctx) return;

    const labels = [...new Set(dados.map(d => d.data))];

    const entradas = labels.map(l =>
        dados.filter(d => d.data === l && d.tipo === "ENTRADA")
             .reduce((s, d) => s + d.quantidade, 0)
    );

    const saidas = labels.map(l =>
        dados.filter(d => d.data === l && d.tipo === "SAIDA")
             .reduce((s, d) => s + d.quantidade, 0)
    );

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                { label: "Entradas", data: entradas, borderColor: "#198754", backgroundColor: "rgba(25,135,84,0.2)" },
                { label: "Saídas", data: saidas, borderColor: "#dc3545", backgroundColor: "rgba(220,53,69,0.2)" }
            ]
        },
        options: { responsive: true }
    });
}

function montarGraficoBaixoEstoque(produtos) {
    const ctx = document.getElementById("graficoBaixoEstoque");
    if (!ctx) return;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: produtos.map(p => p.nome),
            datasets: [{
                label: "Quantidade",
                data: produtos.map(p => p.quantidade),
                backgroundColor: "#ffc107"
            }]
        },
        options: { responsive: true }
    });
}

function montarTabelaMovimentacoes(lista) {
    const tbody = document.querySelector("#tabelaMovimentacoes tbody");
    if (!tbody) return;

    tbody.innerHTML = lista.map(m => `
        <tr>
            <td style="width: 10%;">
                <span class="badge ${m.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'}">
                    ${m.tipo}
                </span>
            </td>
            <td>${m.produto}</td>
            <td>${m.quantidade}</td>
            <td>${formatarData(m.data)}</td>
        </tr>
    `).join("");
}

/* -------------------- UTILIDADES -------------------- */
function formatarMoeda(v) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("authToken")
    };
}