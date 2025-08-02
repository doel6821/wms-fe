import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  getSalesReport(period: { from: string; to: string }) {
    return this.http.post('/api/reports/sales', period);
  }

  getPurchaseReport(period: { from: string; to: string }) {
    return this.http.post('/api/reports/purchase', period);
  }

  getProfitLossReport(period: { from: string; to: string }) {
    return this.http.post('/api/reports/profit-loss', period);
  }
}
