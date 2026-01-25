import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { DashboardQueryParams, DashboardResponse, DashboardResponseData } from '../models/dashboard.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  dataDashboard!: DashboardResponseData;

  totalPaymentSupplier: number = 0;
  totalReceivePaymentCustomer: number = 0;

  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder, 
  ) {
    const today = new Date();
    const localFirstDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


    this.form = this.fb.group({
      startDate: [localFirstDay],
      endDate: [localToday],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {

    this.dashboardService.getDashboardData({
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
    }).subscribe({
        next: (res) => {
          console.log(res.data);
          this.dataDashboard = res.data || [];
          this.isLoading = false;
          console.log(this.dataDashboard);
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat memuat data pelanggan.'
          });
          console.error('Error:', err);
        }
      });

    this.isLoading = false;
  }


  applyFilter() {
    this.loadData();
    
  }
  
  resetFilter() {
    const today = new Date();
    const localFirstDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.form.patchValue({
        startDate: localFirstDay,
        endDate: localToday,
      });
    this.loadData();
  }
}


