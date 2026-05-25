import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Navire, NavireService, NavireRequest } from '../../services/navire';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import ms from 'milsymbol';
import { Groupe, GroupeService } from '../../services/groupe';

@Component({
  selector: 'app-fleet-map',
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-map.html',
  styleUrl: './fleet-map.css',
})
export class FleetMap implements OnInit, OnDestroy {

  navires        = signal<Navire[]>([]);
  groupes        = signal<Groupe[]>([]);
  menuOuvert     = signal<string | null>(null);
  afficherFormulaire       = signal<boolean>(false);
  afficherFormulaireGroupe = signal<boolean>(false);
  navireSelectionne        = signal<Navire | null>(null);
  activeLeftTab  = signal<string>('UNITS');
  activeRightTab = signal<string>('SELECTED');
  clockStr       = signal<string>('');
  sessionTimeStr = signal<string>('00:00:00');
  wsConnecte     = signal<boolean>(false);
  erreurFormulaire = signal<string>('');

  private map: L.Map | null = null;
  private marqueurs: { [id: string]: L.Marker } = {};
  private clockInterval: ReturnType<typeof setInterval> | null = null;
  private sessionStart = Date.now();

  nouveauNavire: NavireRequest = {
    nom: '', type: '', latitude: 0, longitude: 0, groupe: null, statut: ''
  };

  nouveauGroupe = { nom: '', couleur: '#3ed1c3', parent: '' };

  constructor(
    private navireService: NavireService,
    private groupeService: GroupeService
  ) {}

  ngOnInit(): void {
    this.map = L.map('map', { zoomControl: false }).setView([36.0, 14.0], 5);
    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      { attribution: '&copy; Stadia Maps' }
    ).addTo(this.map);

    this.groupeService.getAll().subscribe(data => this.groupes.set(data));

    this.navireService.getAll().subscribe(data => {
      this.navires.set(data);
      for (const navire of data) {
        this.ajouterMarqueur(navire);
      }
    });

    this.navireService.connecterWebSocket((navire) => {
      this.wsConnecte.set(true);
      this.navires.update(liste => liste.map(n => n.id === navire.id ? navire : n));
      const marqueur = this.marqueurs[navire.id];
      if (marqueur) {
        marqueur.setLatLng([navire.latitude, navire.longitude]);
        marqueur.setPopupContent(this.buildPopupContent(navire));
      }
      if (this.navireSelectionne()?.id === navire.id) {
        this.navireSelectionne.set(navire);
      }
    });

