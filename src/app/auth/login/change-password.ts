import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordRequest } from '../../models/auth.model';
import { Router } from '@angular/router';
import * as sha512 from 'js-sha512';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangePasswordComponent {
  form: FormGroup;
  successMessage = '';
  request: ChangePasswordRequest = {} as ChangePasswordRequest;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router) {
        this.form = this.fb.group({
        email: ['', Validators.required],
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { email, oldPassword, newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Tidak Sesuai',
        text: 'Konfirmasi Password Tidak Sesuai',
        confirmButtonColor: '#d33'
       });
      return;
    }

    this.request.email = email
    this.request.oldPassword = sha512.sha512(oldPassword)
    this.request.newPassword = sha512.sha512(newPassword)

    this.authService.changePassword(this.request).subscribe({
          next: (res: any) => {
            console.log(res)
            if (res.meta.code == '2000100') {
                Swal.fire('Berhasil', 'Perubahan password berhasil disimpan', 'success').then(() => {                
                    window.localStorage.removeItem('token');
                    window.localStorage.removeItem('role');
                    window.localStorage.removeItem('user'); 
                    this.router.navigate(['/login']);
                });
            } else {
                Swal.fire({
                icon: 'error',
                title: 'Gagal Rubah Password',
                text: 'Email atau password lama salah. Silakan coba lagi!',
                confirmButtonColor: '#d33'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Rubah Password',
              text: 'Email atau password lama salah. Silakan coba lagi!',
              confirmButtonColor: '#d33'
            });
          }
        });
  }
}
