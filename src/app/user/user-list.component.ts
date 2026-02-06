import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filterEmail = '';
  isLoading = false;
  form: FormGroup;
  modalMode: 'add' | 'edit' = 'add';
  selectedUser?: User;
  isModalOpen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService, 
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      filterEmail: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.filterEmail = this.form.value.filterEmail;
    this.userService.getUsers({ email: this.filterEmail }).subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Gagal memuat data user', 'error');
      }
    });
  }

  resetFilter() {
    this.form.reset();
    this.loadUsers();
  }

  openAddModal() {
    this.isModalOpen = true;
    this.modalMode = 'add';
    this.form.reset();
    const modal = document.getElementById('userModal');
    if (modal) (modal as any).style.display = 'block';
  }

  openEditModal(user: User) {
    this.isModalOpen = true;
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.form.patchValue({ email: user.email, role: user.role });
    const modal = document.getElementById('userModal');
    console.log(modal, "====>>>>>>>>")
    if (modal) (modal as any).style.display = 'block';
  }

  saveUser() {
    if (this.modalMode === 'add') {
      const req = this.form.value;
      const pass = this.form.get('password')?.value
      if (pass == null) {
        console.log("mauk sini gak")
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan',
          text: 'Mohon lengkapi semua field yang wajib diisi',
        });
        return
      }
      this.userService.createUser(req).subscribe({
        next: () => {
          Swal.fire('Berhasil', 'User berhasil ditambahkan', 'success')
          this.closeModal();
          
        },
        error: () => {
          Swal.fire('Error', 'Gagal menambahkan user', 'error')
          this.closeModal();
        }  
      });
      // this.loadUsers();
    } else if (this.selectedUser) {
      const role = this.form.value.role;
      this.userService.updateUserRole(this.selectedUser.id, role).subscribe({
        next: () => {
          Swal.fire('Berhasil', 'Role user berhasil diperbarui', 'success')
            this.closeModal();
        },
        error: () => {
          Swal.fire('Error', 'Gagal memperbarui role user', 'error')
          this.closeModal();
        }  
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    const modal = document.getElementById('userModal');
    if (modal) (modal as any).style.display = 'none';
    // this.router.navigate(['/sales']);
    // this.router.navigate(['/users']);
    // // window.location.reload()
    this.resetFilter()
    
  }
}
