import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { InvoiceListQueryParams, SalesInvoice } from '../models/invoice.order.model';

@Component({
  selector: 'app-sales-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales.invoice-list.component.html'
})
export class SalesInvoiceListComponent implements OnInit {
  form: FormGroup;
  salesInvoices: SalesInvoice[] = [];
  filter: InvoiceListQueryParams = {};
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
    private salesInvoiceOrderService: InvoiceService, 
    private customerService: CustomerService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
      dueDate: [''],
      startDate: [''],
      endDate: [''],
      paymentStatus: [''],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadSalesInvoiceOrders(this.currPage);
  }

  loadSalesInvoiceOrders(page: number) {
    this.isLoading = true;
    this.salesInvoiceOrderService.getInvoiceList({ 
      page: page,
      limit: 10, 
      customerId: this.form.value.customerId,
      dueDate: this.form.value.dueDate,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      paymentStatus: this.form.value.paymentStatus,
    }).subscribe({
      next: (res) => {
        this.salesInvoices = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data sales invoice order.'
        });
        console.error('Error:', err);
      }
    });
  }

  onFilter() {
    this.currPage = 1;
    this.filter.customerId = this.form.value.customerId;
    this.loadSalesInvoiceOrders(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.filter = {};
    this.loadSalesInvoiceOrders(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadSalesInvoiceOrders(page);
  }

  goToDetail(id: any) {
    this.router.navigate(['/sales-invoice/detail', id]);
  }

  goToPayment(id: any) {
    this.router.navigate(['/sales-invoice/payment', id]);
  }

  loadPage() {
    this.loadSalesInvoiceOrders(this.currPage);
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
