import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  products = [
    { code: 'PRD001', name: 'Minyak Goreng 1L', averageCost: 11500 },
    { code: 'PRD002', name: 'Gula Putih 1Kg', averageCost: 12000 },
    { code: 'PRD003', name: 'Tepung Terigu', averageCost: 10000 },
  ];

  get filteredProducts() {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onAddProduct() {
    // Routing ke form tambah produk
    console.log('Tambah produk diklik');
    this.router.navigate(['/products/add']);
  }

  onEditProduct(productCode: string) {
    // Routing ke halaman edit
    console.log('Edit:', productCode);
  }

  goToDetail(productCode: string) {
    this.router.navigate(['/products/detail', productCode]);
  }

}
