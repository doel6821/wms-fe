import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  imports: [CommonModule]
})
export class TopbarComponent {

  constructor(
    private router: Router
  ) {}

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  this.router.navigate(['/login']);
}

}


