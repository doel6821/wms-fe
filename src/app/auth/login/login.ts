import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule]
})
export class Login {
  
  email: string = '';
  password: string = '';
  
  constructor(private router: Router) {}
  
  onLogin() {
    console.log('Login with', this.email, this.password);
    // Lanjutkan dengan auth ke backend
    this.router.navigate(['/dashboard']);
  }
}
