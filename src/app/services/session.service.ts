import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  isLoggedIn = false;

  constructor() {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  }

  login(username: string) {
    this.isLoggedIn = true;
    localStorage.setItem('user', username);
  }

  getUser() {
    return localStorage.getItem('user');
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
  }
}
