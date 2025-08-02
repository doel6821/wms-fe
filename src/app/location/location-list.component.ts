import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-list.component.html'
})
export class LocationListComponent {
  locations = [
    { id: 1, name: 'Rak A1', description: 'Gudang Utama' },
    { id: 2, name: 'Rak B2', description: 'Gudang Cabang' }
  ];

  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigate(['/locations/add']);
  }
}
