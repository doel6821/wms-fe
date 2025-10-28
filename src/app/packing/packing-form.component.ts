import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import Swal from 'sweetalert2';
import { Customer, CustomerQueryParams } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { SalesOrderService } from '../services/sales.order.service';
import { SalesOrderRequest, SalesOrderQueryParams, PackingOrderRequest } from '../models/sales.order.model';
import { PackingOrderService } from '../services/packing.order.service';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './packing-form.component.html'
})
export class PackingFormComponent implements OnInit {
  form: FormGroup;
  purchaseId: string | null = null;
  isEditMode = false;
  isLoading = false;
  customers: Customer[] = [];
  filterCustomer: CustomerQueryParams = {};
  salesOrders: SalesOrderRequest[] = [];
  filter: SalesOrderQueryParams = {};
  salesOrderIds: number[] = []

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService, 
    private customerService: CustomerService, 
    private packingOrderService: PackingOrderService, 
  ) {
    this.form = this.fb.group({
      customerId: [0, Validators.required],
      customerName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.purchaseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.purchaseId;
    this.loadCustomers()

  }

  
  onCustomerChange(customerId: number) {
    const customer = this.customers.find(c => c.id == +customerId);
    if (customer) {
      this.form.patchValue({
        customerId: customer.id, 
        customerName: customer.name,  
      });
    }

    this.loadSalesOrders()

  }

  onSubmit() {
      var req = new PackingOrderRequest
      req.customerId = this.form.value.customerId
      req.salesOrderIds = this.salesOrderIds
      
      // Create new packing order
      this.packingOrderService.createPackingOrder(req).subscribe({
        next: (res) => {
          if (res.meta.code == "2000100") {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Packing order berhasil dibuat'
            }).then(() => {
              this.router.navigate(['/packing']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan packing order'
            });
          }
        },
        error: (err) => {
          console.error('Error saving packing order:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menyimpan packing order'
          });
        }
      });
    }
    

  loadCustomers() {
        this.isLoading = true;
        this.filterCustomer.page = 1;
        this.filterCustomer.limit = 9999;
        this.customerService.getCustomerList(this.filterCustomer).subscribe({
          next: (res) => {
            console.log(res.data);
            this.customers = res.data || [];
            // this.meta = res.meta || {};
            // this.totalData = res.count || 0;
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
  


  loadSalesOrders() {
      this.isLoading = true;
      this.filter.customerId = this.form.value.customerId;
      this.filter.allocation = "true"
      this.filter.page = 1;
      this.filter.limit = 9999;
      this.salesOrderService.getSalesOrderList(this.filter).subscribe({
        next: (res) => {
          console.log(res.data);
          this.salesOrders = res.data || [];
          this.isLoading = false;
          console.log(this.salesOrders);
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat memuat data sales order.'
          });
          console.error('Error:', err);
        }
      });
    }
  
  onCheckboxChange(event: any, id: any) {
    var checked = event.target.checked;
    if (checked) {
      this.salesOrderIds.push(+id)
    } else {
      this.salesOrderIds = this.salesOrderIds.filter(item => item !== id);
    }
    console.log(this.salesOrderIds)
  }
    

  back() {
    this.router.navigate(['/packing']);
  }
}
