import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-meio-pagamento-form',
  standalone: true,
  templateUrl: './meio-pagamento-form.component.html',
  styleUrl: './meio-pagamento-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class MeioPagamentoFormComponent {
  MeiosPagamentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MeioPagamentoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.MeiosPagamentoForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
    });
  }

  salvar() {
    this.dialogRef.close(this.MeiosPagamentoForm.value);
  }

  fechar() {
    this.dialogRef.close();
  }
}
