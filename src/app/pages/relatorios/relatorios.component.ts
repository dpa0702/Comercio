import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css',
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
    MatSortModule,
    MatTabsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})

export class RelatoriosComponent {
  displayedColumns: string[] = ['id', 'nome'];
  dataSource = [
    { id: 'Dinheiro', nome: 'R$ 50,00' },
    { id: 'Laranjinha', nome: 'R$ 300,00' },
    { id: 'À Prazo', nome: 'R$ 1350,00' },
    { id: 'Pix - Itaú', nome: 'R$ 60,00' },
    { id: 'Mini', nome: 'R$ 150,00' },
    { id: 'Ton', nome: 'R$ 200,00' },
  ];

  constructor() {}

  ngOnInit(): void {
    
  }

}
