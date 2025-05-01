import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProdutoService {
  // private apiUrl = 'https://localhost:7258/api/produtos'; // Ajuste conforme sua API
  // private apiUrl = 'http://192.168.15.146:92/api/produtos';
  private apiUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionar(produto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: any): Observable<any> {
    produto.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
