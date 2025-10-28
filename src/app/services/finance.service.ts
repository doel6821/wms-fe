import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private baseUrl = 'http://localhost:8080/api/v1/finance';

  constructor(private http: HttpClient) {}

  getOverdueInvoices() {
    return this.http.get<any>(`${this.baseUrl}/invoices?status=overdue`);
  }

  getDuePayments() {
    return this.http.get<any>(`${this.baseUrl}/payments?status=due_today`);
  }

  updateStatus(id: number, status: string, type: string) {
    const endpoint = type === 'invoices' ? 'invoices' : 'payments';
    return this.http.put(`${this.baseUrl}/${endpoint}/${id}/status`, { status });
  }
}


