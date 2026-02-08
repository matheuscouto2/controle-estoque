package com.controle.estoque.controllers;

import com.controle.estoque.fornecedores.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {
    @Autowired
    private FornecedorRepositorio fornecedorRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroFornecedor dados) {
        Fornecedor fornecedor = fornecedorRepositorio.save(new Fornecedor(dados));
        Long id = fornecedor.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = fornecedorRepositorio.findAll().stream().map(DadosListagemFornecedor::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoFornecedor dados) {
        if (!fornecedorRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Fornecedor fornecedor = fornecedorRepositorio.getReferenceById(dados.id());
        fornecedor.atualizaInformacoes(dados);
        return ResponseEntity.ok(fornecedor);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!fornecedorRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        fornecedorRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemFornecedor> detalhar(@PathVariable Long id) {
        if (!fornecedorRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Fornecedor fornecedor = fornecedorRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemFornecedor(fornecedor));
    }
}