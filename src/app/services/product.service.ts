import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { RequestProduct, Product, ProductQueryParams, ProductListResponse } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerProduct(request: RequestProduct) {
    return this.http.post(`${environment.apiBaseUrl}/product/`, request);
  }

  getProductList(filter?: { code?: string; name?: string; page?: number; limit?: number, supplier?: number }) {
    let params = new HttpParams();
    
    if (filter?.code) {
      params = params.set('code', filter.code);
    }
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter?.limit !== undefined) {
      params = params.set('limit', filter.limit.toString());
    }
    if (filter?.supplier !== undefined) {
      params = params.set('supplier', filter.supplier.toString());
    }

    console.log('Making API call to:', `${environment.apiBaseUrl}/product/all`);
    console.log('With params:', params.toString());
    
    return this.http.get(`${environment.apiBaseUrl}/product/all`, { 
      params,
      responseType: 'text'
    }).pipe(
      map(response => {
        console.log('Raw API response:', response);
        try {
          // Handle concatenated JSON responses from backend
          const jsonObjects = response.split('}{');
          if (jsonObjects.length > 1) {
            console.log('Found concatenated JSON, splitting...');
            // Fix the split by adding back the braces
            for (let i = 0; i < jsonObjects.length; i++) {
              if (i > 0) jsonObjects[i] = '{' + jsonObjects[i];
              if (i < jsonObjects.length - 1) jsonObjects[i] = jsonObjects[i] + '}';
            }
            
            // Parse each JSON and find the successful one
            for (const jsonStr of jsonObjects) {
              try {
                const parsed = JSON.parse(jsonStr);
                console.log('Parsed JSON fragment:', parsed);
                if (parsed.meta?.code === "2000100") {
                  console.log('Found successful response:', parsed);
                  return parsed;
                }
              } catch (e) {
                console.warn('Failed to parse JSON fragment:', jsonStr);
              }
            }
          }
          
          const singleParsed = JSON.parse(response);
          console.log('Single JSON parsed:', singleParsed);
          return singleParsed;
        } catch (error) {
          console.error('JSON Parse Error:', error);
          console.error('Raw response:', response);
          throw error;
        }
      })
    );
  }

  getProductByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/product/${id}`);
  }

  updateProduct( request: RequestProduct) {
    return this.http.post(`${environment.apiBaseUrl}/product`, request);
  }

  deleteProductByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/product/${id}`);
  }
}
