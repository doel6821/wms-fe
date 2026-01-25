import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.order.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SalesInvoice } from '../models/invoice.order.model';


@Component({
  selector: 'app-sales-invoice-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.invoice-detail.component.html'
})
export class SalesInvoiceDetailComponent implements OnInit {
  invoiceId = '';
  salesInvoice: SalesInvoice = {};
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
  ) {
    this.invoiceId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.invoiceId) {
      this.loadSalesInvoice();
    }
  }

  loadSalesInvoice() {
    this.isLoading = true;
    this.invoiceService.getInvoiceByID(+this.invoiceId).subscribe({
      next: (res: any) => {
        this.salesInvoice = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sales invoice:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat detail sales invoice'
        });
      }
    });
  }

  back() {
    this.router.navigate(['/sales-invoice']);
  }

}
