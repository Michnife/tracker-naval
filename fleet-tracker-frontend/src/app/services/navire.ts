import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Navire {
  id: string;
  nom: string;
  type: string;
  latitude: number;
  longitude: number;
  statut: string;
}

export interface NavireRequest {
    nom: string;
    type: string;
    latitude: number;
    longitude: number;
    statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavireService {

  private apiUrl = 'http://localhost:8080/navires';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Navire[]> {
    return this.http.get<Navire[]>(this.apiUrl);
  }

  ajouter(navire: NavireRequest): Observable<Navire> {
      return this.http.post<Navire>(this.apiUrl, navire);
  }

  supprimer(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text'});
  }
  
  connecterWebSocket(callback: (navire: Navire) => void): void {
      const socket = new WebSocket('ws://localhost:8080/ws');
      socket.onmessage = (event) => {
          const navire = JSON.parse(event.data);
          callback(navire);
      };
  }
}