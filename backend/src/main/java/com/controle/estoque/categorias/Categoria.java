package com.controle.estoque.categorias;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "categoria")
@Entity(name = "categorias")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    public Categoria(DadosCadastroCategoria dados) {
        this.nome = dados.nome();
    }

    public void atualizaInformacoes(DadosAlteracaoCategoria dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
    }
}
