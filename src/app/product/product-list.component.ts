import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product, ProductQueryParams } from '../models/product.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

  form: FormGroup;
  products: Product[] = [];
  filter: ProductQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
    this.form = this.fb.group({
      productCode: ['', null],
      productName: ['', null],
    });
  }

  ngOnInit(): void {
    this.loadProducts(this.currPage)
  }

  loadProducts(page: number) {
    this.isLoading = true;
    this.filter.code = this.form.value.productCode;
    this.filter.name = this.form.value.productName;
    this.filter.page = page;
    this.filter.limit = 10;
    this.productService.getProductList(this.filter).subscribe({
      next: (res) => {
        console.log('Service response:', res);
        console.log('Response data:', res.data);
        console.log('Response meta:', res.meta);
        
        this.products = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
        
        console.log('Products assigned:', this.products);
        console.log('Total data:', this.products);
        console.log('Loading state:', this.isLoading);
      },
      error: (err) => {
        console.error('Service error:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data produk.'
        });
        console.error('Error:', err);
      }
    });
  }

  onFilter() {
    this.currPage = 1;
    this.loadProducts(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadProducts(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadProducts(page);
  }

  goToAdd() {
    this.router.navigate(['/products/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/products/detail', id]);
  }

  loadPage() {
    this.loadProducts(this.currPage);
  }
}
