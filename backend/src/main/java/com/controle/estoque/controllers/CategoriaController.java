package com.controle.estoque.controllers;

import com.controle.estoque.categorias.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {
    @Autowired
    private CategoriaRepositorio categoriaRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroCategoria dados) {
        Categoria categoria = categoriaRepositorio.save(new Categoria(dados));
        Long id = categoria.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = categoriaRepositorio.findAll().stream().map(DadosListagemCategoria::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoCategoria dados) {
        if (!categoriaRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Categoria categoria = categoriaRepositorio.getReferenceById(dados.id());
        categoria.atualizaInformacoes(dados);
        return ResponseEntity.ok(categoria);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!categoriaRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoriaRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemCategoria> detalhar(@PathVariable Long id) {
        if (!categoriaRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Categoria categoria = categoriaRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemCategoria(categoria));
    }
}
