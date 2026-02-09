package com.controle.estoque.produtos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ProdutoRepositorio extends JpaRepository<Produto, Long> {
    @Query("SELECT COUNT(p) FROM produtos p WHERE p.quantidade <= p.minima")
    long countProdutosAbaixoDoMinimo();

    @Query("SELECT p FROM produtos p WHERE p.quantidade <= p.minima")
    List<Produto> findProdutosAbaixoDoMinimo();

    @Query("SELECT SUM(p.quantidade * p.valor) FROM produtos p")
    BigDecimal valorTotalEstoque();
}