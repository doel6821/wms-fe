import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-detail.component.html'
})
export class SalesDetailComponent {
  saleId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.saleId = this.route.snapshot.paramMap.get('id');
  }
}
