import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  imports: [CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatDialogModule,
    MatCheckboxModule]
})
export class ClienteFormComponent {
  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clienteForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      cpfcnpj: [data?.cpfcnpj || ''],
      email: [data?.email || ''],
      telefone: [data?.telefone || ''],
      isrevendedor: [data?.isrevendedor || false],
    });
  }

  salvar() {
    if (this.clienteForm.valid) {
      this.dialogRef.close(this.clienteForm.value);
    }
  }

  fechar() {
    this.dialogRef.close();
  }

  formatarCPFCNPJ() {
    let valor = this.clienteForm.get('cpfcnpj')?.value;
    
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    if (valor.length <= 11) {
      // Formata como CPF: 000.000.000-00
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formata como CNPJ: 00.000.000/0000-00
      valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }

    this.clienteForm.get('cpfcnpj')?.setValue(valor, { emitEvent: false });
  }
  
  formatarTelefone() {
    let valor = this.clienteForm.get('telefone')?.value;
    valor = valor.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    else{
      valor = null;
    }

    this.clienteForm.get('telefone')?.setValue(valor, { emitEvent: false });
  }

}
