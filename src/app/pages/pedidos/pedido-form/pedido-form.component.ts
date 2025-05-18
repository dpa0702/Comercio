import { CommonModule } from "@angular/common";
import { Component, LOCALE_ID } from "@angular/core";
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
import { PedidoService } from '../../../services/pedido.service';
import { Router } from '@angular/router';
import { MeiosPagamentoService } from "../../../services/meios-pagamento.service";
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { MatPaginatorIntl } from "@angular/material/paginator";
import { getPortuguesePaginatorIntl } from "../../../components/mat-paginator-intl-pt/mat-paginator-intl-pt";

registerLocaleData(ptBr);

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
    MatCard],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})

export class PedidoFormComponent {
  pedidoForm: FormGroup;
  clientes: any[] = [];
  produtosDisponiveis: any[] = [];
  meiosPagamentoDisponiveis: any[] = [];
  total: number = 0;
  mostrarValorRecebido = false;
  troco = 0;
  revendedor = false;

  constructor(
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private meiosPagamentoService: MeiosPagamentoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptoService
  ) {
    this.pedidoForm = this.fb.group({
      cliente: [null, Validators.required],
      produtos: this.fb.array([
        this.fb.group({
          produto: [null, Validators.required],
          quantidade: [1, [Validators.required, Validators.min(1)]]
        })
      ]),
      meioPagamento: [null, Validators.required],
      total: [0],
      cpfnanota: [null],
      troco: [0],
      valorRecebido: [null],
      Observacoes: [''],
      revendedor: [false],
      txtsaldo: [null],
    });
    
  }

  ngOnInit(): void {
    this.pedidoForm = this.fb.group({
      cliente: ['', Validators.required],
      meioPagamento: ['', Validators.required],
      produtos: this.fb.array([], Validators.required),
      total: [0],
      cpfnanota: [null],
      troco: [0],
      valorRecebido: [null],
      Observacoes: [''],
      revendedor: [false],
      txtsaldo: [null],
    });
    this.carregarClientes();
    this.carregarProdutos();
    this.carregarMeiosPagamento();
    this.preencherFormulario();
  }

  preencherFormulario() {
    this.route.queryParams.subscribe(params => {
      if (params['query']) {
        const [clienteIdStr, cpfcnpj, revendedorStr, saldoStr] = this.cryptoService.decrypt(params['query']).split('|');
        const clienteId = Number(clienteIdStr);
        const saldoS = Number(saldoStr);
        const isRevendedor = revendedorStr === 'true';
        if (clienteId) {
          this.selecionarCliente(clienteId, cpfcnpj, isRevendedor, saldoS);
        }
      }
      else{
        this.selecionarCliente(1, 'Não Identificado', false, 0);
      }
    });
  }

  selecionarCliente(clienteId: number, cpfcnpj: string, isrevendedor: boolean, saldoM: number) {
    this.pedidoForm.get('cliente')?.setValue(Number(clienteId));
    this.pedidoForm.patchValue({ cpfnanota: cpfcnpj });
    this.pedidoForm.patchValue({ revendedor: isrevendedor });
    this.pedidoForm.patchValue({ txtsaldo: "" + 
      new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(saldoM) });
  }

  mostrarEntrada(meioPagamentoId: any) {
    const meioSelecionado = this.meiosPagamentoDisponiveis.find(m => m.id === meioPagamentoId);
    if (meioPagamentoId === 1) {
      this.mostrarValorRecebido = true;
      this.pedidoForm.get('valorRecebido')?.setValue(this.total);
      this.calcularTroco();
    } else {
      this.mostrarValorRecebido = false;
      this.pedidoForm.get('valorRecebido')?.setValue(null);
      this.troco = 0;
    }
  }  

  calcularTroco() {
    if(this.pedidoForm.get('meioPagamento')?.value === 1) {
      const valorRecebido = this.pedidoForm.get('valorRecebido')?.value || 0;
    
      this.troco = valorRecebido - this.total;

      if (valorRecebido < this.total) {
        // this.troco = 0;
        this.pedidoForm.get('valorRecebido')?.setErrors({ insuficiente: true });
      } else {
        this.pedidoForm.get('valorRecebido')?.setErrors(null);
      }
    }
  }   

  salvar() {
    if (this.pedidoForm.valid) {
      this.calcularTotal(); // Garante que o total esteja atualizado
      const pedido = this.pedidoForm.value;
      if(pedido.valorRecebido !== null && pedido.valorRecebido !== undefined
        && pedido.troco !== null && pedido.troco !== undefined) {
        pedido.observacoes = 'Valor Recebido: ' + pedido.valorRecebido.toFixed(2)
          + ' | Troco: ' + this.troco.toFixed(2);
      }
      console.log('Pedido salvo:', pedido);
  
      this.pedidoService.adicionar(pedido).subscribe({
        next: (res) => {
          console.log('Pedido adicionado com sucesso:', res);
          this.router.navigate(['/home/pedidos']);
        },
        error: (err) => {
          console.error('Erro ao adicionar pedido:', err);
        }
      });
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
      const revendedor = this.pedidoForm.get('revendedor')?.value;
      if (revendedor) {
        produtoForm.patchValue({ preco: produto.precorevendedor });
      } else {
        produtoForm.patchValue({ preco: produto.preco });
      }
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.produtos.controls.reduce((acc, produtoForm: any) => {
      const preco = produtoForm.value.preco || 0;
      const quantidade = produtoForm.value.quantidade || 1;
      return acc + (preco * quantidade);
    }, 0);

    this.pedidoForm.patchValue({ total: this.total });
    this.calcularTroco();
  }

  carregarCPF(clienteId: number) {
    const cliente = this.clientes.find(c => c.id === clienteId);
    if (cliente) {
      this.pedidoForm.patchValue({ cpfnanota: cliente.cpfcnpj });
      this.pedidoForm.patchValue({ revendedor: cliente.isrevendedor });
      this.pedidoForm.patchValue({ txtsaldo: "R$ " + 
        new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(cliente.saldo) });
      this.produtos.clear();
      this.pedidoForm.get('meioPagamento')?.setValue(0);
      this.pedidoForm.get('troco')?.setValue(0);
      this.pedidoForm.get('valorRecebido')?.setValue(0);
      this.calcularTotal();
    }
  }

  formatarCPFCNPJ() {
    let valor = this.pedidoForm.get('cpfnanota')?.value;
    
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    if (valor.length <= 11) {
      // Formata como CPF: 000.000.000-00
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formata como CNPJ: 00.000.000/0000-00
      valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }

    this.pedidoForm.get('cpfnanota')?.setValue(valor, { emitEvent: false });
  }

}
