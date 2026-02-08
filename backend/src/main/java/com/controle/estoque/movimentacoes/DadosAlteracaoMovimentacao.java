package com.controle.estoque.movimentacoes;

import java.time.LocalDate;

public record DadosAlteracaoMovimentacao(Long id, Long produtoId, String tipo, int quantidade, LocalDate data) { }
