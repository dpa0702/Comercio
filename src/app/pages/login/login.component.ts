import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon'; 
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  erroLogin: string | null = null;
hidePassword: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.router.navigate(['/home']);
    // if (this.loginForm.valid) {
    //   this.erroLogin = null; // Limpa o erro antes de tentar logar
    //   this.authService.login(this.loginForm.value).subscribe({
    //     next: (success) => {
    //       if (success) {
    //         this.router.navigate(['/home']);
    //       } else {
    //         this.erroLogin = 'E-mail ou senha incorretos. Tente novamente.';
    //       }
    //     },
    //     error: () => {
    //       this.erroLogin = 'Erro ao tentar realizar login. Tente novamente mais tarde.';
    //     }
    //   });
    // }
  }
  
}
