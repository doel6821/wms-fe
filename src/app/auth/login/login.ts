import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/auth.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class Login {
  
  form: FormGroup;
  request: LoginRequest = {} as LoginRequest;
  
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      tenant: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
  });
  }
  

  onLogin() {
    const tenant = this.form.value.tenant;
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log('Login with', tenant, email, password);
    // Lanjutkan dengan auth ke backend
    this.request.tenant = tenant
    this.request.email = email
    this.request.password = password
    this.auth.login(this.request).subscribe({
      next: (res: any) => {
        console.log(res)
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Email atau password salah. Silakan coba lagi!',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']); 
  }
}
