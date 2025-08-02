import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { RequestSupplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerSupplier(request: RequestSupplier) {
    return this.http.post(`${environment.apiBaseUrl}/supplier`, request);
  }

  getSupplierList(filter?: { name?: string; page?: number; limit?: number }) {
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
    return this.http.get(`${environment.apiBaseUrl}/supplier/all`, { params });
  }

  getSupplierByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/supplier/${id}`);
  }

  deleteSupplierByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/supplier/${id}`);
  }
}
