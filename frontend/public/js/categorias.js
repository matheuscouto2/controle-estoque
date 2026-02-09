document.addEventListener("DOMContentLoaded", () => {
  carregarCategorias();
  const form = document.getElementById("formCategoria");
  form.addEventListener("submit", salvarCategoria);
});

async function carregarCategorias() {
  try {
    const data = await request("/categorias", { method: "GET" });
    const tbody = document.querySelector("#tblCategorias tbody");
    tbody.innerHTML = "";
    data.forEach((cat) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="width: 10%;">
          <button class="btn-edit" onclick="editarCategoria(${cat.id}, '${cat.nome.replace(/'/g, "\\'")}')">Editar</button>
          <button class="btn-delete" onclick="excluirCategoria(${cat.id})">Excluir</button>
        </td>
        <td style="display: none;">${cat.id}</td>
        <td>${cat.nome}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar categorias", err);
  }
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
