import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MovimentoService {
  private apiUrl = `${environment.apiUrl}/Movimento`;

  constructor(private http: HttpClient) {}

  adicionar(movimento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movimento);
  }
}
