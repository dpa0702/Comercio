import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {
  // private apiUrl = 'https://localhost:7258/api/pedidos'; // Ajuste conforme sua API
  // private apiUrl = 'http://192.168.15.146:92/api/pedidos';
  private apiUrl = `${environment.apiUrl}/pedidos`;
  private apiUrlauth = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '?status=true');
  }

  listarPorCliente(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/Cliente/APrazo/' + id + '?status=true');
  }

  adicionar(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  verificaStatusSefaz(): Observable<any> {
    // alert(this.apiUrlauth + '/VerificaStatusSefaz');
    return this.http.get<any>(this.apiUrlauth + '/VerificaStatusSefaz');
  }

  atualizar(id: number, pedido: any): Observable<any> {
    pedido.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, pedido);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
