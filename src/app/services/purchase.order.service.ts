import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { PurchaseOrderRequest } from '../models/purchase.order.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createPurchaseOrder(request: PurchaseOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/purchase/`, request);
  }

  getPurchaseOrderList(filter?: { supplierId?: number; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.supplierId) {
      params = params.set('supplierId', filter.supplierId.toString());
    }
    if (filter?.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter?.limit !== undefined) {
      params = params.set('limit', filter.limit.toString());
    }

    return this.http.get(`${environment.apiBaseUrl}/purchase/all`, { 
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

  getPurchaseOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/purchase/${id}`, {
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

  getPurchaseOrderRecomendationBySupplierID(supplierId: number) {
    return this.http.get(`${environment.apiBaseUrl}/purchase/recomendation/${supplierId}`, {
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

  getAvailableReceiveOrder(supplierId: number, productId: number) {
    let params = new HttpParams();
    
    if (supplierId != 0) {
      params = params.set('supplierId', supplierId);
    }
    if (productId != 0) {
      params = params.set('productId', productId);
    }
    return this.http.get(`${environment.apiBaseUrl}/receive-order/available`, {
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

  updatePurchaseOrder(id: number, request: PurchaseOrderRequest) {
    return this.http.put(`${environment.apiBaseUrl}/purchase/${id}`, request);
  }

  deletePurchaseOrderByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/purchase/${id}`);
  }
}
