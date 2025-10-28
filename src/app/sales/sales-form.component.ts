import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SalesOrderService } from '../services/sales.order.service';
import { CustomerService } from './../services/customer.service';
import { SalesOrderRequest, SalesOrderItem } from '../models/sales.order.model';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import { Product, ProductQueryParams } from '../models/product.model';
import { ProductService } from '../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales-form.component.html'
})
export class SalesFormComponent implements OnInit {
  form: FormGroup;
  salesOrderId: string | null = null;
  isEditMode = false;
  isLoading = false;
  customers: Customer[] = [];
  filterCustomer: CustomerQueryParams = {};
  products: Product[] = [];
  filterProduct: ProductQueryParams = {};
  // Mock data - in real app these would come from services
  // products = [
  //   { id: 1, code: 'PRD001', name: 'Minyak Goreng 1L', price: 12000 },
  //   { id: 2, code: 'PRD002', name: 'Gula Putih 1Kg', price: 13000 }
  // ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService, 
    private productService: ProductService, 
  ) {
    this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
      date: [new Date().toISOString().slice(0, 10), Validators.required],
      discount: [0, [Validators.min(0)]],
      amount: [0],
      totalAmount: [0],
      orderItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.salesOrderId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.salesOrderId;
    this.loadCustomers();
    this.loadProducts();
    if (this.isEditMode && this.salesOrderId) {
      this.loadSalesOrder();
    } else {
      this.addOrderItem();
    }

    // Watch for customer selection changes
    this.form.get('customerId')?.valueChanges.subscribe(customerId => {
      if (customerId) {
        const customer = this.customers.find(c => c.id == +customerId);
        if (customer) {
          this.form.patchValue({
            customerId: customer.id, 
            customerName: customer.name,  
            discount: customer.discountPercent});
        }
      }
    });
  }

  get orderItems() {
    return this.form.get('orderItems') as FormArray;
  }

  addOrderItem() {
    const itemGroup = this.fb.group({
      productId: [0, Validators.required],
      productName: [''],
      productCode: [''],
      orderQty: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      totalAmount: [0]
    });

    // Watch for product selection changes
    itemGroup.get('productId')?.valueChanges.subscribe(productId => {
      if (productId) {
        const product = this.products.find(p => p.id == +productId);
        if (product) {
          itemGroup.patchValue({
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            price: product.hetPrice
          });
          this.calculateItemTotal(itemGroup);
        }
      }
    });

    // Watch for quantity changes
    itemGroup.get('orderQty')?.valueChanges.subscribe(() => {
      this.calculateItemTotal(itemGroup);
    });

    this.orderItems.push(itemGroup);
  }

  removeOrderItem(index: number) {
    this.orderItems.removeAt(index);
    this.calculateTotals();
  }

  calculateItemTotal(itemGroup: FormGroup) {
    const qty = itemGroup.get('orderQty')?.value || 0;
    const price = itemGroup.get('price')?.value || 0;
    const total = qty * price;
    itemGroup.patchValue({ totalAmount: total });
    this.calculateTotals();
  }

  calculateTotals() {
    const items = this.orderItems.controls;
    const amount = items.reduce((sum, item) => sum + (item.get('totalAmount')?.value || 0), 0);
    const discount = this.form.get('discount')?.value || 0;
    const totalAmount = amount - (amount * discount / 100);
    
    this.form.patchValue({
      amount: amount,
      totalAmount: totalAmount
    });
  }

  loadSalesOrder() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderByID(+this.salesOrderId!).subscribe({
      next: (res: any) => {
        const salesOrder = res.data;
        this.form.patchValue({
          customerId: salesOrder.customerId,
          customerName: salesOrder.customerName,
          date: salesOrder.date,
          discount: salesOrder.discount,
          amount: salesOrder.amount,
          totalAmount: salesOrder.totalAmount
        });

        // Clear existing items and add loaded items
        while (this.orderItems.length) {
          this.orderItems.removeAt(0);
        }

        if (salesOrder.orderItems && salesOrder.orderItems.length > 0) {
          salesOrder.orderItems.forEach((item: any) => {
            const itemGroup = this.fb.group({
              productId: [item.productId, Validators.required],
              productName: [item.productName],
              productCode: [item.productCode],
              orderQty: [item.orderQty, [Validators.required, Validators.min(1)]],
              price: [item.price, [Validators.required, Validators.min(0)]],
              totalAmount: [item.totalAmount]
            });
            this.orderItems.push(itemGroup);
          });
        } else {
          this.addOrderItem();
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sales order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data sales order'
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode) {
        // Update sales order
        this.salesOrderService.updateSalesOrder(+this.salesOrderId!, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Sales Order berhasil diupdate'
            }).then(() => {
              this.router.navigate(['/sales']);
            });
          },
          error: (err) => {
            console.error('Error updating sales order:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal mengupdate sales order'
            });
          }
        });
      } else {
        // Create new sales order
        this.salesOrderService.createSalesOrder(formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Sales Order berhasil ditambahkan'
            }).then(() => {
              this.router.navigate(['/sales']);
            });
          },
          error: (err) => {
            console.error('Error saving sales order:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan sales order'
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

  loadCustomers() {
      this.isLoading = true;
      this.filterCustomer.page = 1;
      this.filterCustomer.limit = 9999;
      this.customerService.getCustomerList(this.filterCustomer).subscribe({
        next: (res) => {
          console.log(res.data);
          this.customers = res.data || [];
          // this.meta = res.meta || {};
          // this.totalData = res.count || 0;
          this.isLoading = false;
          console.log(this.customers);
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

  loadProducts() {
      this.isLoading = true;
      this.filterProduct.page = 1;
      this.filterProduct.limit = 99999;
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

  back() {
    this.router.navigate(['/sales']);
  }
}
