import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { InvoiceRequest } from '../models/sales.order.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createInvoice(request: InvoiceRequest) {
    return this.http.post(`${environment.apiBaseUrl}/invoice`, request);
  }

  getInvoiceList(filter?: { customerId: number; page?: number; limit?: number }) {
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
    return this.http.get(`${environment.apiBaseUrl}/invoice/all`, { params });
  }

  getInvoiceByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/invoice/${id}`);
  }

}
