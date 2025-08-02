import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { PurchaseOrderRequest } from '../models/purchase.order.model';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createPurchaseOrder(request: PurchaseOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/purchase-order`, request);
  }

  getPurchaseOrderList(filter?: { supplierId?: number; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.supplierId) {
      params = params.set('supplierId', filter.supplierId);
    }
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}/purchase-order/all`, { params });
  }

  getPurchaseOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/purchase-order/${id}`);
  }

}
