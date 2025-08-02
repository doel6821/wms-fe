import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent {
  customer = {
    name: '',
    phone: '',
    discount: 0,
    term: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Customer saved:', this.customer);
    this.router.navigate(['/customers']);
  }

  back() {
    this.router.navigate(['/customers']);
  }
}
