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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  form: FormGroup;
  request: LoginRequest = {} as LoginRequest;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      tenant: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  
  onRegister() {
    const tenant = this.form.value.tenant;
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log('Register with', tenant, email);
    // Simpan data ke backend
    this.request.tenant = tenant
    this.request.email = email
    this.request.password = sha512.sha512(password)
    this.auth.registerTenant(this.request).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.meta.code != '2000100') {
          Swal.fire({
            icon: 'error',
            title: 'Register Gagal',
            text: res.Meta.Message,
            confirmButtonColor: '#d33'
          });
        } else {
          console.log("register sukses")
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Register Gagal',
          text: 'Email atau password salah. Silakan coba lagi!',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']); 
  }
}
