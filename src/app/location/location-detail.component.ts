import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';
import { Location } from '../models/location.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-detail.component.html'
})
export class LocationDetailComponent implements OnInit {
  locationId = '';
  location: Location = {} as Location;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {
    this.locationId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.locationId) {
      this.loadLocation();
    }
  }

  loadLocation() {
    this.isLoading = true;
    this.locationService.getLocationByID(+this.locationId).subscribe({
      next: (res: any) => {
        this.location = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading location:', err);
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
    this.router.navigate(['/locations/edit', this.locationId]);
  }

  back() {
    this.router.navigate(['/locations']);
  }
}
