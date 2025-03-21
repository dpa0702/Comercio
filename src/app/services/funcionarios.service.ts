import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  private apiUrl = 'https://localhost:7258/api/funcionarios'; // Ajuste conforme sua API

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionar(funcionario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, funcionario);
  }

  atualizar(id: number, funcionario: any): Observable<any> {
    funcionario.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, funcionario);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
