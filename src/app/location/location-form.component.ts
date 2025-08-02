import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-form.component.html'
})
export class LocationFormComponent {
  location = {
    name: '',
    description: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Lokasi disimpan:', this.location);
    this.router.navigate(['/locations']);
  }

  back() {
    this.router.navigate(['/locations']);
  }
}
