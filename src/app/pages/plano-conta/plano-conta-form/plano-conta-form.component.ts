import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-plano-conta-form',
  standalone: true,
  templateUrl: './plano-conta-form.component.html',
  styleUrl: './plano-conta-form.component.css',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule, MatSelectModule]
})
export class PlanoContaFormComponent {
  PlanoContaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanoContaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.PlanoContaForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      tipo: [data?.tipo || 0],
    });
  }

  salvar() {
    this.dialogRef.close(this.PlanoContaForm.value);
  }

  fechar() {
    this.dialogRef.close();
  }
}
