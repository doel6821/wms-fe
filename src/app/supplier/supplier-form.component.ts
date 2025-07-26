import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-form.component.html'
})
export class SupplierFormComponent {
  supplier = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Supplier saved:', this.supplier);
    this.router.navigate(['/suppliers']);
  }

  back() {
    this.router.navigate(['/suppliers']);
  }
}
