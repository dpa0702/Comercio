import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuncionariosService } from '../../services/funcionarios.service';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
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
export class FuncionariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'cargo', 'salario', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private funcionariosService: FuncionariosService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarFuncionarios(); // Apenas obtém os funcionários, sem subscrição direta
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; // Garante que o sort é definido após a view estar carregada
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  carregarFuncionarios(): void {
    this.funcionariosService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
        {
          this.dataSource.data = [
                { id: 1, nome: "1João Silva", cargo: "Cargo A", salario: "1.500" },
                { id: 2, nome: "2Maria Souza", cargo: "Cargo B", salario: "1.500" },
                { id: 3, nome: "3Carlos Mendes", cargo: "Cargo C", salario: "1.500" },
                { id: 4, nome: "4Ana Pereira", cargo: "Cargo D", salario: "1.500" }
              ];
        }
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  excluir(id: number) {
    this.funcionariosService.excluir(id).subscribe(() => {
      this.carregarFuncionarios();
    });
  }

  abrirFormulario(cliente?: any) {
    const dialogRef = this.dialog.open(FuncionarioFormComponent, {
      width: '600px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (cliente) {
          this.funcionariosService.atualizar(cliente.id, result).subscribe(() => this.carregarFuncionarios());
        } else {
          this.funcionariosService.adicionar(result).subscribe(() => this.carregarFuncionarios());
        }
      }
    });
  }
}
