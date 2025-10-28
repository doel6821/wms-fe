import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from './../services/location.service';
import { Location, LocationQueryParams } from '../models/location.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location-list.component.html'
})
export class LocationListComponent implements OnInit {

  form: FormGroup;
  locations: Location[] = [];
  filter: LocationQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(private fb: FormBuilder, private locationService: LocationService, private router: Router) {
    this.form = this.fb.group({
      locationName: ['', null],
      locationCode: ['', null],
    });
  }

  ngOnInit(): void {
    this.loadLocations(this.currPage)
  }

  loadLocations(page: number) {
    this.isLoading = true;
    this.filter.name = this.form.value.locationName;
    this.filter.code = this.form.value.locationCode;
    this.filter.page = page;
    this.filter.limit = 10;
    this.locationService.getLocationList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.locations = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
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

  onFilter() {
    this.currPage = 1;
    this.loadLocations(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadLocations(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadLocations(page);
  }

  goToAdd() {
    this.router.navigate(['/locations/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/locations/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/locations/detail', id]);
  }

  loadPage() {
    this.loadLocations(this.currPage);
  }
}
