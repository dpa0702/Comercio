import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuncionariosService } from '../../services/funcionarios.service';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MeioPagamentoFormComponent } from './meio-pagamento-form/meio-pagamento-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MeiosPagamentoService } from '../../services/meios-pagamento.service';

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
    MatSelectModule
  ]
})
export class MeiosPagamentoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private meiosPagamentoService: MeiosPagamentoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarMeiosPagamento(); // Apenas obtém os funcionários, sem subscrição direta
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
        {
          this.dataSource.data = [
                { id: 1, nome: "À prazo" },
                { id: 2, nome: "Dinheiro" },
                { id: 3, nome: "Cartão" },
                { id: 4, nome: "Máquina A" },
                { id: 5, nome: "Máquina B" },
                { id: 6, nome: "Máquina C" }
              ];
        }
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
