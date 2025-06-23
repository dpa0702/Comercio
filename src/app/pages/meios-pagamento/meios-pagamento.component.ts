import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MeioPagamentoFormComponent } from './meio-pagamento-form/meio-pagamento-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MeiosPagamentoService } from '../../services/meios-pagamento.service';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';

@Component({
  selector: 'app-meios-pagamento',
  templateUrl: './meios-pagamento.component.html',
  styleUrl: './meios-pagamento.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})
export class MeiosPagamentoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private meiosPagamentoService: MeiosPagamentoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarMeiosPagamento(); // Apenas obtém os funcionários, sem subscrição direta
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; // Garante que o sort é definido após a view estar carregada
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  excluir(id: number) {
    this.meiosPagamentoService.excluir(id).subscribe(() => {
      this.carregarMeiosPagamento();
    });
  }

  abrirFormulario(cliente?: any) {
    const dialogRef = this.dialog.open(MeioPagamentoFormComponent, {
      width: '600px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (cliente) {
          this.meiosPagamentoService.atualizar(cliente.id, result).subscribe(() => this.carregarMeiosPagamento());
        } else {
          this.meiosPagamentoService.adicionar(result).subscribe(() => this.carregarMeiosPagamento());
        }
      }
    });
  }
}
