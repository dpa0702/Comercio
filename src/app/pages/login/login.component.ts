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
import { CryptoService } from '../../services/crypto.service';

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

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private cryptoService: CryptoService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    // this.router.navigate(['/home']);

    if (this.loginForm.valid) {
      this.erroLogin = null; // Limpa o erro antes de tentar logar

      const encryptedPassword = this.cryptoService.encrypt(this.loginForm.value.password);
      const loginData = {
        email: this.loginForm.value.email,
        password: encryptedPassword
      };

      this.authService.login(loginData).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.erroLogin = 'E-mail ou senha incorretos. Tente novamente.';
          }
        },
        error: (err) => {
          if (err.status === 401 || err.status === 404) {
            this.erroLogin = 'Usuário e/ou senha incorretos. Tente novamente.';
          }
          else {
            this.erroLogin = 'Erro ao tentar realizar login. Tente novamente mais tarde.';
          }
        }
      });
    }
  }
  
}
