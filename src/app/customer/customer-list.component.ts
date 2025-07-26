import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {
  customers = [
    { id: 1, name: 'Toko Sumber Rezeki', phone: '08123456789', discount: 5, term: '30 hari' },
    { id: 2, name: 'Grosir Amanah', phone: '08211222333', discount: 10, term: 'Cash' }
  ];

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/customers/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/customers/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/customers/detail', id]);
  }
}
