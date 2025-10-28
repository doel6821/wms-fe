import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalesOrderService } from '../services/sales.order.service';
import { SalesOrderRequest } from '../models/sales.order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-detail.component.html'
})
export class SalesDetailComponent implements OnInit {
  salesOrderId: string | null = null;
  salesOrder: SalesOrderRequest | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService
  ) {
    this.salesOrderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.salesOrderId) {
      this.loadSalesOrder();
    }
  }

  loadSalesOrder() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderByID(+this.salesOrderId!).subscribe({
      next: (res: any) => {
        this.salesOrder = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sales order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data sales order'
        }).then(() => {
          this.router.navigate(['/sales']);
        });
      }
    });
  }

  back() {
    this.router.navigate(['/sales']);
  }

  edit() {
    if (this.salesOrderId) {
      this.router.navigate(['/sales/edit', this.salesOrderId]);
    }
  }
}
