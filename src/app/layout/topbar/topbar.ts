import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  imports: [CommonModule]
})
export class TopbarComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = window.localStorage.getItem('user');
  }
  

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }

}


