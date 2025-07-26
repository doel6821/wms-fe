import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  isEdit: boolean = false;
  productCode: string | null = null;

  form = {
    code: '',
    name: '',
    averageCost: 0
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.productCode = this.route.snapshot.paramMap.get('code');
    if (this.productCode) {
      this.isEdit = true;
      // Simulasikan fetch data untuk edit
      this.form = {
        code: this.productCode,
        name: 'Contoh Produk',
        averageCost: 11000
      };
    }
  }

  onSave() {
    if (this.isEdit) {
      console.log('Update produk:', this.form);
    } else {
      console.log('Tambah produk:', this.form);
    }
    this.router.navigate(['/products']);
  }

  back() {
    this.router.navigate(['/products']);
  }
}
