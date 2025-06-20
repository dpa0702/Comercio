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
import { ClienteService } from '../../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-baixa',
  imports: [CommonModule, 
    ReactiveFormsModule,
     MatFormFieldModule, 
     MatInputModule, 
     MatButtonModule, 
     MatDialogModule,
     MatSelectModule,
     MatOptionModule],
  standalone: true,
  templateUrl: './cliente-baixa.component.html',
  styleUrl: './cliente-baixa.component.css'
})

export class ClienteBaixaComponent {
  meiosPagamentoDisponiveis: any[] = [];
  clienteBaixaForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ClienteBaixaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meiosPagamentoService: MeiosPagamentoService,
    private clienteService: ClienteService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.clienteBaixaForm = this.fb.group({
      meioPagamento: [null, Validators.required],
      valorRecebido: [null, Validators.required]
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
    const cliente = this.clienteBaixaForm.value;

    this.clienteService.atualizarSaldo(this.data.id, cliente).subscribe({
      next: (res) => {
        console.log('Baixa de pagamento realizada com sucesso:', res);
        this.router.navigate(['/home/pedidos']);
      },
      error: (err) => {
        console.error('Erro ao realizar baixa:', err);
      }
    });

    // alert(this.data.id + ' - ' + this.data.clienteNome + ' - ' + this.data.cpfnanota + ' - ' + this.data.total + ' - ' + this.data.meioPagamento);
    // alert(this.pedidoDetalheForm?.get('meioPagamento')?.value + ' - ' + this.pedidoDetalheForm?.get('valorRecebido')?.value);
    this.dialogRef.close();
  }

  limpaValores(event: any) {
      const valor = event.target.value;
      // Se o valor não corresponder à expressão regular, limpa a entrada
      if (!valor.match('^[0-9]+$')) {
        this.clienteBaixaForm.get('valorRecebido')?.setValue('');
          event.target.value = ''; // Limpa o valor visualmente também
      }

      // Permite que apenas caracteres numéricos sejam inseridos
      event.preventDefault();
  }
  
}
