import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  form = {
    username: '',
    password: '',
    email: ''
  };

  constructor(private router: Router) {}
  
  onSubmit() {
    console.log('Register:', this.form);
    // Simpan data ke backend
  }

  goToLogin() {
    this.router.navigate(['/login']); 
  }
}
