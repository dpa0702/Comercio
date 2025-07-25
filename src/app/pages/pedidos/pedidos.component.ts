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
import * as QRCode from 'qrcode';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusCaixaService } from '../../services/status-caixa.service';

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
    MatSortModule,
    MatSnackBarModule,
    ],
    providers: [
      { provide: LOCALE_ID, useValue: 'pt-BR' },
      { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
    ]
})

export class PedidosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'data', 'clienteNome', 'meioPagamento', 'cpfnanota', 'total', 'detalhes', 'delete'];
  expandedElement: any | null = null;
  dataSource = new MatTableDataSource<any>([]);
  statusCaixa: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private pedidoService: PedidoService, 
    private dialog: MatDialog, 
    private router: Router,
    private snackBar: MatSnackBar,
    private statusCaixaService: StatusCaixaService,
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
    this.carregarStatusCaixa();
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

  async abrirImpressao(pedido: any) {
    const popupWin = window.open('', '_blank', 'width=600,height=800');
    let observacoesHtml = '';

    if (pedido.observacoes && pedido.observacoes.includes('?p=')) {
      const conteudoQRCode = pedido.observacoes.trim();
      const parametros = conteudoQRCode.split('?')[1].replace("p=", "");    
      const numeroFormatado = parametros.split('|')[0].replace(/\s+/g, '').match(new RegExp(`.{1,${4}}`, 'g'))?.join(' ');   
      const gerarQRCode = async (texto: string): Promise<string> => {
        try {
          return await QRCode.toDataURL(texto);
        } catch (err) {
          console.error('Erro ao gerar QR Code:', err);
          return '';
        }
      };
      const linkFormatted = `<a href="${conteudoQRCode}" target="_blank">${conteudoQRCode}</a>`;
      const qrCodeBase64 = await gerarQRCode(linkFormatted);
      observacoesHtml = `
        <div class="qr-container">
          <img src="${qrCodeBase64}" alt="QR Code" style="width:150px;height:150px;" />
          <div class="linha"></div>
        </div>
        <div class="qr-container">
          <div class="codigo-formatado">${numeroFormatado}</div>
          <div class="linha"></div>
        </div>
      `;
    } else {
      observacoesHtml = `
        <div class="detalhe">
          <strong>Observações:</strong> ${pedido.observacoes || '---'}
          <div class="linha"></div>
        </div>
      `;
    }

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
            .qr-container {
              display: flex;
              justify-content: center;
              margin: 10px 0;
            }
            .qr-container img {
              width: 150px;
              height: 150px;
            }

          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="titulo">
            GREGO DISTRIBUIDORA DE OVOS LTDA<br/>
            CNPJ: 55.803.661/0001-47<br/>
            IE: 137.919.347.115<br/>
            Avenida Doutor Gentil de Moura, 139<br/>
            Ipiranga - São Paulo - SP<br/>
            Telefone: (11) 97514-1963<br/>
            E-mail: gdovos@gmail.com<br/>
          </div>

          <div class="linha"></div>

          <div class="detalhe">
            <strong>NF Nº:</strong> ${pedido.id}<br/>
            <strong>Data:</strong> ${new Date(pedido.data).toLocaleString()}<br/>
            <strong>Cliente:</strong> ${pedido.clienteNome}<br/>
            <strong>CPF:</strong> ${pedido.cpfnanota || '---'}<br/>
            <strong>Endereço:</strong> ${pedido.email || '---'}
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

          ${observacoesHtml}

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
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  async excluirPedido(pedido: any) {
    this.pedidoService.excluir(pedido.id).subscribe({
      next: (res) => {
        this.snackBar.open('Pedido Excluído com sucesso!', 'Fechar', { duration: 3000 });
        console.log('Pedido excluído com sucesso:', res);
        this.carregarPedidos();
      },
      error: (err) => {
        if (err.status === 403) {
          this.snackBar.open('Você não tem permissão para excluir este pedido.', 'Fechar', { duration: 3000 });
        } else {
          console.error('Erro ao excluir pedido:', err);
          this.snackBar.open('Erro ao excluir o pedido.', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  podeExcluir(pedido: any): boolean {
    if(!pedido.data) return false;
    if(pedido.isExcluido) return false;
    if(pedido.isPago && pedido.meioPagamento == 'À Prazo') return false;
    const dataPedido = new Date(pedido.data);
    const agora = new Date();
    const diffEmMinutos = (agora.getTime() - dataPedido.getTime()) / (1000 * 60);

    return diffEmMinutos <= 15;
  }

  async naopode(){
    this.snackBar.open('Pedido não pode ser excluído!', 'Fechar', { duration: 3000 });
  }

  abrirFormulario(cliente?: any) {
    if(this.statusCaixa.isopened)
      this.router.navigate(['/home/pedidos/pedidos-form']);
    else
      // this.statusCaixaService.atualizar(1, this.statusCaixa).subscribe(() => this.carregarStatusCaixa());
      this.snackBar.open('Caixa Fechado!', 'Fechar', { duration: 3000 });
  }

  carregarStatusCaixa(): void{
    this.statusCaixaService.selecionar(1).subscribe(data =>{
      this.statusCaixa = data;
    });
  }
}
