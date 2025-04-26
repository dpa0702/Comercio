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
  
  abrirImpressao(pedido: any) {
    const popupWin = window.open('', '_blank', 'width=600,height=800');
    const html = `
      <html>
        <head>
          <title>Pedido ${pedido.id}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; padding: 0; font-family: monospace; font-size: 10pt; }
            }
            body {
              padding: 10px;
              font-family: monospace;
            }

            .titulo {
              text-align: center;
              font-weight: bold;
              font-size: 12pt;
            }

            .linha {
              border-top: 1px dashed black;
              margin: 5px 0;
            }

            .detalhe {
              margin: 5px 0;
            }

            .produto {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }

            .total {
              font-weight: bold;
              font-size: 11pt;
              margin-top: 8px;
              text-align: right;
            }

            .footer {
              margin-top: 15px;
              text-align: center;
              font-size: 9pt;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="titulo">
            Grego Distribuidora de Ovos LTDA<br/>
            CNPJ: 00.000.000/0001-00<br/>
            Rua Gentil de Moura, 123 - Centro<br/>
            São Paulo - SP
          </div>

          <div class="linha"></div>

          <div class="detalhe">
            <strong>NF Nº:</strong> ${pedido.id}<br/>
            <strong>Data:</strong> ${new Date(pedido.data).toLocaleString()}<br/>
            <strong>Cliente:</strong> ${pedido.clienteNome}<br/>
            <strong>CPF:</strong> ${pedido.cpfnanota || '---'}
          </div>

          <div class="linha"></div>

          <div><strong>Itens:</strong></div>
          ${pedido.produtos.map((p: any, index: number) => `
            <div class="produto">
              <span>${index + 1}. Produto ${p.produto}</span>
              <span>${p.quantidade} x R$ ${p.preco.toFixed(2)}</span>
            </div>
          `).join('')}

          <div class="linha"></div>

          <div class="total">TOTAL: R$ ${pedido.total.toFixed(2)}</div>

          <div class="linha"></div>

          <div class="footer">
            Documento sem valor fiscal<br/>
            Obrigado pela preferência!
          </div>
          
        </body>
      </html>
    `;
    popupWin!.document.open();
    popupWin!.document.write(html);
    popupWin!.document.close();
  }

  
}
