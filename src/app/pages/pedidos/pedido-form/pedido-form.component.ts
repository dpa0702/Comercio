import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ClienteService } from '../../../services/cliente.service';
import { ProdutoService } from '../../../services/produto.service';
import { Router } from '@angular/router';
import { MeiosPagamentoService } from "../../../services/meios-pagamento.service";

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatIcon,
    MatCard]
})

export class PedidoFormComponent {
  pedidoForm: FormGroup;
  clientes: any[] = [];
  produtosDisponiveis: any[] = [];
  meiosPagamentoDisponiveis: any[] = [];
  total: number = 0;

  constructor(
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private meiosPagamentoService: MeiosPagamentoService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.pedidoForm = this.fb.group({
      cliente: ['', Validators.required],
      meioPagamento: ['', Validators.required],
      produtos: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.pedidoForm = this.fb.group({
      cliente: ['', Validators.required],
      meioPagamento: ['', Validators.required],
      produtos: this.fb.array([], Validators.required)
    });
    this.carregarClientes();
    this.carregarProdutos();
    this.carregarMeiosPagamento();
  }

  salvar() {
    if (this.pedidoForm.valid) {
      console.log('Pedido salvo:', this.pedidoForm.value);
      this.router.navigate(['/home/pedidos']);
    }
  }

  carregarClientes(): void {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe(data => {
      this.produtosDisponiveis = data;
    });
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listar().subscribe(data => {
      this.meiosPagamentoDisponiveis = data;
    });
    if(this.meiosPagamentoDisponiveis.length == 0){
      this.meiosPagamentoDisponiveis = this.meiosPagamentoDisponiveis = [
        { id: 1, nome: "Dinheiro" },
        { id: 2, nome: "Cartão de Crédito" },
        { id: 3, nome: "PIX" },
        { id: 4, nome: "Boleto" }
      ];
    }
  }

  get produtos(): FormArray {
    return this.pedidoForm.get('produtos') as FormArray;
  }

  adicionarProduto() {
    const produtoForm = this.fb.group({
      produto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      preco: [0]
    });

    produtoForm.get('produto')?.valueChanges.subscribe(produtoId => {
      this.atualizarPreco(produtoForm, produtoId);
    });

    produtoForm.get('quantidade')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    this.produtos.push(produtoForm);
  }

  removerProduto(index: number) {
    this.produtos.removeAt(index);
  }

  atualizarPreco(produtoForm: any, produtoId: any) {
    const produto = this.produtosDisponiveis.find(p => p.id === produtoId);
    if (produto) {
      produtoForm.patchValue({ preco: produto.preco });
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.produtos.controls.reduce((acc, produtoForm: any) => {
      const preco = produtoForm.value.preco || 0;
      const quantidade = produtoForm.value.quantidade || 1;
      return acc + (preco * quantidade);
    }, 0);
  }

}
