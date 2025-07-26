import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-list.component.html'
})
export class SalesListComponent {
  sales = [
    { id: 1, code: 'SO-001', customer: 'Toko Sinar Jaya', date: '2025-07-26', total: 250000 },
    { id: 2, code: 'SO-002', customer: 'UD Maju', date: '2025-07-25', total: 140000 }
  ];

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/sales/add']);
  }

  goToDetail(id: number) {
    this.router.navigate(['/sales/detail', id]);
  }
}
