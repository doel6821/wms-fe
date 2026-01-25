import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.order.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesInvoice, PaymentRequest } from '../models/invoice.order.model';


@Component({
  selector: 'app-sales-invoice-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales.invoice-payment.component.html'
})
export class SalesInvoicePaymentComponent implements OnInit {
  form: FormGroup;
  invoiceId = '';
  salesInvoice: SalesInvoice = {};
  isLoading = false;
  meta: any = {};

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
  ) {
    this.invoiceId = this.route.snapshot.paramMap.get('id') || '';
    this.form = this.fb.group({
      paymentDate: [new Date().toISOString().slice(0, 10), Validators.required],
      paymentMethod: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      amount: [0, Validators.required],
      notes: ['', Validators.required],
    });
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

  submitPayment(): void {
    if (this.form.invalid) {
      Swal.fire('Perhatian', 'Mohon lengkapi semua field yang wajib diisi', 'warning');
      return;
    }

    const formValue = this.form.value;

    const payload = new PaymentRequest
      
    payload.invoiceId= +this.invoiceId
    payload.paymentDate= formValue.paymentDate
    payload.paymentMethod= formValue.paymentMethod
    payload.referenceNumber= formValue.referenceNumber
    payload.amount= formValue.amount
    payload.notes= formValue.notes
    payload.invoiceNumber= this.salesInvoice.invoiceNumber

    if (this.salesInvoice.totalAmount !=  payload.amount) {
          Swal.fire({
            title: "Nominal tidak sesuai",
            text: "Nominal pembayaran tidak sesuai dengan nilai tagihan!",
            icon: "warning",
            
          })
          return
        }
    
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menyimpan pembayaran ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, simpan',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.invoiceService.paymentInvoice(+this.invoiceId, payload).subscribe({
          next: (res) => {
            this.meta = res.meta || {};
            this.isLoading = false;
            if (this.meta.code == "2000100") {
              Swal.fire('Berhasil', 'Pembayaran berhasil disimpan', 'success').then(() => {
                this.router.navigate(['/sales-invoice']);
              });
            } else {
              Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan pembayaran', 'error');
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err);
            Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan pembayaran', 'error');
          }
        });
      }
    });
  }

  back() {
    this.router.navigate(['/sales-invoice']);
  }

}
