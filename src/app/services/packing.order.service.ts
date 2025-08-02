import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { PackingOrderRequest } from '../models/sales.order.model';

@Injectable({ providedIn: 'root' })
export class PackingOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createPackingOrder(request: PackingOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/packing-order`, request);
  }

  getPackingOrderList(filter?: { customerId?: number; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.customerId) {
      params = params.set('customerId', filter.customerId);
    }
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}/packing-order/all`, { params });
  }

  getPackingOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/packing-order/${id}`);
  }

}
