import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from './../services/customer.service';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {

  form: FormGroup;
  customers: Customer[] = [];
  filter: CustomerQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(
    private fb: FormBuilder, 
    private customerService: CustomerService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      customerName: ['', null],
    });
  }

  ngOnInit(): void {
    this.loadCustomers(this.currPage)
  }

  loadCustomers(page: number) {
    this.isLoading = true;
    this.filter.name = this.form.value.customerName;
    this.filter.page = page;
    this.filter.limit = 10;
    this.customerService.getCustomerList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.customers = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.customers);
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
  }

  onFilter() {
    this.currPage = 1;
    this.loadCustomers(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadCustomers(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadCustomers(page);
  }



  goToAdd() {
    this.router.navigate(['/customers/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/customers/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/customers/detail', id]);
  }

  loadPage() {
        this.loadCustomers(this.currPage);
    }
}
