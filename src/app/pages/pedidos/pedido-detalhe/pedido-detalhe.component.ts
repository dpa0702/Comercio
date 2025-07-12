import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MeiosPagamentoService } from "../../../services/meios-pagamento.service";
import { PedidoService } from '../../../services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-detalhe',
  imports: [CommonModule, 
    ReactiveFormsModule,
     MatFormFieldModule, 
     MatInputModule, 
     MatButtonModule, 
     MatDialogModule,
     MatSelectModule,
     MatOptionModule],
  standalone: true,
  templateUrl: './pedido-detalhe.component.html',
  styleUrl: './pedido-detalhe.component.css'
})

export class PedidoDetalheComponent {
  meiosPagamentoDisponiveis: any[] = [];
  pedidoDetalheForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PedidoDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meiosPagamentoService: MeiosPagamentoService,
    private pedidoService: PedidoService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.pedidoDetalheForm = this.fb.group({
      meioPagamento: [null, Validators.required],
      valorRecebido: [null]
    });
  }

  ngOnInit(): void {
    this.carregarMeiosPagamento();
  }

  carregarMeiosPagamento(): void {
    this.meiosPagamentoService.listarExcetoAPrazo().subscribe(data => {
      this.meiosPagamentoDisponiveis = data;
    });
  }

  salvar() {
    const pedido = this.pedidoDetalheForm.value;

    this.pedidoService.atualizar(this.data.id, pedido).subscribe({
      next: (res) => {
        console.log('Pedido atualizado com sucesso:', res);
        this.router.navigate(['/home/clientes']);
      },
      error: (err) => {
        console.error('Erro ao atualizar pedido:', err);
      }
    });

    // alert(this.data.id + ' - ' + this.data.clienteNome + ' - ' + this.data.cpfnanota + ' - ' + this.data.total + ' - ' + this.data.meioPagamento);
    // alert(this.pedidoDetalheForm?.get('meioPagamento')?.value + ' - ' + this.pedidoDetalheForm?.get('valorRecebido')?.value);
    this.dialogRef.close();
  }
  
}
