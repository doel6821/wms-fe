import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../models/supplier.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-detail.component.html',
})
export class SupplierDetailComponent implements OnInit {
  supplierId = '';
  supplier: Supplier = {} as Supplier;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {
    this.supplierId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.supplierId) {
      this.loadSupplier();
    }
  }

  loadSupplier() {
    this.isLoading = true;
    this.supplierService.getSupplierByID(+this.supplierId).subscribe({
      next: (res: any) => {
        this.supplier = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading supplier:', err);
        this.isLoading = false;
      },
    });
  }

  goToEdit() {
    this.router.navigate(['/suppliers/edit', this.supplierId]);
  }

  back() {
    this.router.navigate(['/suppliers']);
  }
}
