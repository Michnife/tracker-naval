import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FleetMap } from './components/fleet-map/fleet-map';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FleetMap],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fleet-tracker-frontend');
}
