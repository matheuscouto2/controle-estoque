package com.controle.estoque.movimentacoes;

import java.time.LocalDate;

public record DadosCadastroMovimentacao(Long produtoId, String tipo, int quantidade, LocalDate data) { }
