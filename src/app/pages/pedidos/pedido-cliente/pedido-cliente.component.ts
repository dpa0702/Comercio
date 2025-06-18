import { Component, OnInit, ViewChild, AfterViewInit, LOCALE_ID  } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PedidoService } from '../../../services/pedido.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PedidoDetalheComponent } from '../pedido-detalhe/pedido-detalhe.component';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';
import { ActivatedRoute } from '@angular/router';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-pedido-cliente',
  standalone: true,
  templateUrl: './pedido-cliente.component.html',
  styleUrls: ['./pedido-cliente.component.css'],
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

export class PedidoClienteComponent implements OnInit, AfterViewInit {
  // displayedColumns: string[] = ['id', 'data', 'clienteNome', 'meioPagamento', 'cpfnanota', 'total', 'detalhes'];
  displayedColumns: string[] = ['id', 'data', 'clienteNome', 'meioPagamento', 'cpfnanota', 'total'];
  expandedElement: any | null = null;
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pedidoService: PedidoService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute
) {}

  ngOnInit(): void {
    this.preencherFormulario(); 
  }

  preencherFormulario() {
    this.route.queryParams.subscribe(params => {
      const clienteId = params['id'];
      const nome = params['nome'];

      this.carregarPedidos(clienteId);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; // Garante que o sort é definido após a view estar carregada
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  mostrarBaixa(pedido: any) {
    this.dialog.open(PedidoDetalheComponent, {
      width: '600px',
      data: pedido
    });
  }

  carregarPedidos(id: number) {
    this.pedidoService.listarPorCliente(id).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
      {
        alert("Nenhum pedido encontrado para o cliente selecionado.");
      }
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

}
