import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../services/purchase.order.service';
import { PurchaseOrderRequest, PurchaseOrderItem } from '../models/purchase.order.model';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';
import Swal from 'sweetalert2';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';
import { Product, ProductQueryParams } from '../models/product.model';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './purchase-form.component.html'
})
export class PurchaseFormComponent implements OnInit {
  form: FormGroup;
  purchaseId: string | null = null;
  isEditMode = false;
  isLoading = false;
  suppliers: Supplier[] = [];
  filterSupplier: SupplierQueryParams = {};
  products: Product[] = [];
  filterProduct: ProductQueryParams = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService, 
    private productService: ProductService, 
  ) {
    this.form = this.fb.group({
      supplierId: [0, Validators.required],
      supplierName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      orderItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.purchaseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.purchaseId;
    this.loadSuppliers()
    if (this.isEditMode && this.purchaseId) {
      this.loadPurchaseOrder();
    }
  }

  get orderItems(): FormArray {
    return this.form.get('orderItems') as FormArray;
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      productId: [0, Validators.required],
      productName: ['', Validators.required],
      orderQty: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addOrderItem() {
    this.orderItems.push(this.createOrderItem());
  }

  removeOrderItem(index: number) {
    this.orderItems.removeAt(index);
    this.calculateTotals();
  }

  onProductChange(index: number, productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      const orderItem = this.orderItems.at(index);
      orderItem.patchValue({
        productId: productId,
        productName: product.name,
        price: product.hetPrice
      });
      this.calculateItemTotal(index);
    }
  }

  calculateItemTotal(index: number) {
    const orderItem = this.orderItems.at(index);
    const qty = orderItem.get('orderQty')?.value || 0;
    const price = orderItem.get('price')?.value || 0;
    const total = qty * price;
    
    orderItem.patchValue({
      totalAmount: total
    });
    
    this.calculateTotals();
  }

  calculateTotals() {
    // const itemsTotal = this.orderItems.controls.reduce((sum, item) => {
    //  return sum + (item.get('totalAmount')?.value || 0);
    // }, 0);
    
    // const discount = this.form.get('discount')?.value || 0;
    // const totalAmount = itemsTotal - discount;
    
    // this.form.patchValue({
    //   amount: itemsTotal,
    //   totalAmount: totalAmount
    // });

    const items = this.orderItems.controls;
    const amount = items.reduce((sum, item) => sum + (item.get('totalAmount')?.value || 0), 0);
    const discount = this.form.get('discount')?.value || 0;
    const totalAmount = amount - (amount * discount / 100);
    
    this.form.patchValue({
      amount: amount,
      totalAmount: totalAmount
    });
  }

  onSupplierChange(supplierId: number) {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (supplier) {
      this.filterProduct.supplier = supplierId
      console.log(this.filterProduct, "====>>>>")
      this.form.patchValue({
        supplierId: supplierId,
        supplierName: supplier.name,
        discount: supplier.discountPercent
      });

      this.loadProducts()
    }


  }

  loadPurchaseOrder() {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderByID(+this.purchaseId!).subscribe({
      next: (res: any) => {
        const purchaseOrder = res.data;
        this.form.patchValue({
          supplierId: purchaseOrder.supplierId,
          supplierName: purchaseOrder.supplierName,
          amount: purchaseOrder.amount,
          discount: purchaseOrder.discount,
          totalAmount: purchaseOrder.totalAmount
        });

        // Load order items
        if (purchaseOrder.orderItems) {
          this.orderItems.clear();
          purchaseOrder.orderItems.forEach((item: any) => {
            const orderItemGroup = this.createOrderItem();
            orderItemGroup.patchValue({
              productId: item.productId,
              productName: item.productName,
              orderQty: item.orderQty,
              price: item.price,
              totalAmount: item.totalAmount
            });
            this.orderItems.push(orderItemGroup);
          });
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading purchase order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data purchase order'
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.orderItems.length > 0) {
      const formData: PurchaseOrderRequest = this.form.value;
      
      if (this.isEditMode) {
        // Update purchase order
        this.purchaseOrderService.updatePurchaseOrder(+this.purchaseId!, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Purchase order berhasil diupdate'
            }).then(() => {
              this.router.navigate(['/purchases']);
            });
          },
          error: (err) => {
            console.error('Error updating purchase order:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal mengupdate purchase order'
            });
          }
        });
      } else {
        // Create new purchase order
        this.purchaseOrderService.createPurchaseOrder(formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Purchase order berhasil ditambahkan'
            }).then(() => {
              this.router.navigate(['/purchases']);
            });
          },
          error: (err) => {
            console.error('Error saving purchase order:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan purchase order'
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi dan tambahkan minimal satu item'
      });
    }
  }

  loadProducts() {
        this.isLoading = true;
        this.filterProduct.page = 1;
        this.filterProduct.limit = 99999;
        console.log(this.filterProduct, "=======>>>>>> 2")
        this.productService.getProductList(this.filterProduct).subscribe({
          next: (res) => {
            console.log('Service response:', res);
            console.log('Response data:', res.data);
            console.log('Response meta:', res.meta);
            
            this.products = res.data || [];
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

  back() {
    this.router.navigate(['/purchases']);
  }
}
