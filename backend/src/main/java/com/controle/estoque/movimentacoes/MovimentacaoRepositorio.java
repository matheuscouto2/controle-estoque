package com.controle.estoque.movimentacoes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MovimentacaoRepositorio extends JpaRepository<Movimentacao, Long> {

    // Total de entradas ou saídas no mês, usando intervalo de datas
    @Query("""
        select sum(m.quantidade)
        from movimentacoes m
        where m.tipo = :tipo
          and m.data >= :inicio
          and m.data <= :fim
    """)
    Long totalMes(@Param("tipo") String tipo,
                  @Param("inicio") LocalDate inicio,
                  @Param("fim") LocalDate fim);

    // Últimas 10 movimentações
    List<Movimentacao> findTop5ByOrderByDataDesc();

    // Entradas e saídas dos últimos 7 dias
    @Query("""
        select m.data, m.tipo, sum(m.quantidade)
        from movimentacoes m
        where m.data >= :dataInicio
        group by m.data, m.tipo
        order by m.data
    """)
    List<Object[]> entradasSaidasUltimos7Dias(@Param("dataInicio") LocalDate dataInicio);
}
