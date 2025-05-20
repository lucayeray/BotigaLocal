// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  isLoggedIn = this.loggedInSubject.value;
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    this.loggedInSubject.subscribe((state) => this.isLoggedIn = state);
  }

  private hasUser(): boolean {
    return !!localStorage.getItem('user');
  }

  get sessionChanges$() {
    return this.loggedInSubject.asObservable();
  }

  login(username: string) {
    localStorage.setItem('user', username);
    this.loggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedInSubject.next(false);
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }
}
