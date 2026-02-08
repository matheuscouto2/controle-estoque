package com.controle.estoque.produtos;

import com.controle.estoque.categorias.Categoria;
import com.controle.estoque.fornecedores.Fornecedor;

public record DadosListagemProduto(Long id, String nome, Long categoriaId, String categoriaNome, Long fornecedorId, String fornecedorNome, int quantidade, int minima, double valor) {
    public DadosListagemProduto(Produto dados) {
        this(dados.getId(), dados.getNome(), dados.getCategoria().getId(), dados.getCategoria().getNome(), dados.getFornecedor().getId(), dados.getFornecedor().getNome(), dados.getQuantidade(), dados.getMinima(), dados.getValor());
    }
}
