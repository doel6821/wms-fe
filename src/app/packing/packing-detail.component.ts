import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackingOrderService } from '../services/packing.order.service';
import { InvoiceService } from '../services/invoice.order.service';
import { InvoiceRequest } from '../models/sales.order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-packing-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packing-detail.component.html'
})
export class PackingDetailComponent implements OnInit {
  packingId = '';
  packingOrder: any = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packingOrderService: PackingOrderService,
    private invoiceOrderService: InvoiceService
  ) {
    this.packingId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.packingId) {
      this.loadPackingOrder();
    }
  }

  loadPackingOrder() {
    this.isLoading = true;
    this.packingOrderService.getPackingOrderByID(+this.packingId).subscribe({
      next: (res: any) => {
        this.packingOrder = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading packing order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat detail packing order'
        });
      }
    });
  }

  completePacking(id: any) {
    var invoiceReq = new InvoiceRequest
    invoiceReq.packingOrderId = +id
    this.invoiceOrderService.createInvoice(invoiceReq).subscribe({
            next: (res) => {
              if (res.meta.code == "2000100") {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Invoice berhasil dibuat'
                }).then(() => {
                  this.router.navigate(['/packing']);
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Gagal mebuat invoice'
                });
              }
            },
            error: (err) => {
              console.error('Error saving invoice:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal menyimpan invoice'
              });
            }
          });

  }

  back() {
    this.router.navigate(['/packing']);
  }

  edit() {
    this.router.navigate(['/packing/edit', this.packingId]);
  }
}
