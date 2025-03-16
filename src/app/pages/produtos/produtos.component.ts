import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProdutoService } from '../../services/produto.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProdutoFormComponent } from './produto-form/produto-form.component';

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
    MatInputModule
  ]
})
export class ProdutosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'preco', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private produtoService: ProdutoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.dataSource.data = [
      { id: 1, nome: "Jumbo Branco", preco: "29.00" },
      { id: 2, nome: "Extra Branco", preco: "27.00" },
      { id: 3, nome: "Grande Branco", preco: "25.00" },
      { id: 4, nome: "Jumbo Vermelho", preco: "30.00" },
      { id: 5, nome: "Extra Vermelho", preco: "28.00" },
      { id: 6, nome: "Grande Vermelho", preco: "26.00" },
    ];
    this.dataSource.paginator = this.paginator;
  }

  // carregarProdutos() {
  //   this.produtoService.listar().subscribe(data => {
  //     this.dataSource.data = data;
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }

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
      width: '400px',
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
