package com.controle.estoque.controllers;

import com.controle.estoque.categorias.Categoria;
import com.controle.estoque.categorias.CategoriaRepositorio;
import com.controle.estoque.fornecedores.Fornecedor;
import com.controle.estoque.fornecedores.FornecedorRepositorio;
import com.controle.estoque.produtos.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    @Autowired
    private ProdutoRepositorio produtoRepositorio;
    @Autowired
    private CategoriaRepositorio categoriaRepositorio;
    @Autowired
    private FornecedorRepositorio fornecedorRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroProduto dados) {
        if (!categoriaRepositorio.existsById(dados.categoriaId())) {
            return ResponseEntity.notFound().build();
        }
        if (!fornecedorRepositorio.existsById(dados.fornecedorId())) {
            return ResponseEntity.notFound().build();
        }
        Categoria categoria = categoriaRepositorio.getReferenceById(dados.categoriaId());
        Fornecedor fornecedor = fornecedorRepositorio.getReferenceById(dados.fornecedorId());
        Produto produto = produtoRepositorio.save(new Produto(dados, categoria, fornecedor));
        Long id = produto.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = produtoRepositorio.findAll().stream().map(DadosListagemProduto::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoProduto dados) {
        if (!categoriaRepositorio.existsById(dados.categoriaId())) {
            return ResponseEntity.notFound().build();
        }
        if (!fornecedorRepositorio.existsById(dados.fornecedorId())) {
            return ResponseEntity.notFound().build();
        }
        if (!produtoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Categoria categoria = categoriaRepositorio.getReferenceById(dados.categoriaId());
        Fornecedor fornecedor = fornecedorRepositorio.getReferenceById(dados.fornecedorId());
        Produto produto = produtoRepositorio.getReferenceById(dados.id());
        produto.atualizaInformacoes(dados, categoria, fornecedor);
        return ResponseEntity.ok(produto);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!produtoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemProduto> detalhar(@PathVariable Long id) {
        if (!produtoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Produto produto = produtoRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemProduto(produto));
    }
}
