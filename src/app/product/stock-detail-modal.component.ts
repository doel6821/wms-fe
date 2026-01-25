import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderItem } from '../models/sales.order.model';
import { PurchaseOrderItem } from '../models/purchase.order.model';
import { ProductLocation } from '../models/product.model';

@Component({
  selector: 'app-stock-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" id="stockDetailModal" tabindex="-1" aria-labelledby="stockDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="stockDetailModalLabel">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <!-- STOCK TERSEDIA -->
            <div *ngIf="type === 'available'">
              <h6>Lokasi Barang</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Lokasi</th>
                    <th class="text-end">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let loc of dataLokasi">
                    <td>{{ loc.locationCode }}</td>
                    <td class="text-end">{{ loc.qtty }}</td>
                  </tr>
                  <tr *ngIf="!dataLokasi?.length">
                    <td colspan="2" class="text-center text-muted">Tidak ada data lokasi</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ALOKASI -->
            <div *ngIf="type === 'allocation'">
              <h6>Sales Order Teralokasi</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Sales Order</th>
                    <th>Customer</th>
                    <th class="text-end">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let so of dataAlokasi">
                    <td>{{ so.id }}</td>
                    <td>{{ so.customer?.name }}</td>
                    <td class="text-end">{{ so.allocationOrderQty }}</td>
                  </tr>
                  <tr *ngIf="!dataAlokasi?.length">
                    <td colspan="3" class="text-center text-muted">Tidak ada alokasi aktif</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- PACKING -->
            <div *ngIf="type === 'packing'">
              <h6>Sales Order Sedang Packing</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Packing ID</th>
                    <th>Customer</th>
                    <th class="text-end">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let pk of dataPacking">
                    <td>{{ pk.id }}</td>
                    <td>{{ pk.customer?.name }}</td>
                    <td class="text-end">{{ pk.packingOrderQty }}</td>
                  </tr>
                  <tr *ngIf="!dataPacking?.length">
                    <td colspan="3" class="text-center text-muted">Tidak ada item dalam packing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- PEMBELIAN -->
            <div *ngIf="type === 'purchase'">
              <h6>Daftar Pembelian</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th class="text-end">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let po of dataPurchase">
                    <td>{{ po.purchaseOrderId }}</td>
                    <td>{{ po.supplier?.name }}</td>
                    <td class="text-end">{{ po.orderQty }}</td>
                  </tr>
                  <tr *ngIf="!dataPurchase?.length">
                    <td colspan="3" class="text-center text-muted">Tidak ada PO aktif</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- BACK ORDER -->
            <div *ngIf="type === 'backorder'">
              <h6>Daftar Back Order</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Sales Order</th>
                    <th class="text-end">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let bo of dataBackOrder">
                    <td>{{ bo.id }}</td>
                    <td>{{ bo.customer?.name }}</td>
                    <td class="text-end">{{ bo.backOrderQty }}</td>
                  </tr>
                  <tr *ngIf="!dataBackOrder?.length">
                    <td colspan="3" class="text-center text-muted">Tidak ada back order</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class StockDetailModalComponent {
  @Input() title = '';
  @Input() type: 'available' | 'allocation' | 'packing' | 'purchase' | 'backorder' = 'available';
  @Input() dataLokasi: ProductLocation[] = [];
  @Input() dataAlokasi: SalesOrderItem[] = [];
  @Input() dataBackOrder: SalesOrderItem[] = [];
  @Input() dataPurchase: PurchaseOrderItem[] = [];
  @Input() dataPacking: SalesOrderItem[] = [];
}
