package com.controle.estoque.categorias;

public record DadosListagemCategoria(Long id, String nome) {
    public DadosListagemCategoria(Categoria dados) {
        this(dados.getId(), dados.getNome());
    }
}
