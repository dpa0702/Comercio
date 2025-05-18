import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  // private apiUrl = 'https://localhost:7258/api/clientes'; // Ajuste conforme sua API
  // private apiUrl = 'http://192.168.15.146:92/api/clientes';
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionar(cliente: any): Observable<any> {
    // this.http.post(url, body, {
    //   headers: { 'Content-Type': 'application/json' }
    // })
    return this.http.post<any>(this.apiUrl, cliente,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  atualizar(id: number, cliente: any): Observable<any> {
    cliente.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  atualizarSaldo(id: number, cliente: any): Observable<any> {
    // alert(cliente.meioPagamento + ' - ' + cliente.valorRecebido);
    return this.http.put<any>(`${this.apiUrl}/AtualizarSaldo/${id}`, cliente);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
