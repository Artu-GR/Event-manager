import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3030/api';

  constructor(private http: HttpClient) { }

  sesionIniciada: boolean = false;
  rol: number = 0;

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

  updateEvent(evento: any): Observable<any> {
    return this.http.put<any>(this.apiUrl+'/updateEvent', evento)
  }

  updateUserInfo(userMail: string, MetodoPago: number){
    const body = {userMail, MetodoPago};
    return this.http.put<any>(this.apiUrl+'/updateUserInfo', body)
  }

}
