import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
  customerId = '';
  customer: Customer = {} as Customer;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.customerId) {
      this.loadCustomer();
    }
  }

  loadCustomer() {
    this.isLoading = true;
    this.customerService.getCustomerByID(+this.customerId).subscribe({
      next: (res: any) => {
        this.customer = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customer:', err);
        this.isLoading = false;
        Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Gagal memuat data lokasi'
                });
      }
    });
  }

  goToEdit() {
    this.router.navigate(['/customers/edit', this.customerId]);
  }

  back() {
    this.router.navigate(['/customers']);
  }
}
