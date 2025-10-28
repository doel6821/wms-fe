import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackingOrderService } from '../services/packing.order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-packing-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './packing-list.component.html'
})
export class PackingListComponent implements OnInit {
  form: FormGroup;
  packings: any[] = [];
  filter: CustomerQueryParams = {};
  customers: Customer[] = [];
  filterCustomer: CustomerQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(
    private fb: FormBuilder, 
    private packingOrderService: PackingOrderService, 
    private customerService: CustomerService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPackingOrders(this.currPage);
    this.loadCustomers()
  }

  loadPackingOrders(page: number) {
    this.isLoading = true;
    this.filter.page = page;
    this.filter.limit = 10;
    this.filter.customerId = this.form.value.customerId;
    this.packingOrderService.getPackingOrderList(this.filter).subscribe({
      next: (res) => {
        this.packings = res.data || [];
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
    this.loadPackingOrders(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.filter = {};
    this.loadPackingOrders(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadPackingOrders(page);
  }

  goToAdd() {
    this.router.navigate(['/packing/add']);
  }

  goToDetail(id: number) {
    this.router.navigate(['/packing/detail', id]);
  }

  loadPage() {
    this.loadPackingOrders(this.currPage);
  }

  loadCustomers() {
    this.isLoading = true;
    this.filterCustomer.page = 1;
    this.filterCustomer.limit = 9999;
    this.customerService.getCustomerList(this.filterCustomer).subscribe({
      next: (res) => {
        console.log(res.data);
        this.customers = res.data || [];
        // this.meta = res.meta || {};
        // this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.customers);
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
