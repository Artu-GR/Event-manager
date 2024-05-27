import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3027/api';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/data');
  }

  getUser(correo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, { params: { correo } });
  }
  
  getUserInfo(correo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userInfo`, { params: { correo } });
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/createUser', user)
  }

  getEventInfo(eventId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/getEventInfo', {params: {eventId}})
  }

  createTicket(eventoId: number, userMail: string, precio: number): Observable<any> {
    const body = { eventoId, userMail, precio };
    return this.http.post<any>(this.apiUrl+'/createTicket', body);
  }
}
