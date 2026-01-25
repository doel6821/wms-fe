import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../services/config.service';
import { Configuration } from '../models/config.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config-form.component.html'
})
export class ConfigurationFormComponent implements OnInit {
  form: FormGroup;
  configId: string | null = null;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private configurationService: ConfigurationService
  ) {
    this.form = this.fb.group({
      id: [0, Validators.required], 
      name: ['', Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.configId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.configId;
    
    if (this.isEditMode && this.configId) {
      this.loadConfig();
    }
  }

  loadConfig() {
    this.isLoading = true;
    this.configurationService.getConfigByID(+this.configId!).subscribe({
      next: (res: any) => {
        const config = res.data;
        this.form.patchValue({
          id: config.id,
          name: config.name,
          value: config.value,
          description: config.description
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pengaturan:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data Pengaturan'
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode) {
        // Update config
        this.configurationService.updateConfig(+this.configId!, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Pengaturan berhasil diupdate'
            }).then(() => {
              this.router.navigate(['/config']);
            });
          },
          error: (err) => {
            console.error('Error updating pengaturan:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal mengupdate pengaturan'
            });
          }
        });
      } else {
        // Create new location
        this.configurationService.registerConfig(formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Pengaturan berhasil ditambahkan'
            }).then(() => {
              this.router.navigate(['/config']);
            });
          },
          error: (err) => {
            console.error('Error saving pengaturan:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal menyimpan pengaturan'
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
    this.router.navigate(['/config']);
  }
}
