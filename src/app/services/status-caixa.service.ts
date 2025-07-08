import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class StatusCaixaService {
  private apiUrl = `${environment.apiUrl}/CaixaSatus`;

  constructor(private http: HttpClient) {}

  atualizar(id: number, StatusCaixa: any): Observable<any> {
    StatusCaixa.id = id;
    return this.http.put<any>(`${this.apiUrl}/${id}`, StatusCaixa);
  }

  selecionar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
