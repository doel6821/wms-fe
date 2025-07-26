import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent {
  suppliers = [
    { id: 1, name: 'PT Sumber Makmur', phone: '021-1234567', address: 'Jakarta' },
    { id: 2, name: 'CV Bumi Sejahtera', phone: '022-7654321', address: 'Bandung' }
  ];

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/suppliers/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/suppliers/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/suppliers/detail', id]);
  }
}
