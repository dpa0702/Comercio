import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ]
})

export class HomeComponent {
  menuAberto = true;
  temaEscuro = true;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  alternarMenu() {
    this.menuAberto = !this.menuAberto;
  }

  alternarTema() {
  // this.temaEscuro = !this.temaEscuro;
  // const body = document.body;
  // if (this.temaEscuro) {
  //     body.classList.add('dark-theme');
  //     body.classList.remove('light-theme');
  //   } else {
  //     body.classList.add('light-theme');
  //     body.classList.remove('dark-theme');
  //   }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
