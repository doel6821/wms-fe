import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.order.service'
import { InvoiceListQueryParams } from '../models/invoice.order.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  templateUrl: './finance-list.component.html'
})
export class FinanceListComponent implements OnInit {
  form: FormGroup;
  activeTab: 'invoices' | 'payments' = 'invoices';
  invoices: any[] = [];
  payments: any[] = [];
  filter : InvoiceListQueryParams = {}

  constructor(
    private fb: FormBuilder, 
    private invoiceService: InvoiceService
  ) {
     this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadInvoices();
  }

  setTab(tab: 'invoices' | 'payments') {
    this.activeTab = tab;
    // tab === 'invoices' ? this.loadInvoices() : this.loadPayments();
  }

  loadInvoices() {
    this.invoiceService.getInvoiceList().subscribe(res => {
      //this.invoices = res.data;
    });
  }

  // loadPayments() {
  //   this.financeService.getDuePayments().subscribe(res => {
  //     //this.payments = res.data;
  //   });
  // }

  // updateStatus(item: any, status: string) {
  //   this.financeService.updateStatus(item.id, status, this.activeTab).subscribe(() => {
  //     alert('Status berhasil diperbarui!');
  //     this.setTab(this.activeTab);
  //   });
  // }
}
