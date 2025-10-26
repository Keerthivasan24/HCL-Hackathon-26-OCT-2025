import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   email_id = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login({ email_id: this.email_id, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access_token);
          alert('Login successful!');
        },
        error: (err) => alert('Login failed')
      });
  }

}
