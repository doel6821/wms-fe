import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  customerId: string | null = null;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      termOfPayment: ['', Validators.required],
      cancelOnBackOrder: [false]
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.customerId;
    
    if (this.isEditMode && this.customerId) {
      this.loadCustomer();
    }
  }

  loadCustomer() {
    this.isLoading = true;
    this.customerService.getCustomerByID(+this.customerId!).subscribe({
      next: (res: any) => {
        const customer = res.data;
        this.form.patchValue({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          discountPercent: customer.discountPercent,
          termOfPayment: customer.termOfPayment,
          cancelOnBackOrder: customer.cancelOnBackOrder
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customer:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data customer'
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode) {
        // Update customer
        console.log('Update customer:', formData);
        this.customerService.registerCustomer(formData).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data pelanggan berhasil diupdate'
              }).then(() => {
                this.router.navigate(['/customers']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error saving customer:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan customer'
            });
          }
        });
      } else {
        // Create new customer
        this.customerService.registerCustomer(formData).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data pelanggan berhasil disimpan'
              }).then(() => {
                this.router.navigate(['/customers']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error saving customer:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan customer'
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi'
      });
    }
  }

  back() {
    this.router.navigate(['/customers']);
  }
}
