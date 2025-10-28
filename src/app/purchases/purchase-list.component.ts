import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../services/purchase.order.service';
import { PurchaseOrderQueryParams } from '../models/purchase.order.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './purchase-list.component.html'
})
export class PurchaseListComponent implements OnInit {
  form: FormGroup;
  purchases: any[] = [];
  filter: PurchaseOrderQueryParams = {};
  suppliers: Supplier[] = [];
  filterSupplier: SupplierQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(
    private fb: FormBuilder, 
    private purchaseOrderService: PurchaseOrderService, 
    private supplierService: SupplierService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      supplierName: ['']
    });
  }

  ngOnInit(): void {
    this.loadPurchases(this.currPage);
    this.loadSuppliers()
  }

  loadPurchases(page: number) {
    this.isLoading = true;
    this.filter.page = page;
    this.filter.limit = 10;
    
    this.purchaseOrderService.getPurchaseOrderList(this.filter).subscribe({
      next: (res) => {
        this.purchases = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data purchase order.'
        });
        console.error('Error:', err);
      }
    });
  }

  onFilter() {
    this.currPage = 1;
    this.filter.supplierName = this.form.value.supplierName;
    this.loadPurchases(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.filter = {};
    this.loadPurchases(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadPurchases(page);
  }

  goToAdd() {
    this.router.navigate(['/purchases/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/purchases/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/purchases/detail', id]);
  }

  loadPage() {
    this.loadPurchases(this.currPage);
  }

  loadSuppliers() {
          this.isLoading = true;
          this.filterSupplier.page = 1;
          this.filterSupplier.limit = 9999;
          this.supplierService.getSupplierList(this.filterSupplier).subscribe({
            next: (res) => {
              console.log(res.data);
              this.suppliers = res.data || [];
              // this.meta = res.meta || {};
              // this.totalData = res.count || 0;
              this.isLoading = false;
              console.log(this.suppliers);
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
