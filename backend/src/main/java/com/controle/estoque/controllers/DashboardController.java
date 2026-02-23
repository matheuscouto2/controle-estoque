package com.controle.estoque.controllers;

import com.controle.estoque.indicadores.*;
import com.controle.estoque.movimentacoes.MovimentacaoRepositorio;
import com.controle.estoque.movimentacoes.Movimentacao;
import com.controle.estoque.produtos.ProdutoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private ProdutoRepositorio produtoRepo;

    @Autowired
    private MovimentacaoRepositorio movRepo;

    @GetMapping
    public ResponseEntity<DashboardDTO> dashboard() {

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate inicio7Dias = hoje.minusDays(7);

        long totalProdutos = produtoRepo.count();
        long baixoEstoque = produtoRepo.countProdutosAbaixoDoMinimo();

        BigDecimal valorTotal = produtoRepo.valorTotalEstoque();
        if (valorTotal == null) valorTotal = BigDecimal.ZERO;

        Long entradasMes = movRepo.totalMes("ENTRADA", inicioMes, hoje);
        Long saidasMes = movRepo.totalMes("SAIDA", inicioMes, hoje);
        if (entradasMes == null) entradasMes = 0L;
        if (saidasMes == null) saidasMes = 0L;

        List<MovimentacaoDTO> ultimas = movRepo.findTop5ByOrderByDataDesc()
                .stream()
                .map(MovimentacaoDTO::new)
                .toList();

        List<GraficoDiaDTO> grafico = movRepo.entradasSaidasUltimos7Dias(inicio7Dias)
                .stream()
                .map(o -> new GraficoDiaDTO(
                        o[0].toString(),
                        o[1].toString(),
                        ((Number) o[2]).longValue()
                ))
                .toList();

        List<ProdutoBaixoEstoqueDTO> produtosCriticos = produtoRepo.findProdutosAbaixoDoMinimo()
                .stream()
                .map(ProdutoBaixoEstoqueDTO::new)
                .toList();

        DashboardDTO dto = new DashboardDTO(
                totalProdutos,
                baixoEstoque,
                valorTotal,
                entradasMes,
                saidasMes,
                ultimas,
                grafico,
                produtosCriticos
        );

        return ResponseEntity.ok(dto);
    }
}