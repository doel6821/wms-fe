import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../services/purchase.order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-detail.component.html'
})
export class PurchaseDetailComponent implements OnInit {
  purchaseId = '';
  purchaseOrder: any = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.purchaseId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.purchaseId) {
      this.loadPurchaseOrder();
    }
  }

  loadPurchaseOrder() {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderByID(+this.purchaseId).subscribe({
      next: (res: any) => {
        this.purchaseOrder = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading purchase order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat detail purchase order'
        });
      }
    });
  }

  back() {
    this.router.navigate(['/purchases']);
  }

  edit() {
    this.router.navigate(['/purchases/edit', this.purchaseId]);
  }
}
