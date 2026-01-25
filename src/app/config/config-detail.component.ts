import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../services/config.service';
import { Configuration } from '../models/config.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-detail.component.html'
})
export class ConfigurationDetailComponent implements OnInit {
  configId = '';
  config: Configuration = {} as Configuration;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationService: ConfigurationService
  ) {
    this.configId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.configId) {
      this.loadConfig();
    }
  }

  loadConfig() {
    this.isLoading = true;
    this.configurationService.getConfigByID(+this.configId).subscribe({
      next: (res: any) => {
        this.config = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pengaturan:', err);
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
    this.router.navigate(['/config/edit', this.configId]);
  }

  back() {
    this.router.navigate(['/config']);
  }
}
