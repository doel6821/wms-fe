import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReceiveOrderService } from '../services/receive.order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-receive-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receive-list.component.html'
})
export class ReceiveListComponent implements OnInit {
  form: FormGroup;
  receives: any[] = [];
  filter: SupplierQueryParams = {};
  suppliers: Supplier[] = [];
  filterSupplier: SupplierQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(
    private fb: FormBuilder, 
    private receiveOrderService: ReceiveOrderService, 
    private supplierService: SupplierService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      supplierId: [0, Validators.required],
      supplierName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers()
    this.loadReceiveOrders(this.currPage);
  }

  loadReceiveOrders(page: number) {
    this.isLoading = true;
    this.filter.page = page;
    this.filter.limit = 10;
    this.filter.id = this.form.value.supplierId;
    this.receiveOrderService.getReceiveOrderList(this.filter).subscribe({
      next: (res) => {
        this.receives = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data purchase order.'
        });
        console.error('Error:', err);
      }
    });
  }

  onFilter() {
    this.currPage = 1;
    this.filter.name = this.form.value.customerName;
    this.loadReceiveOrders(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.filter = {};
    this.loadReceiveOrders(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadReceiveOrders(page);
  }

  goToAdd() {
    this.router.navigate(['/receive/add']);
  }

  goToDetail(id: number) {
    this.router.navigate(['/receive/detail', id]);
  }

  loadPage() {
    this.loadReceiveOrders(this.currPage);
  }

  loadSuppliers() {
    this.isLoading = true;
    this.filterSupplier.page = 1;
    this.filterSupplier.limit = 9999;
    this.supplierService.getSupplierList(this.filterSupplier).subscribe({
      next: (res) => {
        console.log(res.data);
        this.suppliers = res.data || [];
        // this.meta = res.meta || {};
        // this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.suppliers);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data pelanggan.'
        });
        console.error('Error:', err);
      }
    });
  }
}
