import { MatCardModule } from '@angular/material/card';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteService } from '../../services/cliente.service';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
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
export class ClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'cpfcnpj', 'telefone', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clienteService: ClienteService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarClientes(); // Apenas obtém os clientes, sem subscrição direta
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }
  
  carregarClientes(): void {
    this.clienteService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
        {
          this.dataSource.data = [
                { id: 1, nome: "João Silva", email: "joao@email.com", cpfcnpj: "00000000000", telefone: "(11) 99999-9999" },
                { id: 2, nome: "Maria Souza", email: "maria@email.com", cpfcnpj: "00000000000", telefone: "(11) 99999-9999" },
                { id: 3, nome: "Carlos Mendes", email: "carlos@email.com", cpfcnpj: "00000000000", telefone: "(11) 99999-9999" },
                { id: 4, nome: "Ana Pereira", email: "ana@email.com", cpfcnpj: "00000000000", telefone: "(11) 99999-9999" }
              ];
        }
    });
    
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  excluir(id: number) {
    this.clienteService.excluir(id).subscribe(() => {
      this.carregarClientes();
    });
  }

  abrirFormulario(cliente?: any) {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '600px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (cliente) {
          this.clienteService.atualizar(cliente.id, result).subscribe(() => this.carregarClientes());
        } else {
          this.clienteService.adicionar(result).subscribe(() => this.carregarClientes());
        }
      }
    });
  }
  
}
