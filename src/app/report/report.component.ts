import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from './report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ReportService],
  templateUrl: './report.component.html'
})
export class ReportComponent {
  period = {
    from: '',
    to: ''
  };

  reports = [
    { id: 1, date: '2025-07-01-2025-07-31', reportType: 'Laporan Penjualan', periode: '2025-07-01 - 2025-07-31', fileName: 'report penjualan juli 2025' },
    { id: 2, date: '2025-06-01-2025-06-31', reportType: 'Laporan Penjualan', periode: '2025-06-01 - 2025-06-31', fileName: 'report penjualan juni 2025' }
  ];

  constructor(private reportService: ReportService) {}

  requestSalesReport() {
    this.reportService.getSalesReport(this.period).subscribe(result => {
      console.log('Sales Report:', result);
    });
  }

  requestPurchaseReport() {
    this.reportService.getPurchaseReport(this.period).subscribe(result => {
      console.log('Purchase Report:', result);
    });
  }

  requestProfitLossReport() {
    this.reportService.getProfitLossReport(this.period).subscribe(result => {
      console.log('Profit & Loss Report:', result);
    });
  }

  download(fileName: string) {
    console.log("download");
    // do download file
  }
}
