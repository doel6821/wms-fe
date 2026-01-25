import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../services/location.service';
import { Location } from '../models/location.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location-form.component.html'
})
export class LocationFormComponent implements OnInit {
  form: FormGroup;
  locationId: string | null = null;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {
    this.form = this.fb.group({
      id: [0, Validators.required], 
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.locationId;
    
    if (this.isEditMode && this.locationId) {
      this.loadLocation();
    }
  }

  loadLocation() {
    this.isLoading = true;
    this.locationService.getLocationByID(+this.locationId!).subscribe({
      next: (res: any) => {
        const location = res.data;
        this.form.patchValue({
          id: location.id,
          name: location.name,
          code: location.code,
          description: location.description
        });
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

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode) {
        // Update location
        this.locationService.updateLocation(+this.locationId!, formData).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data lokasi berhasil diupdate'
              }).then(() => {
                this.router.navigate(['/locations']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error updating location:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal mengupdate lokasi'
            });
          }
        });
      } else {
        // Create new location
        this.locationService.registerLocation(formData).subscribe({
          next: (res: any) => {
            if (res.meta.code == "2000100") {
              Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data lokasi berhasil disimpan'
              }).then(() => {
                this.router.navigate(['/locations']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.meta.message
              });
            }
          },
          error: (err) => {
            console.error('Error saving location:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan lokasi'
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Mohon lengkapi semua field yang wajib diisi'
      });
    }
  }

  back() {
    this.router.navigate(['/locations']);
  }
}
