import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';

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

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
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
    this.userService.getUsers({ email: this.filterEmail }).subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Gagal memuat data user', 'error');
      }
    });
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
    if (modal) (modal as any).style.display = 'block';
  }

  saveUser() {
    if (this.modalMode === 'add') {
      const req = this.form.value;
      this.userService.createUser(req).subscribe({
        next: () => {
          Swal.fire('Berhasil', 'User berhasil ditambahkan', 'success');
          this.closeModal();
          this.loadUsers();
        },
        error: () => Swal.fire('Error', 'Gagal menambahkan user', 'error')
      });
    } else if (this.selectedUser) {
      const role = this.form.value.role;
      this.userService.updateUserRole(this.selectedUser.id, role).subscribe({
        next: () => {
          Swal.fire('Berhasil', 'Role user berhasil diperbarui', 'success');
          this.closeModal();
          this.loadUsers();
        },
        error: () => Swal.fire('Error', 'Gagal memperbarui role user', 'error')
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    console.log("close modal")
    const modal = document.getElementById('userModal');
    if (modal) (modal as any).style.display = 'none';
  }
}
