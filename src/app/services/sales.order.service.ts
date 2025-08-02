import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { SalesOrderRequest } from '../models/sales.order.model';

@Injectable({ providedIn: 'root' })
export class SalesOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createSalesOrder(request: SalesOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/sales-order`, request);
  }

  getSalesOrderList(filter?: { page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}/sales-order/all`, { params });
  }

  getSalesOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/sales-order/${id}`);
  }

}
