import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://localhost:7258/api/pedidos'; // Ajuste conforme sua API

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionar(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  atualizar(id: number, pedido: any): Observable<any> {
    pedido.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, id);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
