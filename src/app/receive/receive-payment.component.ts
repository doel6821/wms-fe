import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReceiveOrderService } from '../services/receive.order.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentReceiveRequest, ReceiveOrder } from '../models/receive.model';


@Component({
  selector: 'app-receive-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receive-payment.component.html'
})
export class ReceivePaymentComponent implements OnInit {
  form: FormGroup;
  receiveId = '';
  receiveOrder: ReceiveOrder = {};
  isLoading = false;
  meta: any = {};

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private receiveOrderService: ReceiveOrderService,
  ) {
    this.receiveId = this.route.snapshot.paramMap.get('id') || '';
    this.form = this.fb.group({
      paymentDate: [new Date().toISOString().slice(0, 10), Validators.required],
      paymentMethod: ['', Validators.required],
      referenceNumber: [''],
      amount: [0, Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    if (this.receiveId) {
      this.loadReceiveOrder();
    }
  }

  loadReceiveOrder() {
      this.isLoading = true;
      this.receiveOrderService.getReceiveOrderByID(+this.receiveId).subscribe({
        next: (res: any) => {
          this.receiveOrder = res.data;
          this.form.patchValue({
            amount: res.data.totalAmount
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading receive order:', err);
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal memuat detail receive order'
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

    const payload = new PaymentReceiveRequest
      
    payload.receiveId= +this.receiveId
    payload.paymentDate= formValue.paymentDate
    payload.paymentMethod= formValue.paymentMethod
    payload.referenceNumber= formValue.referenceNumber
    payload.amount= formValue.amount
    payload.notes= formValue.notes
    payload.invoiceNumber= this.receiveOrder.invoiceNumber
    
    if (this.receiveOrder.totalAmount !=  payload.amount) {
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
        this.receiveOrderService.paymentReceiveInvoice(+this.receiveId, payload).subscribe({
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

  onReceivePaymentChange(value: any) {
    const amount = Number(value);
    const payment = this.receiveOrder.totalAmount
    if (amount !=  payment) {
      Swal.fire({
        title: "Nominal tidak sesuai",
        text: "Nominal pembayaran tidak sesuai dengan nilai tagihan!",
        icon: "warning",
        
      })
      this.form.patchValue({
        amount: 0, 
      });
    } else {
      this.form.patchValue({
        amount: amount, 
      });
    }
    console.log(amount)
    console.log(payment)
    

  }

  back() {
    this.router.navigate(['/receive']);
  }

}
