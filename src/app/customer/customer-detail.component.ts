import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent {
  customerId = '';

  constructor(private route: ActivatedRoute) {
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
  }
}
