package com.controle.estoque.controllers;

import com.controle.estoque. movimentacoes.*;
import com.controle.estoque.produtos.Produto;
import com.controle.estoque.produtos.ProdutoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {
    @Autowired
    private MovimentacaoRepositorio movimentacaoRepositorio;
    @Autowired
    private ProdutoRepositorio produtoRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroMovimentacao dados) {
        if (!produtoRepositorio.existsById(dados.produtoId())) {
            return ResponseEntity.notFound().build();
        }
        Produto produto = produtoRepositorio.getReferenceById(dados.produtoId());
        Movimentacao movimentacao = movimentacaoRepositorio.save(new Movimentacao(dados, produto));
        Long id = movimentacao.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = movimentacaoRepositorio.findAll().stream().map(DadosListagemMovimentacao::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoMovimentacao dados) {
        if (!produtoRepositorio.existsById(dados.produtoId())) {
            return ResponseEntity.notFound().build();
        }
        if (!movimentacaoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Produto produto = produtoRepositorio.getReferenceById(dados.produtoId());
        Movimentacao movimentacao = movimentacaoRepositorio.getReferenceById(dados.id());
        movimentacao.atualizaInformacoes(dados, produto);
        return ResponseEntity.ok(movimentacao);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!movimentacaoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        movimentacaoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemMovimentacao> detalhar(@PathVariable Long id) {
        if (!movimentacaoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Movimentacao movimentacao = movimentacaoRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemMovimentacao(movimentacao));
    }
}
