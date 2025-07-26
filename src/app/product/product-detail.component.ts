import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductComponent {
  activeTab: string = 'info';
  productCode: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.productCode = this.route.snapshot.paramMap.get('code');
  }
}
