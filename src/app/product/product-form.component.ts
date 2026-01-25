import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product, RequestProduct } from '../models/product.model';
import Swal from 'sweetalert2';
import { SupplierService } from '../services/supplier.service';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  productId: string | null = null;
  suppliers: Supplier[] = [];
  isEditMode = false;
  isLoading = false;
  request: RequestProduct = {} as RequestProduct;
  filterSupplier: SupplierQueryParams = {};
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private supplierService: SupplierService, 
  ) {
    this.form = this.fb.group({
      id: [0, Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      supplierId: [0, Validators.required],
      hetPrice: [0, [Validators.min(0)]],
      costPrice: [0, [Validators.min(0)]],
      avgPrice: [0, [Validators.min(0)]],
      stockOnHand: [0, [Validators.min(0)]],
      stockAllocation: [0, [Validators.min(0)]],
      stockBackOrder: [0, [Validators.min(0)]],
      stockPacking: [0, [Validators.min(0)]],
      stockOnPurchase: [0, [Validators.min(0)]],
      stockOnReceive: [0, [Validators.min(0)]],
      // leadTimeDays: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    this.loadSuppliers() 
    if (this.isEditMode && this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.isLoading = true;
    this.productService.getProductByID(+this.productId!).subscribe({
      next: (res: any) => {
        const product = res.data;
        const supplier = this.suppliers.find(s => s.id === product.supplierId);
        this.form.patchValue({
          id: this.productId,
          code: product.code,
          name: product.name,
          supplierId: supplier?.id,
          hetPrice: product.hetPrice,
          costPrice: product.costPrice,
          avgPrice: product.avgPrice,
          stockOnHand: product.stockOnHand,
          stockAllocation: product.stockAllocation,
          stockBackOrder: product.stockBackOrder,
          stockPacking: product.stockPacking,
          stockOnPurchase: product.stockOnPurchase,
          stockOnReceive: product.stockOnReceive,
          leadTimeDays: product.leadTimeDays
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data produk'
        });
      }
    });
  }

  loadSuppliers() {
        this.isLoading = true;
        this.filterSupplier.page = 1;
        this.filterSupplier.limit = 9999;
        this.supplierService.getSupplierList(this.filterSupplier).subscribe({
          next: (res) => {
            console.log(res.data);
            this.suppliers = res.data || [];
            // this.meta = res.meta || {};
            // this.totalData = res.count || 0;
            this.isLoading = false;
            console.log(this.suppliers);
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Terjadi kesalahan saat memuat data pelanggan.'
            });
            console.error('Error:', err);
          }
        });
      }

  onSubmit() {
    if (this.form.valid) {
      this.request.id = +this.form.value.id
      this.request.code = this.form.value.code;
      this.request.name = this.form.value.name;
      this.request.hetPrice = this.form.value.hetPrice;
      this.request.costPrice = this.form.value.costPrice;
      this.request.avgPrice = this.form.value.avgPrice;
      this.request.stockOnHand = this.form.value.stockOnHand;
      this.request.stockAllocation = this.form.value.stockAllocation;
      this.request.stockBackOrder = this.form.value.stockBackOrder;
      this.request.stockPacking = this.form.value.stockPacking;
      this.request.stockOnPurchase = this.form.value.stockOnPurchase;
      this.request.stockOnReceive = this.form.value.stockOnReceive;
      // this.request.leadTimeDays = this.form.value.leadTimeDays;
      this.request.supplierId = this.form.value.supplierId;
      
      if (this.isEditMode) {
        // Update product
        this.productService.registerProduct(
          this.request).subscribe({
          next: (res: any) => {
            console.log(res)
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Produk berhasil diupdate'
              }).then(() => {
                this.router.navigate(['/products']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error updating product:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal mengupdate produk'
            });
          }
        });
      } else {
        // Create new product
        this.request.id = 0
        this.productService.registerProduct(this.request).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Produk berhasil diupdate'
              }).then(() => {
                this.router.navigate(['/products']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error saving product:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan produk'
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi'
      });
    }
  }

  onSupplierChange(supplierId: number) {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (supplier) {
      this.form.patchValue({
        supplierId: supplierId,
      });
    }


  }

  back() {
    this.router.navigate(['/products']);
  }
}
