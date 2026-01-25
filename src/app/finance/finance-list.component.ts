import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../services/finance.service'
import { InvoiceListQueryParams } from '../models/invoice.order.model'
import { PurchaseOrderQueryParams } from '../models/purchase.order.model'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentReceiveRequest } from '../models/receive.model';
import { PaymentRequest } from '../models/invoice.order.model';
import Swal from 'sweetalert2';
import { SupplierQueryParams } from '../models/supplier.model';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './finance-list.component.html'
})
export class FinanceListComponent implements OnInit {
  form: FormGroup;
  activeTab: 'invoices' | 'payments' = 'invoices';
  invoices: PaymentRequest[] = [];
  payments: PaymentReceiveRequest[] = [];
  filterCustomer : InvoiceListQueryParams = {};
  filterSupplier: SupplierQueryParams = {};
  isLoading = false;
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  meta: any = {};

  constructor(
    private fb: FormBuilder, 
    private financeService: FinanceService,
  ) {
     this.form = this.fb.group({
      customerId: [0, Validators.required],
      supplierId: [0, Validators.required],
      startDateReceive: [''],
      endDateReceive: [''],
      startDatePayment: [''],
      endDatePayment: [''],
    });
  }

  ngOnInit() {
    this.loadPaymentInvoices(this.currPage);
    this.loadPaymentReceiveInvoices(this.currPage);
  }

  setTab(tab: 'invoices' | 'payments') {
    this.activeTab = tab;
    // tab === 'invoices' ? this.loadInvoices() : this.loadPayments();
  }

  loadPaymentInvoices(page: number) {
    this.isLoading = true;
    this.financeService.paymentInvoice({customerId: this.form.value.customerId, page: page, limit: 10, startDate: this.form.value.startDatePayment, endDate: this.form.value.endDatePayment}).subscribe({
          next: (res) => {
            console.log(res.data);
            this.payments = res.data || [];
            this.meta = res.meta || {};
            this.totalData = res.count || 0;
            this.isLoading = false;
            console.log(this.payments);
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Terjadi kesalahan saat memuat data lokasi.'
            });
            console.error('Error:', err);
          }
        });
    
  }

  loadPaymentReceiveInvoices(page: number) {
    this.isLoading = true;
    this.financeService.paymentReceiveInvoice({supplierId: this.form.value.supplierId, page: page, limit: 10, startDate: this.form.value.startDateReceive, endDate: this.form.value.endDateReceive  }).subscribe({
          next: (res) => {
            console.log(res.data);
            this.invoices = res.data || [];
            this.meta = res.meta || {};
            this.totalData = res.count || 0;
            this.isLoading = false;
            console.log(this.invoices);
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Terjadi kesalahan saat memuat data lokasi.'
            });
            console.error('Error:', err);
          }
        });
    
  }

  applyFilter(tipe: string) {
    console.log(tipe)
    if (tipe == "invoices") {
      this.loadPaymentReceiveInvoices(this.currPage);
    } else {
      this.loadPaymentInvoices(this.currPage);
    }
  }
  
  resetFilter(tipe: string) {
    this.currPage = 1
    this.form.patchValue({
          startDatePayment: '',
          endDatePayment: '',
          startDateReceive: '',
          endDateReceive: '',
        });
    
    if (tipe == "invoices") {
      this.loadPaymentReceiveInvoices(this.currPage);
    } else {
      this.loadPaymentInvoices(this.currPage);
    }
  }

  
}
