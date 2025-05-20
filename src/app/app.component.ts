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
    if (this.session.isLoggedIn) {
      this.teachable.init();
    }
  }

  get username(): string | null {
    return this.session.getUser();
  }

  logout() {
    this.session.logout();
  }
}



