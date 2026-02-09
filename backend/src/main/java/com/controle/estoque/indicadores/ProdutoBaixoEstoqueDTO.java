package com.controle.estoque.indicadores;

import com.controle.estoque.produtos.*;

public record ProdutoBaixoEstoqueDTO(
        String nome,
        int quantidade
) {
    public ProdutoBaixoEstoqueDTO(Produto p) {
        this(p.getNome(), p.getQuantidade());
    }
}
