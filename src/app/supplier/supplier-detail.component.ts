import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-detail.component.html'
})
export class SupplierDetailComponent {
  supplierId = '';

  constructor(private route: ActivatedRoute) {
    this.supplierId = this.route.snapshot.paramMap.get('id') || '';
  }
}
