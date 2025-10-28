import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalesOrderService } from '../services/sales.order.service';
import { SalesOrderRequest, SalesOrderQueryParams } from '../models/sales.order.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import Swal from 'sweetalert2';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales-list.component.html'
})
export class SalesListComponent implements OnInit {

  form: FormGroup;
  salesOrders: SalesOrderRequest[] = [];
  filter: SalesOrderQueryParams = {};
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
    private salesOrderService: SalesOrderService, 
    private customerService: CustomerService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadSalesOrders(this.currPage);
  }

  loadSalesOrders(page: number) {
    this.isLoading = true;
    this.filter.customerId = this.form.value.customerId;
    this.filter.page = page;
    this.filter.limit = 10;
    this.salesOrderService.getSalesOrderList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.salesOrders = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.salesOrders);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data sales order.'
        });
        console.error('Error:', err);
      }
    });
  }

  calculateDueDate(orderDate: string | Date, termOfPayment: string): Date {
    const date = new Date(orderDate);

    if (!termOfPayment) return date;

    const lowerTerm = termOfPayment.toLowerCase();

    if (lowerTerm.includes('cash')) {
      // Jatuh tempo sama dengan tanggal order
      return date;
    }

    // Ambil angka dari string, contoh: "7 hari", "30 hari"
    const match = lowerTerm.match(/\d+/);
    const days = match ? parseInt(match[0], 10) : 0;

    // Tambahkan hari ke tanggal order
    const dueDate = new Date(date);
    dueDate.setDate(date.getDate() + days);
    return dueDate;
  }

  getPaymentStatus(orderDate: string | Date, termOfPayment: string): string {
    const dueDate = this.calculateDueDate(orderDate, termOfPayment);
    const now = new Date();

    if (new Date(dueDate) < now) {
      return 'Jatuh Tempo';
    }

    return 'Belum Jatuh Tempo';
  }

  onFilter() {
    this.currPage = 1;
    this.loadSalesOrders(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadSalesOrders(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadSalesOrders(page);
  }

  goToAdd() {
    this.router.navigate(['/sales/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/sales/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/sales/detail', id]);
  }

  loadPage() {
    this.loadSalesOrders(this.currPage);
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
