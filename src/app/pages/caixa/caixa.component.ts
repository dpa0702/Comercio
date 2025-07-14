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
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { StatusCaixaService } from '../../services/status-caixa.service';
import { MovimentoService } from '../../services/movimento.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanoContaService } from '../../services/plano-conta.service';
import { MeiosPagamentoService } from '../../services/meios-pagamento.service';

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
    MatTabsModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ]
})

export class CaixaComponent {
  AFCaixaForm: FormGroup;
  SSCaixaForm: FormGroup;
  LancamentosForm: FormGroup;
  statusCaixa: any = null;
  planoContas: any[] = [];
  meiosPagamento: any[] = [];

  constructor(
    private statusCaixaService: StatusCaixaService,
    private movimentoService: MovimentoService,
    private planoContaService: PlanoContaService,
    private meiosPagamentoService: MeiosPagamentoService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.AFCaixaForm = this.fb.group({
      txtsaldo: [null],
    });
    this.SSCaixaForm = this.fb.group({
      txtvalor: ['', Validators.required],
      obs: ['', Validators.required],
    });
    this.LancamentosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.AFCaixaForm = this.fb.group({
      txtsaldo: this.carregarSaldo(),
    });
    this.carregarStatusCaixa();
    this.carregarPlanoContas();
    this.carregarMeiosPagamento();
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listar().subscribe(data => {
      this.meiosPagamento = data;
    });
  }

  carregarStatusCaixa(): void{
    this.statusCaixaService.selecionar(1).subscribe(data =>{
      this.statusCaixa = data;
    });
  }

  carregarPlanoContas(): void {
    this.planoContaService.listar().subscribe(data => {
      this.planoContas = data;
    });
  }

  carregarSaldo(): string{
    return 'TODO: Carregar Saldo do Caixa Dinheiro.';//'R$ 0,00';
  }

  salvarAFCaixa(): void{
    this.statusCaixaService.atualizar(1, this.statusCaixa).subscribe(() => this.carregarStatusCaixa());
  }

  salvarMovimento(): void{
    const movimento = this.SSCaixaForm.value;
    this.statusCaixaService.selecionar(1).subscribe(data => {
      if (data.isopened) {
        this.movimentoService.adicionar(movimento).subscribe({
          next: (res) => {
            this.snackBar.open('Sangria / Suprimento adicionado com sucesso!', 'Fechar', { duration: 3000 });
            this.SSCaixaForm.reset();
          },
          error: (err) => {
            console.error('Erro ao adicionar Sangria / Suprimento:', err);
            if (err.status === 400) {
              this.snackBar.open('Erro ao adicionar Sangria / Suprimento.', 'Fechar', { duration: 3000 });
            }
            if (err.status === 401) {
              this.snackBar.open('Você não possui permissão para adicionar Sangria / Suprimento.', 'Fechar', { duration: 3000 });
            }
            this.snackBar.open('Erro ao adicionar Sangria / Suprimento.', 'Fechar', { duration: 3000 });
          }
        });
      }
      else{
        this.snackBar.open('Sangria / Suprimento não pode ser efetivado pois o caixa está fechado!', 'Fechar', { duration: 3000 });
      }
    });
  }

  salvarLancamento(): void{
    alert('salvarLancamento');
  }

}
