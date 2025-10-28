import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReceiveOrderService } from '../services/receive.order.service';
import { StockedRequest } from '../models/purchase.order.model';
import { Location, LocationQueryParams } from '../models/location.model';
import Swal from 'sweetalert2';
import { LocationService } from '../services/location.service';
import { FormsModule } from '@angular/forms';
import { ReceiveOrder } from '../models/receive.model';


@Component({
  selector: 'app-receive-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receive-detail.component.html'
})
export class ReceiveDetailComponent implements OnInit {
  receiveId = '';
  receiveOrder: ReceiveOrder = {};
  isLoading = false;
  locations: Location[] = [];
  filter: LocationQueryParams = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private receiveOrderService: ReceiveOrderService,
  ) {
    this.receiveId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadLocations();
    if (this.receiveId) {
      this.loadReceiveOrder();
    }
  }

  loadReceiveOrder() {
    this.isLoading = true;
    this.receiveOrderService.getReceiveOrderByID(+this.receiveId).subscribe({
      next: (res: any) => {
        this.receiveOrder = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading receive order:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat detail receive order'
        });
      }
    });
  }

  loadLocations() {
    this.isLoading = true;
    this.filter.page = 1;
    this.filter.limit = 9999;
    this.locationService.getLocationList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.locations = res.data || [];
        console.log(this.locations);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memuat data lokasi.'
        });
        console.error('Error:', err);
      }
    });
  }

  completeReceive(id: any) {
    var receiveReq = new StockedRequest
    receiveReq.receiveOrderId = +id
    receiveReq.items = this.receiveOrder.items
    this.receiveOrderService.stockedReceiveOrderByID(receiveReq).subscribe({
            next: (res) => {
              if (res.meta.code == "2000100") {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Update stock receive berhasil dibuat'
                }).then(() => {
                  this.router.navigate(['/receive']);
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Gagal update stock receive'
                });
              }
            },
            error: (err) => {
              console.error('Error update stock receive:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal update stock receive'
              });
            }
          });

  }

  isAllLocationFilled(): boolean {
    if (!this.receiveOrder?.items || this.receiveOrder.items.length === 0) return false;
    return this.receiveOrder.items.every(item => !!item.productLocation);
  }


  back() {
    this.router.navigate(['/receive']);
  }

  edit() {
    this.router.navigate(['/receive/edit', this.receiveId]);
  }
}
