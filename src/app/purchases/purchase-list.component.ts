import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-list.component.html'
})
export class PurchaseListComponent {
  purchases = [
    { id: 1, code: 'PO-001', supplier: 'CV Maju Jaya', date: '2025-07-25', total: 300000 },
    { id: 2, code: 'PO-002', supplier: 'PT Sumber Makmur', date: '2025-07-24', total: 180000 }
  ];

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/purchases/add']);
  }

  goToDetail(id: number) {
    this.router.navigate(['/purchases/detail', id]);
  }
}
