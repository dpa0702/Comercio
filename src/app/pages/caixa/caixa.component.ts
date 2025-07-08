import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { getPortuguesePaginatorIntl } from '../../components/mat-paginator-intl-pt/mat-paginator-intl-pt';
import { MatTabsModule } from '@angular/material/tabs';
import { MeiosPagamentoService } from '../../services/meios-pagamento.service';
import { PedidoService } from '../../services/pedido.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StatusCaixaService } from '../../services/status-caixa.service';

@Component({
  selector: 'app-caixa',
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTabsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})

export class CaixaComponent {
  AFCaixaForm: FormGroup;
  statusCaixa: any = null;

  displayedColumns: string[] = ['id', 'nome', 'total'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns2: string[] = ['id', 'clienteNome', 'total'];
  dataSource2 = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  constructor(
    private meiosPagamentoService: MeiosPagamentoService,
    private pedidosService: PedidoService,
    private statusCaixaService: StatusCaixaService,
    private fb: FormBuilder,
  ) {
    this.AFCaixaForm = this.fb.group({
      txtsaldo: [null],
    });
    
  }

  ngOnInit(): void {
    this.carregarMeiosPagamento();
    this.carregarAprazoDia();
    this.AFCaixaForm = this.fb.group({
      txtsaldo: this.carregarSaldo(),
    });
    this.carregarStatusCaixa();
  }

  carregarStatusCaixa(): void{
    this.statusCaixaService.selecionar(1).subscribe(data =>{
      this.statusCaixa = data;
    });
  }

  carregarSaldo(): string{
    return 'R$ 444,00';
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listarCaixa().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  carregarAprazoDia(): void{
    this.pedidosService.listarAPrazoDia().subscribe(data => {
      this.dataSource2.data = data;
      this.dataSource2.paginator = this.paginator2;
    })
  }

  salvarAFCaixa(): void{
    this.statusCaixaService.atualizar(1, this.statusCaixa).subscribe(() => this.carregarStatusCaixa());
  }

}
