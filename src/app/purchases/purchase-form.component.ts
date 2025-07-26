import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-form.component.html'
})
export class PurchaseFormComponent {
  suppliers = ['CV Maju Jaya', 'PT Sumber Makmur'];
  products = [
    { code: 'PRD001', name: 'Minyak Goreng', price: 12000 },
    { code: 'PRD002', name: 'Gula Putih', price: 13000 }
  ];

  purchase = {
    date: new Date().toISOString().slice(0, 10),
    supplier: '',
    items: [] as any[]
  };

  newItem = {
    productCode: '',
    qty: 1,
    price: 0
  };

  constructor(private router: Router) {}

  addItem() {
    const product = this.products.find(p => p.code === this.newItem.productCode);
    if (product) {
      this.purchase.items.push({
        ...product,
        qty: this.newItem.qty,
        price: this.newItem.price || product.price,
        total: (this.newItem.price || product.price) * this.newItem.qty
      });
      this.newItem = { productCode: '', qty: 1, price: 0 };
    }
  }

  removeItem(i: number) {
    this.purchase.items.splice(i, 1);
  }

  get totalAmount() {
    return this.purchase.items.reduce((acc, item) => acc + item.total, 0);
  }

  onSubmit() {
    console.log('Pembelian disimpan:', this.purchase);
    this.router.navigate(['/purchases']);
  }

  back() {
    this.router.navigate(['/purchases']);
  }
}
