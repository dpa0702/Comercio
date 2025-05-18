import { Component, OnInit, ViewChild, AfterViewInit, LOCALE_ID  } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PedidoService } from '../../services/pedido.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PedidoDetalheComponent } from './pedido-detalhe/pedido-detalhe.component';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-pedidos',
  standalone: true,
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule
    ],
    providers: [
      { provide: LOCALE_ID, useValue: 'pt-BR' },
      { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
    ]
})

export class PedidosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'data', 'clienteNome', 'meioPagamento', 'cpfnanota', 'total', 'detalhes'];
  expandedElement: any | null = null;
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private pedidoService: PedidoService, 
    private dialog: MatDialog, 
    private router: Router) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; // Garante que o sort é definido após a view estar carregada
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  mostrarDetalhes(pedido: any) {
    this.dialog.open(PedidoDetalheComponent, {
      width: '600px',
      data: pedido
    });
  }

  abrirImpressao(pedido: any) {
    const popupWin = window.open('', '_blank', 'width=600,height=800');
    const html = `
      <html>
        <head>
          <title>Pedido ${pedido.id}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; padding: 0; font-family: monospace; font-size: 10pt; }
            }
            body {
              padding: 10px;
              font-family: monospace;
            }

            .titulo {
              text-align: center;
              font-weight: bold;
              font-size: 9pt;
            }

            .linha {
              border-top: 1px dashed black;
              margin: 5px 0;
            }

            .detalhe {
              margin: 5px 0;
            }

            .produto {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }

            .total {
              font-weight: bold;
              font-size: 11pt;
              margin-top: 8px;
              text-align: right;
            }

            .footer {
              margin-top: 15px;
              text-align: center;
              font-size: 9pt;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="titulo">
            DISTRIBUIDORA DE OVOS SÃO LUCAS LTDA<br/>
            CNPJ: 46.837.625/0001-03<br/>
            IE: 136.302.995.113<br/>
            Avenida do Oratório, 2571<br/>
            Parque São Lucas - São Paulo - SP<br/>
            Telefone: (11) 91550-1501<br/>
            E-mail: ovossaolucas@gmail.com<br/>
          </div>

          <div class="linha"></div>

          <div class="detalhe">
            <strong>NF Nº:</strong> ${pedido.id}<br/>
            <strong>Data:</strong> ${new Date(pedido.data).toLocaleString()}<br/>
            <strong>Cliente:</strong> ${pedido.clienteNome}<br/>
            <strong>CPF:</strong> ${pedido.cpfnanota || '---'}
          </div>

          <div class="linha"></div>

          <div><strong>Itens:</strong></div>
          ${pedido.produtos.map((p: any, index: number) => `
            <div class="produto">
              <span>Item ${index + 1}. ${p.nome}</span>
              <span>${p.quantidade} x R$ ${p.preco.toFixed(2)}</span>
              <span>Total Item R$ ${(p.quantidade * p.preco).toFixed(2)}</span>
            </div>
          `).join('')}

          <div class="linha"></div>

          <div class="total">TOTAL: R$ ${pedido.total.toFixed(2)}</div>

          <div class="linha"></div>

          <div class="detalhe">
            <strong>Forma de Pagamento:</strong> ${pedido.meioPagamento}<br/>
          </div>
          <div class="detalhe">
            <strong>Observações:</strong> ${pedido.observacoes || '---'}
          <div class="linha"></div>

          <div class="footer">
            Documento sem valor fiscal<br/>
            Obrigado pela preferência!
          </div>
          
        </body>
      </html>
    `;
    popupWin!.document.open();
    popupWin!.document.write(html);
    popupWin!.document.close();
  }  

  carregarPedidos() {
    this.pedidoService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
        {
          this.dataSource.data = [
                { id: 1, clienteNome: "Maria Souza", data: "01/01/2000", meioPagamento: "Dinheiro", total: "30.00", status: true },
                { id: 2, clienteNome: "Ana Pereira", data: "01/01/2000", meioPagamento: "À Prazo", total: "58.00", status: false },
                { id: 3, clienteNome: "Carlos Mendes", data: "01/01/2000", meioPagamento: "Cartão", total: "27.00", status: true },
                { id: 4, clienteNome: "João Silva", data: "01/01/2000", meioPagamento: "Dinheiro", total: "28.00", status: false }
              ];
        }
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  excluir(id: number) {
    this.pedidoService.excluir(id).subscribe(() => {
      this.carregarPedidos();
    });
  }

  abrirFormulario(cliente?: any) {
      // const dialogRef = this.dialog.open(PedidoFormComponent, {
      //   width: '600px',
      //   data: cliente
      // });
    
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     if (cliente) {
      //       this.pedidoService.atualizar(cliente.id, result).subscribe(() => this.carregarPedidos());
      //     } else {
      //       this.pedidoService.adicionar(result).subscribe(() => this.carregarPedidos());
      //     }
      //   }
      // });

      this.router.navigate(['/home/pedidos/pedidos-form']);
    }
}
