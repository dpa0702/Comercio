import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class ProdutoFormComponent {
  produtoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProdutoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.produtoForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      preco: [data?.preco || '', Validators.required],
      precorevendedor: [data?.precorevendedor],
    });
  }

  salvar() {
    if (this.produtoForm.valid) {
      this.dialogRef.close(this.produtoForm.value);
    }
  }

  fechar() {
    this.dialogRef.close();
  }
}
