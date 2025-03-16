import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PedidoService } from '../../services/pedido.service';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    MatInputModule
    ]
})

export class PedidosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'cliente', 'total', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoService: PedidoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.dataSource.data = [
      { id: 1, cliente: "Cliente 1", total: "1" },
      { id: 2, cliente: "Cliente 2", total: "2" },
      { id: 3, cliente: "Cliente 3", total: "3" },
      { id: 4, cliente: "Cliente 4", total: "4" }
    ];
    this.dataSource.paginator = this.paginator;
  }

  // carregarPedidos() {
  //   this.pedidoService.listar().subscribe(data => {
  //     this.dataSource.data = data;
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }

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
      const dialogRef = this.dialog.open(PedidoFormComponent, {
        width: '400px',
        data: cliente
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (cliente) {
            this.pedidoService.atualizar(cliente.id, result).subscribe(() => this.carregarPedidos());
          } else {
            this.pedidoService.adicionar(result).subscribe(() => this.carregarPedidos());
          }
        }
      });
    }
}
