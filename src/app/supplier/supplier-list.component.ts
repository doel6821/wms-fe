import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from './../services/supplier.service';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './supplier-list.component.html',
})
export class SupplierListComponent implements OnInit {
  form: FormGroup;
  suppliers: Supplier[] = [];
  filter: SupplierQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router
  ) {
    this.form = this.fb.group({
      supplierName: ['', null],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers(this.currPage);
  }

  loadSuppliers(page: number) {
    this.isLoading = true;
    this.filter.name = this.form.value.supplierName;
    this.filter.page = page;
    this.filter.limit = 10;
    this.supplierService.getSupplierList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.suppliers = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.suppliers);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data supplier.',
        });
        console.error('Error:', err);
      },
    });
  }

  onFilter() {
    this.currPage = 1;
    this.loadSuppliers(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadSuppliers(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadSuppliers(page);
  }

  goToAdd() {
    this.router.navigate(['/suppliers/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/suppliers/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/suppliers/detail', id]);
  }

  loadPage() {
    this.loadSuppliers(this.currPage);
  }
}
