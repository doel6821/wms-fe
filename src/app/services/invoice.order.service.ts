import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { InvoiceRequest } from '../models/sales.order.model';
import { PaymentRequest } from '../models/invoice.order.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  createInvoice(request: InvoiceRequest) {
    return this.http.post(`${environment.apiBaseUrl}/invoice/`, request, { 
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

  paymentInvoice(invoiceId: number, request: PaymentRequest) {
    return this.http.post(`${environment.apiBaseUrl}/finance/receive`, request , { 
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

  getInvoiceList(filter?: { customerId: number; page?: number; limit?: number, dueDate?: string, startDate?: string, endDate?: string, paymentStatus?: string }) {
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
    if (filter?.dueDate) {
      params = params.set('dueDate', filter.dueDate);
    }
    if (filter?.startDate) {
      params = params.set('startDate', filter.startDate);
    }
    if (filter?.endDate) {
      params = params.set('endDate', filter.endDate);
    }
    if (filter?.paymentStatus) {
      params = params.set('paymentStatus', filter.paymentStatus);
    }
    return this.http.get(`${environment.apiBaseUrl}/invoice/all`, { 
              params ,
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

  getInvoiceByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/invoice/${id}`);
  }

}
