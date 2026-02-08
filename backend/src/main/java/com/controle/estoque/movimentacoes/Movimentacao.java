package com.controle.estoque.movimentacoes;

import com.controle.estoque.produtos.Produto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "movimentacao")
@Entity(name = "movimentacoes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Movimentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
    private String tipo;
    private int quantidade;
    private LocalDate data;

    public Movimentacao(DadosCadastroMovimentacao dados, Produto produto) {
        this.produto = produto;
        this.tipo = dados.tipo();
        this.quantidade = dados.quantidade();
        this.data = dados.data();
    }

    public void atualizaInformacoes(DadosAlteracaoMovimentacao dados, Produto produto) {
        if (produto != null) {
            this.produto = produto;
        }
        if (dados.tipo() != null) {
            this.tipo = dados.tipo();
        }
        if (dados.quantidade() != 0) {
            this.quantidade = dados.quantidade();
        }
        if (dados.data() != null) {
            this.data = dados.data();
        }
    }
}
