import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/auth.model';
import * as sha512 from 'js-sha512';
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
  mode: 'login' | 'forgot' = 'login';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router) {
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
    console.log('Login with', tenant, email);
    // Lanjutkan dengan auth ke backend
    this.request.tenant = tenant
    this.request.email = email
    this.request.password = sha512.sha512(password)
    this.auth.login(this.request).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.meta.code == '2000100') {
          window.localStorage.setItem('token', res.data.token);
          window.localStorage.setItem('role', res.data.role); 
          this.router.navigate(['/dashboard']);
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Email atau password salah. Silakan coba lagi!',
            confirmButtonColor: '#d33'
          });
        }
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

  onForgotPassword() {
    if (this.mode !== 'forgot' || !this.form.value.email) return;
    this.isSubmitting = true;
    this.request.email = this.form.value.email
    this.auth.forgotPassword(this.request).subscribe({
      next: () => {
        this.isSubmitting = false;
        Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Permintaan Reset Password Berhasil, silahkan cek email anda!'
            }).then(() => {
              this.mode = 'login';
            });
        // this.mode = 'login'; // kembali ke form login
      },
      error: () => (this.isSubmitting = false),
    });
  }

  switchMode(mode: 'login' | 'forgot') {
    this.mode = mode;
    if (mode === 'forgot') this.form.get('password')?.clearValidators();
    else this.form.get('password')?.setValidators([Validators.required]);
    this.form.get('password')?.updateValueAndValidity();
  }

  goToRegister() {
    this.router.navigate(['/register']); 
  }
}
