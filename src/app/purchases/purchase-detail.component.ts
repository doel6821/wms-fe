import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-detail.component.html'
})
export class PurchaseDetailComponent {
  purchaseId = '';

  constructor(private route: ActivatedRoute) {
    this.purchaseId = this.route.snapshot.paramMap.get('id') || '';
  }
}
