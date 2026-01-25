import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import Swal from 'sweetalert2';
import { Supplier, SupplierQueryParams } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';
import { PurchaseOrderService } from '../services/purchase.order.service';
import { PurchaseOrderRequest, PurchaseOrderQueryParams, ReceiveOrderRequest, PurchaseOrderItem } from '../models/purchase.order.model';
import { ReceiveOrderService } from '../services/receive.order.service';

@Component({
  selector: 'app-receive-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receive-form.component.html'
})
export class ReceiveFormComponent implements OnInit {
  form: FormGroup;
  receiveId: string | null = null;
  isEditMode = false;
  isLoading = false;
  suppliers: Supplier[] = [];
  filterSupplier: SupplierQueryParams = {};
  purchaseOrderItems: PurchaseOrderItem[] = [];
  receiveOrderItems: PurchaseOrderItem[] = [];
  filter: PurchaseOrderQueryParams = {};
  purchaseOrderIds: number[] = []
  
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService, 
    private supplierService: SupplierService, 
    private receiveOrderService: ReceiveOrderService, 
  ) {
    this.form = this.fb.group({
      supplierId: [0, Validators.required],
      supplierName: ['', Validators.required],
      nomorInvoice: ['', Validators.required],
      receiveQty: [0, Validators.required],
      date: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.receiveId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.receiveId;
    this.loadSuppliers()

  }

  
  onSupplierChange(supplierId: number) {
    const supplier = this.suppliers.find(c => c.id == +supplierId);
    if (supplier) {
      this.form.patchValue({
        supplierId: supplier.id, 
        supplierName: supplier.name,  
      });
    }

    this.loadPurchaseOrders()

  }

  onSubmit() {
      var req = new ReceiveOrderRequest
      const invoiceNo = this.form.get('nomorInvoice')?.value;
      req.supplierId = this.form.value.supplierId
      req.invoiceNumber = invoiceNo

      req.receiveOrders = this.receiveOrderItems
      
      // Create new packing order
      this.receiveOrderService.createReceiveOrder(req).subscribe({
        next: (res) => {
          if (res.meta.code == "2000100") {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Receive order berhasil dibuat'
            }).then(() => {
              this.router.navigate(['/receive']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan receive order'
            });
          }
        },
        error: (err) => {
          console.error('Error saving receive order:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menyimpan receive order'
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
              text: 'Terjadi kesalahan saat memuat data supplier.'
            });
            console.error('Error:', err);
          }
        });
      }
  


  loadPurchaseOrders() {
      this.isLoading = true;
      
      this.purchaseOrderService.getAvailableReceiveOrder(this.form.value.supplierId, 0).subscribe({
        next: (res) => {
          console.log(res.data);
          this.purchaseOrderItems = res.data || [];
          this.isLoading = false;
          console.log(this.purchaseOrderItems);
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat memuat data purchase order.'
          });
          console.error('Error:', err);
        }
      });
    }
  
  onCheckboxChange(event: any, item: PurchaseOrderItem) {
    const checked = event.target.checked;
    
    let itemReceive = new PurchaseOrderItem
    itemReceive.id = item.id
    itemReceive.purchaseOrderId = item.purchaseOrderId
    itemReceive.productId = item.productId
    itemReceive.productName = item.productName
    itemReceive.orderQty = item.orderQty
    itemReceive.receiveOrderQty = (item?.receiveOrderQty ?? 0)+ (item?.planReceive ?? 0)
    itemReceive.stockedOrderQty = item.stockedOrderQty
    itemReceive.price = item.price
    itemReceive.purchasePrice = item.purchasePrice
    itemReceive.subTotal = item.subTotal
    itemReceive.discount = item.discount
    itemReceive.totalAmount = item.totalAmount

    if (itemReceive.receiveOrderQty == 0) {
      event.target.checked = false;
      Swal.fire({
          icon: 'warning',
          title: 'Jumlah diterima kosong',
          text: `Jumlah diterima tidak boleh 0`
        });
      return
    }
    if (itemReceive.purchasePrice == 0) {
      event.target.checked = false;
      Swal.fire({
          icon: 'warning',
          title: 'Harga kosong',
          text: `Harga pembelian tidak boleh 0`
        });
      return
    }
    if (checked) {
      // Jika dicentang, tambahkan ke daftar selectedItems
      this.receiveOrderItems.push(itemReceive);
      console.log(this.receiveOrderItems)
    } else {
      // Jika batal dicentang, hapus dari daftar
      this.receiveOrderItems = this.receiveOrderItems.filter(i => i.id !== item.id);
    }

    console.log('Selected items:', this.receiveOrderItems);
  }

  onReceiveQtyChange(id: number, value: any) {
    const qty = Number(value);
    const item = this.purchaseOrderItems.find(i => i.id == id);
    const availableReceive = (item?.orderQty ?? 0) - (item?.receiveOrderQty ?? 0) - (item?.stockedOrderQty ?? 0)
    if (item) {
      if (qty > availableReceive) {
        Swal.fire({
          icon: 'warning',
          title: 'Jumlah Melebihi Order',
          text: `Jumlah diterima (${qty}) tidak boleh lebih dari order (${item.orderQty})`
        });
        item.planReceive = availableReceive;
      } else {
        item.planReceive = qty;
      }
    }

    console.log('Updated selectedItems:', item);
  }

  onReceivePriceChange(id: number, value: any) {
    const price = Number(value);
    const item = this.purchaseOrderItems.find(i => i.id == id);
    const availablePrice = item?.product?.hetPrice ?? 0
    if (item) {
      if (price > availablePrice) {
        Swal.fire({
          title: "Apakah anda yakin?",
          text: "Harga Pembelian lebih mahal dibandingkan harga HET!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Benar!"
        }).then((result) => {
          if (result.isConfirmed) {
            item.purchasePrice = price;
            Swal.fire({
              title: "!",
              text: "Harga Beli Sudah Diperbarui.",
              icon: "success"
            });
          }
        });
      } else {
        item.purchasePrice = price;
      }
    }

    console.log('Updated selectedItems:', item);
  }


  isItemChecked(id: number): boolean {
    return this.receiveOrderItems.some(i => i.id === id);
  }


  back() {
    this.router.navigate(['/receive']);
  }
}
