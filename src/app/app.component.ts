// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from './services/session.service';
import { TeachableService } from './services/teachable.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink],
})
export class AppComponent implements OnInit {
  constructor(
    public session: SessionService,
    private teachable: TeachableService
  ) {}

  ngOnInit(): void {
    this.session.loggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.teachable.resetUI(); // Ocultar tiburón si estaba
        this.teachable.init();    // Reiniciar cámara
      } else {
        this.teachable.stop();    // Detener cámara al cerrar sesión
      }
    });
  }

  get username(): string | null {
    return this.session.getUser();
  }

  logout() {
    this.session.logout();
  }
}
