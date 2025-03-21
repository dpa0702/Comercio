import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PedidoService } from '../../services/pedido.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['id', 'cliente', 'total'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoService: PedidoService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  // carregarPedidos() {
  //   this.dataSource.data = [
  //     { id: 1, cliente: "Maria Souza", total: "30.00" },
  //     { id: 2, cliente: "Ana Pereira", total: "58.00" },
  //     { id: 3, cliente: "Carlos Mendes", total: "27.00" },
  //     { id: 4, cliente: "João Silva", total: "28.00" }
  //   ];
  //   this.dataSource.paginator = this.paginator;
  // }

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
