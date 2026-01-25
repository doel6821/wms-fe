import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../models/supplier.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './supplier-form.component.html',
})
export class SupplierFormComponent implements OnInit {
  form: FormGroup;
  supplierId: string | null = null;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {
    this.form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      termOfPayment: ['', Validators.required],
      cancelOnBackOrder: [false],
      leadTimeDays: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.supplierId;

    if (this.isEditMode && this.supplierId) {
      this.loadSupplier();
    }
  }

  loadSupplier() {
    this.isLoading = true;
    this.supplierService.getSupplierByID(+this.supplierId!).subscribe({
      next: (res: any) => {
        const supplier = res.data;
        this.form.patchValue({
          id: supplier.id,
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          discountPercent: supplier.discountPercent,
          termOfPayment: supplier.termOfPayment,
          // cancelOnBackOrder: supplier.cancelOnBackOrder,
          leadTimeDays: supplier.leadTimeDays
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading supplier:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data supplier',
        });
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      if (this.isEditMode) {
        // Update supplier
        this.supplierService
          .registerSupplier(formData)
          .subscribe({
            next: (res: any) => {
              if (res.meta.code == "2000100") {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Data supplier berhasil diupdate'
                }).then(() => {
                  this.router.navigate(['/suppliers']);
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
              console.error('Error updating supplier:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal mengupdate supplier',
              });
            },
          });
      } else {
        // Create new supplier
        this.supplierService.registerSupplier(formData).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Data supplier berhasil disimpan'
                }).then(() => {
                  this.router.navigate(['/suppliers']);
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
            console.error('Error saving supplier:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan supplier',
            });
          },
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi',
      });
    }
  }

  back() {
    this.router.navigate(['/suppliers']);
  }
}
