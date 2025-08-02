import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { RequestCustomer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerCustomer(request: RequestCustomer) {
    return this.http.post(`${environment.apiBaseUrl}/customer`, request);
  }

  getCustomerList(filter?: { name?: string; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}/customer/all`, { params });
  }

  getCustomerByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/customer/${id}`);
  }

  deleteCustomerByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/customer/${id}`);
  }
}
