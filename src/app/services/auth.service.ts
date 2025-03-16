import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://localhost:7258/api/auth'; // Ajuste para sua API
  private authState = new BehaviorSubject<boolean>(this.temToken());

  constructor(private http: HttpClient) {}

  login(credenciais: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credenciais).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authState.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  temToken(): boolean {
    return !!localStorage.getItem('token');
  }

  estaAutenticado(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
function of(arg0: boolean): Observable<any> {
  throw new Error('Function not implemented.');
}

