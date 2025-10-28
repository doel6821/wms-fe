import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { SalesOrderService } from '../services/sales.order.service';
import { PurchaseOrderService } from '../services/purchase.order.service';
import { Product } from '../models/product.model';
import Swal from 'sweetalert2';
import { SalesOrderItem } from '../models/sales.order.model';
import { PurchaseOrderItem } from '../models/purchase.order.model';
import { StockDetailModalComponent } from "./stock-detail-modal.component";
import bootstrap from '../../main.server';
import { ReceiveOrderService } from '../services/receive.order.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  activeTab: string = 'info';
  productId: string | null = null;
  product: Product | null = null;
  isLoading = false;
  modalTitle = '';
  modalType: any;
  modalData: any[] = [];
  productAllocations: SalesOrderItem[] = []
  productonPacking: SalesOrderItem[] = []
  productBackOrder: SalesOrderItem[] = []
  productonPurchase: PurchaseOrderItem[] = []
  productonReceive: any[] = []
  isModalOpen = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private salesOrderService: SalesOrderService,
    private purchaseOrderService: PurchaseOrderService,
    private receiveOrderService: ReceiveOrderService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
      this.loadProductAllocation();
      this.loadProductBackOrder();
      this.loadProductOnPacking();
      this.loadProductOnPurchase();
      this.loadProductOnReceive();

    }
  }

  loadProduct() {
    this.isLoading = true;
    this.productService.getProductByID(+this.productId!).subscribe({
      next: (res: any) => {
        this.product = res.data;
        this.isLoading = false;
        console.log(this.product)
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

  loadProductAllocation() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderItemByProductID(+this.productId!, "Allocation").subscribe({
      next: (res: any) => {
        this.productAllocations = res.data;
        this.isLoading = false;
        console.log(this.productAllocations)
      },
      error: (err) => {
        console.error('Error loading alokasi product:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data alokasi produk'
        });
      }
    });
  }

  loadProductBackOrder() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderItemByProductID(+this.productId!, "BackOrder").subscribe({
      next: (res: any) => {
        this.productBackOrder = res.data;
        this.isLoading = false;
        console.log(this.productBackOrder)
      },
      error: (err) => {
        console.error('Error loading product back order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data produk back order'
        });
      }
    });
  }

  loadProductOnPurchase() {
    this.isLoading = true;
    this.purchaseOrderService.getAvailableReceiveOrder(0, +this.productId!).subscribe({
      next: (res: any) => {
        this.productonPurchase = res.data;
        this.isLoading = false;
        console.log(this.purchaseOrderService)
      },
      error: (err) => {
        console.error('Error loading product on purchase:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data pembelian produk'
        });
      }
    });
  }

  loadProductOnReceive() {
    this.isLoading = true;
    this.receiveOrderService.getReceiveOrderByProductID(+this.productId!).subscribe({
      next: (res: any) => {
        this.productonReceive = res.data;
        this.isLoading = false;
        console.log(this.productonReceive)
      },
      error: (err) => {
        console.error('Error loading product on receive:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data pembelian produk'
        });
      }
    });
  }

  loadProductOnPacking() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderItemByProductID(+this.productId!, "OnPacking").subscribe({
      next: (res: any) => {
        this.productonPacking = res.data;
        this.isLoading = false;
        console.log(this.productonPacking)
      },
      error: (err) => {
        console.error('Error loading product on packing:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data produk on packing'
        });
      }
    });
  }

  openModal(type: string) {
    this.isModalOpen = true;
    this.modalType = type;

    switch (type) {
      case 'available':
        this.modalTitle = 'Lokasi Stok Tersedia';
        this.modalData = this.product?.productLocations || [];
        break;
      case 'allocation':
        this.modalTitle = 'Sales Order Teralokasi';
        this.modalData = this.productAllocations || [];
        break;
      case 'packing':
        this.modalTitle = 'Sales Order Sedang Packing';
        this.modalData = this.productonPacking || [];
        break;
      case 'purchase':
        this.modalTitle = 'Daftar Pembelian';
        this.modalData = this.productonPurchase || [];
        break;
      case 'receive':
        this.modalTitle = 'Daftar Penerimaan';
        this.modalData = this.productonReceive || [];
        break;
      case 'backorder':
        this.modalTitle = 'Daftar Back Order Customer';
        this.modalData = this.productBackOrder || [];
        break;
    }

    // ✅ buka modal 
    const modal = document.getElementById('stockModal');
    if (modal) (modal as any).style.display = 'block';

  }

  closeModal() {
    this.isModalOpen = false;
    console.log("close modal")
    const modal = document.getElementById('stockModal');
    if (modal) (modal as any).style.display = 'none';
  }


  getPreviousMonth(currentMonth: string | undefined, offset: number): string {
    if (!currentMonth) return '-';
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1 - offset);
    const monthStr = date.toLocaleString('id-ID', { month: 'short' });
    const yearStr = date.getFullYear();
    return `${monthStr} ${yearStr}`;
  }

  goToEdit(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  back() {
    this.router.navigate(['/products']);
  }
}
