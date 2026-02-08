package com.controle.estoque.movimentacoes;

import java.time.LocalDate;

public record DadosListagemMovimentacao(Long id, Long produtoId, String produtoNome, String tipo, int quantidade, LocalDate data) {
    public DadosListagemMovimentacao(Movimentacao dados) {
        this(dados.getId(), dados.getProduto().getId(), dados.getProduto().getNome(), dados.getTipo(), dados.getQuantidade(), dados.getData());
    }
}
