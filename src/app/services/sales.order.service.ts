import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { SalesOrderRequest, SalesOrderQueryParams, SalesOrderListResponse } from '../models/sales.order.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SalesOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createSalesOrder(request: SalesOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/sales-order`, request);
  }

  updateSalesOrder(id: number, request: SalesOrderRequest) {
    return this.http.put(`${environment.apiBaseUrl}/sales-order/${id}`, request);
  }

  getSalesOrderList(filter?: { customerId?: number; allocation?: string, page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.customerId) {
      params = params.set('customerId', filter.customerId);
    }
    if (filter?.allocation) {
      params = params.set('allocation', filter.allocation);
    }
    if (filter?.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter?.limit !== undefined) {
      params = params.set('limit', filter.limit.toString());
    }

    return this.http.get(`${environment.apiBaseUrl}/sales-order/all`, { 
      params,
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          // Handle concatenated JSON responses from backend
          const jsonObjects = response.split('}{');
          if (jsonObjects.length > 1) {
            // Fix the split by adding back the braces
            for (let i = 0; i < jsonObjects.length; i++) {
              if (i > 0) jsonObjects[i] = '{' + jsonObjects[i];
              if (i < jsonObjects.length - 1) jsonObjects[i] = jsonObjects[i] + '}';
            }
            
            // Parse each JSON and find the successful one
            for (const jsonStr of jsonObjects) {
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.meta?.code === "2000100") {
                  return parsed;
                }
              } catch (e) {
                console.warn('Failed to parse JSON fragment:', jsonStr);
              }
            }
          }
          
          return JSON.parse(response);
        } catch (error) {
          console.error('JSON Parse Error:', error);
          console.error('Raw response:', response);
          throw error;
        }
      })
    );
  }

  getSalesOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/sales-order/${id}`, {
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          // Handle concatenated JSON responses from backend
          const jsonObjects = response.split('}{');
          if (jsonObjects.length > 1) {
            // Fix the split by adding back the braces
            for (let i = 0; i < jsonObjects.length; i++) {
              if (i > 0) jsonObjects[i] = '{' + jsonObjects[i];
              if (i < jsonObjects.length - 1) jsonObjects[i] = jsonObjects[i] + '}';
            }
            
            // Parse each JSON and find the successful one
            for (const jsonStr of jsonObjects) {
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.meta?.code === "2000100") {
                  return parsed;
                }
              } catch (e) {
                console.warn('Failed to parse JSON fragment:', jsonStr);
              }
            }
          }
          
          return JSON.parse(response);
        } catch (error) {
          console.error('JSON Parse Error:', error);
          console.error('Raw response:', response);
          throw error;
        }
      })
    );
  }

  getSalesOrderItemByProductID(id: number, tipe:string) {

    let params = new HttpParams();
    if (id != 0) {
      console.log("productId : ", id)
      params = params.set("productId", id )
    }
    
    if (tipe == "Allocation") {
      params = params.set('tipe', "Allocation");
    } else if (tipe == "BackOrder") {
      params = params.set('tipe', "BackOrder");
    } else if (tipe == "OnPacking") {
      params = params.set('tipe', "OnPacking");
    }


    return this.http.get(`${environment.apiBaseUrl}/sales-order-item`, {
      params,
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          // Handle concatenated JSON responses from backend
          const jsonObjects = response.split('}{');
          if (jsonObjects.length > 1) {
            // Fix the split by adding back the braces
            for (let i = 0; i < jsonObjects.length; i++) {
              if (i > 0) jsonObjects[i] = '{' + jsonObjects[i];
              if (i < jsonObjects.length - 1) jsonObjects[i] = jsonObjects[i] + '}';
            }
            
            // Parse each JSON and find the successful one
            for (const jsonStr of jsonObjects) {
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.meta?.code === "2000100") {
                  return parsed;
                }
              } catch (e) {
                console.warn('Failed to parse JSON fragment:', jsonStr);
              }
            }
          }
          
          return JSON.parse(response);
        } catch (error) {
          console.error('JSON Parse Error:', error);
          console.error('Raw response:', response);
          throw error;
        }
      })
    );
  }

  deleteSalesOrderByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/sales-order/${id}`);
  }
}
