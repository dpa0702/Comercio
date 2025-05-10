import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MeiosPagamentoService {
  // private apiUrl = 'https://localhost:7258/api/meiospagamento'; // Ajuste conforme sua API
  // private apiUrl = 'http://192.168.15.146:92/api/meiospagamento';
  private apiUrl = `${environment.apiUrl}/meiospagamento`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarExcetoAPrazo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/Exceto/APrazo');
  }

  adicionar(meiospagamento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, meiospagamento);
  }

  atualizar(id: number, meiospagamento: any): Observable<any> {
    meiospagamento.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, meiospagamento);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
