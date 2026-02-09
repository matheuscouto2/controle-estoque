package com.controle.estoque.indicadores;

import com.controle.estoque.movimentacoes.Movimentacao;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MovimentacaoDTO(
        String tipo,
        String produto,
        int quantidade,
        LocalDate data
) {
    public MovimentacaoDTO(Movimentacao m) {
        this(m.getTipo(), m.getProduto().getNome(), m.getQuantidade(), m.getData());
    }
}