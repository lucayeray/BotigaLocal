import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {SessionService} from '../../services/session.service';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    FormsModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private session: SessionService) {}

  login() {
    this.session.login(this.username);
    alert('Login exitoso para ' + this.username);
    this.router.navigate(['/products']);
  }
}
