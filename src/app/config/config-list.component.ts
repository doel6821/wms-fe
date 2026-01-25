import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from './../services/config.service';
import { Configuration, ConfigurationQueryParams } from '../models/config.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config-list.component.html'
})
export class ConfigurationListComponent implements OnInit {

  form: FormGroup;
  configs: Configuration[] = [];
  filter: ConfigurationQueryParams = {};
  currPage = 1;
  totalRecord = 10;
  totalData = 0;
  isLoading = false;
  meta: any = {};
  Math = Math;

  constructor(private fb: FormBuilder, private configService: ConfigurationService, private router: Router) {
    this.form = this.fb.group({
      configName: ['', null],
    });
  }

  ngOnInit(): void {
    this.loadConfigs(this.currPage)
  }

  loadConfigs(page: number) {
    this.isLoading = true;
    this.filter.name = this.form.value.locationName;
    this.filter.page = page;
    this.filter.limit = 10;
    this.configService.getConfigList(this.filter).subscribe({
      next: (res) => {
        console.log(res.data);
        this.configs = res.data || [];
        this.meta = res.meta || {};
        this.totalData = res.count || 0;
        this.isLoading = false;
        console.log(this.configs);
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
    this.loadConfigs(this.currPage);
  }

  resetFilter() {
    this.form.reset();
    this.currPage = 1;
    this.loadConfigs(this.currPage);
  }

  onPageChange(page: number) {
    this.currPage = page;
    this.loadConfigs(page);
  }

  goToAdd() {
    this.router.navigate(['/config/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/config/edit', id]);
  }

  goToDetail(id: number) {
    this.router.navigate(['/config/detail', id]);
  }

  loadPage() {
    this.loadConfigs(this.currPage);
  }
}
