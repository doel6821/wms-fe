import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { RequestProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerProduct(request: RequestProduct) {
    return this.http.post(`${environment.apiBaseUrl}/product`, request);
  }

  getProductList(filter?: { code?: string; name?: string; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.code) {
      params = params.set('code', filter.code);
    }
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}/product/all`, { params });
  }

  getProductByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/product/${id}`);
  }

  deleteProductByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/product/${id}`);
  }
}
