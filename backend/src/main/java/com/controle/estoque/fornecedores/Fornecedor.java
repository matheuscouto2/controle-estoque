package com.controle.estoque.fornecedores;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "fornecedor")
@Entity(name = "fornecedores")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Fornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String telefone;

    public Fornecedor(DadosCadastroFornecedor dados) {
        this.nome = dados.nome();
        this.telefone = dados.telefone();
    }

    public void atualizaInformacoes(DadosAlteracaoFornecedor dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
    }
}
