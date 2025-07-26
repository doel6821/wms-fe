import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-form.component.html'
})
export class SalesFormComponent {
  customers = ['Toko Sinar Jaya', 'UD Maju'];
  products = [
    { code: 'PRD001', name: 'Minyak Goreng 1L', price: 12000 },
    { code: 'PRD002', name: 'Gula Putih 1Kg', price: 13000 }
  ];

  sale = {
    date: new Date().toISOString().slice(0, 10),
    customer: '',
    items: [] as any[]
  };

  newItem = {
    productCode: '',
    qty: 1
  };

  constructor(private router: Router) {}

  addItem() {
    const product = this.products.find(p => p.code === this.newItem.productCode);
    if (product) {
      this.sale.items.push({
        ...product,
        qty: this.newItem.qty,
        total: product.price * this.newItem.qty
      });
      this.newItem = { productCode: '', qty: 1 };
    }
  }

  removeItem(i: number) {
    this.sale.items.splice(i, 1);
  }

  get totalAmount() {
    return this.sale.items.reduce((acc, item) => acc + item.total, 0);
  }

  onSubmit() {
    console.log('Penjualan disimpan:', this.sale);
    this.router.navigate(['/sales']);
  }

  back() {
    this.router.navigate(['/sales']);
  }
}
