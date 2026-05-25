import { Injectable } from '@angular/core';
import { Navire } from './navire';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Groupe {
    id: string;
    nom: string;
    couleur: string;
    parent: Groupe | null;
    sousGroupes: Groupe[];
    navires: Navire[];
}

@Injectable({
  providedIn: 'root',
})
export class GroupeService {
    private apiUrl = 'http://localhost:8080/groupes';
    constructor(private http: HttpClient) {}

    getAll(): Observable<Groupe[]> {
        return this.http.get<Groupe[]>(this.apiUrl);
    }

    ajouter(groupe: Groupe): Observable<Groupe> {
        return this.http.post<Groupe>(this.apiUrl, groupe);
    }

    supprimer(id: string): Observable<string> {
      return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text'});
    }

    ajouterNavire(groupeId : string, navireId : string): Observable<Navire> {
        return this.http.post<Navire>(`${this.apiUrl}/${groupeId}/navires/${navireId}`, {});
    }

}
