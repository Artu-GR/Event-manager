import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NuevoeventoService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3027/api/evento';

  crearEvento(evento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evento);
  }
}
