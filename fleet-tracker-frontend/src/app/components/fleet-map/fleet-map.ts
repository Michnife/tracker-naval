import { Component, OnInit, signal } from '@angular/core';
import { Navire, NavireService, NavireRequest } from '../../services/navire';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fleet-map',
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-map.html',
  styleUrl: './fleet-map.css',
})
export class FleetMap implements OnInit {
    navires = signal<Navire[]>([]);
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
        this.navireService.getAll().subscribe(data => {
            this.navires.set(data);
        });
        this.navireService.connecterWebSocket((navire) => {
            this.navires.update(liste =>
                liste.map(n => n.id === navire.id ? navire : n)
            );
        });
    }

  supprimer(id: string): void {
      this.navireService.supprimer(id).subscribe(() => {
          this.navireService.getAll().subscribe(data => {
              this.navires.set(data);
          });
      });
  }

    ajouter(): void {
      this.navireService.ajouter(this.nouveauNavire).subscribe(() => {
          this.navireService.getAll().subscribe(data => {
              this.navires.set(data);
          });
      });;
    }

}
