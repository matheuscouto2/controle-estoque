package com.controle.estoque.produtos;

import com.controle.estoque.categorias.Categoria;
import com.controle.estoque.fornecedores.Fornecedor;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "produto")
@Entity(name = "produtos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of =  "id")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;
    private int quantidade;
    private int minima;
    private double valor;

    public Produto(DadosCadastroProduto dados, Categoria categoria, Fornecedor fornecedor) {
        this.nome = dados.nome();
        this.categoria = categoria;
        this.fornecedor = fornecedor;
        this.quantidade = dados.quantidade();
        this.minima = dados.minima();
        this.valor = dados.valor();
    }

    public void atualizaInformacoes(DadosAlteracaoProduto dados, Categoria categoria, Fornecedor fornecedor) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (categoria != null) {
            this.categoria = categoria;
        }
        if (fornecedor != null) {
            this.fornecedor = fornecedor;
        }
        if (dados.quantidade() != 0) {
            this.quantidade = dados.quantidade();
        }
        if (dados.minima() != 0) {
            this.minima = dados.minima();
        }
        if (dados.valor() != 0) {
            this.valor = dados.valor();
        }
    }
}
