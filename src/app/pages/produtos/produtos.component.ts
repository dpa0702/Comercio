import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProdutoService } from '../../services/produto.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';

@Component({
  selector: 'app-produtos',
  standalone: true,
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})
export class ProdutosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'preco', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private produtoService: ProdutoService, 
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; // Garante que o sort é definido após a view estar carregada
    this.dataSource.paginator = this.paginator; // Garante que o paginator é definido após a view estar carregada
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      if(data.length == 0)
        {
          this.dataSource.data = [
                { id: 1, nome: "Jumbo Branco1", preco: "29.00" },
                { id: 2, nome: "Extra Branco2", preco: "27.00" },
                { id: 3, nome: "Grande Branco3", preco: "25.00" },
                { id: 4, nome: "Jumbo Vermelho", preco: "30.00" },
                { id: 5, nome: "Extra Vermelho", preco: "28.00" },
                { id: 6, nome: "Grande Vermelho", preco: "26.00" },
              ];
        }
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  excluir(id: number) {
    this.produtoService.excluir(id).subscribe(() => {
      this.carregarProdutos();
    });
  }

  abrirFormulario(produto?: any) {
    const dialogRef = this.dialog.open(ProdutoFormComponent, {
      width: '600px',
      data: produto
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (produto) {
          this.produtoService.atualizar(produto.id, result).subscribe(() => this.carregarProdutos());
        } else {
          this.produtoService.adicionar(result).subscribe(() => this.carregarProdutos());
        }
      }
    });
  }
  
}
