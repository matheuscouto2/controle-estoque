package com.controle.estoque.produtos;

import com.controle.estoque.categorias.Categoria;
import com.controle.estoque.fornecedores.Fornecedor;

public record DadosCadastroProduto(String nome, Long categoriaId, Long fornecedorId, int quantidade, int minima, double valor) { }
