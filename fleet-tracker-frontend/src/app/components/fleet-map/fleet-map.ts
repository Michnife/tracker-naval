import { Component, OnInit, signal } from '@angular/core';
import { Navire, NavireService, NavireRequest } from '../../services/navire';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import ms from 'milsymbol';

@Component({
  selector: 'app-fleet-map',
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-map.html',
  styleUrl: './fleet-map.css',
})
export class FleetMap implements OnInit {
    navires = signal<Navire[]>([]);
    afficherFormulaire = signal<boolean>(false);
    navireSelectionne = signal<Navire | null>(null);

    private map: L.Map | null = null;
    private marqueurs: { [id: string]: L.Marker } = {};

    nouveauNavire: NavireRequest = {
        nom: '',
        type: '',
        latitude: 0,
        longitude: 0,
        statut: ''
    };
    constructor(
        private navireService: NavireService,
    ) {}

    ngOnInit(): void {
        this.map = L.map('map').setView([48.0, 2.0], 5);
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { attribution: '&copy; Stadia Maps'}).addTo(this.map);

        this.navireService.getAll().subscribe(data => {
            this.navires.set(data);

        for(const navire of data) {
            this.ajouterMarqueur(navire);
        }

        });

        this.navireService.connecterWebSocket((navire) => {
            this.navires.update(liste =>
                liste.map(n => n.id === navire.id ? navire : n)
            );
        });
    }

    ajouter(): void {
        this.navireService.ajouter(this.nouveauNavire).subscribe((navireAjoute) => {
            this.navireService.getAll().subscribe(data => {
                this.navires.set(data);
            });
            this.ajouterMarqueur(navireAjoute);
        });
    }

    ajouterMarqueur(navire: Navire): void {
        const symbol = new ms.Symbol(this.getSymbolCode(navire.type), { size: 35 });
        const iconUrl = symbol.toDataURL();
        const icon = L.icon({
            iconUrl: iconUrl,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        const marqueur  = L.marker([navire.latitude, navire.longitude], { icon })
            .addTo(this.map!)
            .bindPopup(navire.nom);
        this.marqueurs[navire.id] = marqueur;
    }

    getSymbolCode(type: string): string {
        const codes: { [key: string]: string } = {
            'fregate': 'SFSP------',
            'sous-marin': 'SFSU------',
            'drone': 'SFSA------'
        };
        return codes[type] ?? 'SFSP------';
    }

  supprimer(id: string): void {
      this.navireService.supprimer(id).subscribe(() => {
          this.navireService.getAll().subscribe(data => {
              this.navires.set(data);
          });
      });
  }

    toggleFormulaire(): void{
        this.afficherFormulaire.set(!this.afficherFormulaire())
    }

    selectionner(navire: Navire): void{
        this.navireSelectionne.set(navire)
    }

    supprimerMarqueur(navire: Navire): void {
        const marqueur = this.marqueurs[navire.id];
        if(marqueur) {
            marqueur.remove(); // retire de la carte
            delete this.marqueurs[navire.id]; // retire du dictionnaire
        }
    }

    supprimerSelectionne(): void {
        const navire = this.navireSelectionne();
        if(navire != null) {
            this.supprimer(navire.id);
            this.supprimerMarqueur(navire);
        }
    }

    compterParStatut(statut: string): number {
        let compteur: number = 0
        for(const navs of this.navires()) {
            if(navs.statut == statut)
                compteur += 1;
        }
        return compteur;
    }
}
