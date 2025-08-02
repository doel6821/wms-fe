import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { ReceiveOrderRequest, StockedRequest } from '../models/purchase.order.model';

@Injectable({ providedIn: 'root' })
export class ReceiveOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createReceiveOrder(request: ReceiveOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/receive-order`, request);
  }

  getReceiveOrderList(filter?: { supplierId?: number; page?: number; limit?: number }) {
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
    return this.http.get(`${environment.apiBaseUrl}/receive-order/all`, { params });
  }

  getReceiveOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/receive-order/${id}`);
  }

  stockedReceiveOrderByID(request: StockedRequest) {
    return this.http.post(`${environment.apiBaseUrl}/receive-order/stocked`, request);
  }

}