    const pad = (n: number) => n < 10 ? '0' + n : '' + n;
    const tick = () => {
      const d = new Date();
      const dd = pad(d.getUTCDate());
      const mm = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getUTCMonth()];
      const yy = String(d.getUTCFullYear()).slice(2);
      const h  = pad(d.getUTCHours());
      const m  = pad(d.getUTCMinutes());
      const s  = pad(d.getUTCSeconds());
      this.clockStr.set(`${dd} ${mm} ${yy} · ${h}:${m}:${s}Z`);
      const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
      const sh = pad(Math.floor(elapsed / 3600));
      const sm = pad(Math.floor((elapsed % 3600) / 60));
      const ss = pad(elapsed % 60);
      this.sessionTimeStr.set(`${sh}:${sm}:${ss}`);
    };
    tick();
    this.clockInterval = setInterval(tick, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  setLeftTab(tab: string): void  { this.activeLeftTab.set(tab); }
  setRightTab(tab: string): void { this.activeRightTab.set(tab); }

  toggleMenu(id: string): void {
    this.menuOuvert.set(this.menuOuvert() === id ? null : id);
  }

  toggleFormulaire(): void {
    this.afficherFormulaire.set(!this.afficherFormulaire());
    this.erreurFormulaire.set('');
    if (this.afficherFormulaireGroupe()) this.afficherFormulaireGroupe.set(false);
  }

  toggleFormulaireGroupe(): void {
    this.afficherFormulaireGroupe.set(!this.afficherFormulaireGroupe());
    if (this.afficherFormulaire()) this.afficherFormulaire.set(false);
  }

  ajouter(): void {
    this.erreurFormulaire.set('');
    const groupeId = this.nouveauNavire.groupe || null;
    const request = {
      nom:       this.nouveauNavire.nom,
      type:      this.nouveauNavire.type,
      latitude:  Number(this.nouveauNavire.latitude),
      longitude: Number(this.nouveauNavire.longitude),
      statut:    this.nouveauNavire.statut,
    };

    this.navireService.ajouter(request as NavireRequest).subscribe({
      next: (navireAjoute) => {
        if (groupeId) {
          this.groupeService.ajouterNavire(groupeId, navireAjoute.id).subscribe({
            next: () => {
              this.groupeService.getAll().subscribe(data => this.groupes.set(data));
              this.navireService.getAll().subscribe(data => this.navires.set(data));
            },
            error: (err) => console.error('[GROUPE] Erreur assignation groupe :', err)
          });
        } else {
          this.navireService.getAll().subscribe(data => this.navires.set(data));
        }
        this.ajouterMarqueur(navireAjoute);
        this.toggleFormulaire();
        this.nouveauNavire = { nom: '', type: '', latitude: 0, longitude: 0, groupe: null, statut: '' };
      },
      error: (err) => {
        const body = err.error;
        const msg = body?.message || body?.error || `Erreur ${err.status} — vérifiez la console`;
        this.erreurFormulaire.set(typeof msg === 'string' ? msg : JSON.stringify(body));
        console.error('[AJOUTER] Status :', err.status, '| Body :', body);
      }
    });
  }

  supprimer(id: string): void {
    this.navireService.supprimer(id).subscribe(() => {
      this.navireService.getAll().subscribe(data => this.navires.set(data));
    });
  }

  supprimerSelectionne(): void {
    const navire = this.navireSelectionne();
    if (navire) {
      this.supprimer(navire.id);
      this.supprimerMarqueur(navire);
      this.navireSelectionne.set(null);
    }
  }

  selectionner(navire: Navire): void {
    this.navireSelectionne.set(navire);
    this.activeRightTab.set('SELECTED');
    if (this.map) {
      this.map.panTo([navire.latitude, navire.longitude]);
    }
  }

  rafraichir(): void {
    this.groupeService.getAll().subscribe(data => this.groupes.set(data));
    this.navireService.getAll().subscribe(data => this.navires.set(data));
  }

  deplacerNavire(navire: Navire): void {
    const lat = window.prompt('Nouvelle latitude :', String(navire.latitude));
    if (lat === null) return;
    const lng = window.prompt('Nouvelle longitude :', String(navire.longitude));
    if (lng === null) return;
    const latitude  = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) return;
    this.navireService.deplacer(navire.id, latitude, longitude).subscribe({
      next: (updated) => {
        this.navires.update(liste => liste.map(n => n.id === updated.id ? updated : n));
        const marqueur = this.marqueurs[updated.id];
        if (marqueur) {
          marqueur.setLatLng([updated.latitude, updated.longitude]);
          marqueur.setPopupContent(this.buildPopupContent(updated));
        }
        if (this.navireSelectionne()?.id === updated.id) {
          this.navireSelectionne.set(updated);
        }
      },
      error: (err) => console.error('[DÉPLACER] Erreur :', err)
    });
  }

  // TODO [BACKEND]: Implémenter PUT /navires/{id} { nom: string } pour le renommage
  renommerNavire(id: string): void {
    const nouveau = window.prompt('Nouveau nom de l\'unité :');
    if (nouveau && nouveau.trim()) {
      console.warn('[TODO] Renommage navire — endpoint PUT /navires/' + id + ' manquant');
    }
  }

  ajouterGroupe(): void {
    if (!this.nouveauGroupe.nom.trim()) return;
    const groupe: any = {
      nom: this.nouveauGroupe.nom,
      couleur: this.nouveauGroupe.couleur,
      parent: this.nouveauGroupe.parent || null,
      sousGroupes: [],
      navires: []
    };
    this.groupeService.ajouter(groupe).subscribe(() => {
      this.groupeService.getAll().subscribe(data => this.groupes.set(data));
      this.toggleFormulaireGroupe();
      this.nouveauGroupe = { nom: '', couleur: '#3ed1c3', parent: '' };
    });
  }

  supprimerGroupe(id: string): void {
    this.groupeService.supprimer(id).subscribe(() => {
      this.groupeService.getAll().subscribe(data => this.groupes.set(data));
    });
  }

  // TODO [BACKEND]: Implémenter PUT /groupes/{id} { nom: string } pour le renommage
  renommerGroupe(id: string): void {
    const nouveau = window.prompt('Nouveau nom du groupe :');
    if (nouveau && nouveau.trim()) {
      console.warn('[TODO] Renommage groupe — endpoint PUT /groupes/' + id + ' manquant');
    }
  }

  ajouterMarqueur(navire: Navire): void {
    const symbol = new ms.Symbol(this.getSymbolCode(navire.type), { size: 35 });
    const icon = L.icon({
      iconUrl: symbol.toDataURL(),
      iconSize: [35, 35],
      iconAnchor: [17, 17]
    });
    const marqueur = L.marker([navire.latitude, navire.longitude], { icon })
      .addTo(this.map!)
      .bindPopup(this.buildPopupContent(navire));
    marqueur.on('click', () => this.selectionner(navire));
    this.marqueurs[navire.id] = marqueur;
  }

  supprimerMarqueur(navire: Navire): void {
    const marqueur = this.marqueurs[navire.id];
    if (marqueur) {
      marqueur.remove();
      delete this.marqueurs[navire.id];
    }
  }

  private buildPopupContent(navire: Navire): string {
    return `
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;
                  background:#0d1517;color:#cad4d4;padding:8px;
                  border:1px solid #1d2c30;min-width:160px;">
        <b style="color:#cad4d4;letter-spacing:.04em">${navire.nom}</b><br>
        <span style="color:#819093">Type&nbsp;&nbsp;&nbsp;: </span>${navire.type}<br>
        <span style="color:#819093">Statut : </span>${navire.statut || '—'}<br>
        <span style="color:#819093">Pos&nbsp;&nbsp;&nbsp;&nbsp;: </span>${navire.latitude.toFixed(4)}° | ${navire.longitude.toFixed(4)}°
      </div>
    `;
  }

  getSymbolCode(type: string): string {
    const codes: { [key: string]: string } = {
      'fregate':      'SFSP------',
      'corvette':     'SFSP------',
      'patrouilleur': 'SFSP------',
      'porte-avions': 'SFSPCA----',
      'sous-marin':   'SFSU------',
      'drone':        'SFSA------',
    };
    return codes[type?.toLowerCase()] ?? 'SFSP------';
  }

  getSymbolDataURL(type: string): string {
    const symbol = new ms.Symbol(this.getSymbolCode(type), { size: 28 });
    return symbol.toDataURL();
  }

  compterParStatut(statut: string): number {
    return this.navires().filter(n => n.statut === statut).length;
  }

  getGroupeLabel(groupeId: string): string {
    if (!groupeId) return 'Sans groupe';
    for (const g of this.groupes()) {
      if (g.id === groupeId) return g.nom;
      for (const sg of g.sousGroupes) {
        if (sg.id === groupeId) return sg.nom;
      }
    }
    return groupeId.slice(0, 8) + '…';
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en-mission': 'statut-badge en-mission',
      'en-alerte':  'statut-badge en-alerte',
      'en-mer':     'statut-badge en-mer',
      'au-port':    'statut-badge au-port',
    };
    return classes[statut] ?? 'statut-badge default';
  }
}
