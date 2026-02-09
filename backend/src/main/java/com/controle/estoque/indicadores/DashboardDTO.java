package com.controle.estoque.indicadores;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
        long totalProdutos,
        long produtosBaixoEstoque,
        BigDecimal valorTotalEstoque,
        long entradasMes,
        long saidasMes,
        List<MovimentacaoDTO> ultimasMovimentacoes,
        List<GraficoDiaDTO> graficoEntradasSaidas,
        List<ProdutoBaixoEstoqueDTO> produtosCriticos
) {}