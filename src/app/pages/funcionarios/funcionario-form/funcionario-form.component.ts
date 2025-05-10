import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class FuncionarioFormComponent {
  FuncionarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FuncionarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.FuncionarioForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      cargo: [data?.cargo || '', Validators.required],
      salario: [data?.salario || '', Validators.required]
    });
  }

  salvar() {
    this.dialogRef.close(this.FuncionarioForm.value);
  }

  fechar() {
    this.dialogRef.close();
  }
}
