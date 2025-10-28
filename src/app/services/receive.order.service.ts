import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { ReceiveOrderRequest, StockedRequest } from '../models/purchase.order.model';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ReceiveOrderService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createReceiveOrder(request: ReceiveOrderRequest) {
    return this.http.post(`${environment.apiBaseUrl}/receive-order/`, request, { 
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
    return this.http.get(`${environment.apiBaseUrl}/receive-order/all`, { 
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

  getReceiveOrderByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/receive-order/${id}`);
  }

  getReceiveOrderByProductID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/receive-order/product/${id}`);
  }

  stockedReceiveOrderByID(request: StockedRequest) {
    return this.http.post(`${environment.apiBaseUrl}/receive-order/stocked`, request, { 
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

}
