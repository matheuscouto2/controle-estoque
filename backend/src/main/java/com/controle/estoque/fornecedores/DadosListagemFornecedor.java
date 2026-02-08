package com.controle.estoque.fornecedores;

public record DadosListagemFornecedor(Long id, String nome, String telefone) {
    public DadosListagemFornecedor(Fornecedor dados) {
        this(dados.getId(), dados.getNome(), dados.getTelefone());
    }
}
