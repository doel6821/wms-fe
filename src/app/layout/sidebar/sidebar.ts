import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  link: string;
  roles: string[]; // role yang boleh melihat menu ini
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  userRole: string = ''; // role user yang sedang login
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Ambil role user dari localStorage (atau dari auth service)
    this.userRole = window.localStorage.getItem('role') || 'guest';

    // Daftar menu lengkap + role yang diizinkan
    this.menuItems = [
      { label: 'Dashboard', link: '/dashboard', roles: ['admin', 'sales', 'warehouse', 'finance'] },
      { label: 'Pengelolaan Pengguna', link: '/users', roles: ['admin'] },
      { label: 'Pengaturan', link: '/config', roles: ['admin'] },
      { label: 'Produk', link: '/products', roles: ['admin', 'sales', 'warehouse'] },
      { label: 'Pelanggan', link: '/customers', roles: ['admin', 'sales'] },
      { label: 'Supplier', link: '/suppliers', roles: ['admin', 'warehouse'] },
      { label: 'Finance', link: '/finance', roles: ['admin', 'finance'] },
      { label: 'Lokasi', link: '/locations', roles: ['admin', 'warehouse'] },
      { label: 'Penjualan', link: '/sales', roles: ['admin', 'sales'] },
      { label: 'Invoice Penjualan', link: '/sales-invoice', roles: ['admin', 'sales' ,'finance'] },
      { label: 'Pembelian', link: '/purchases', roles: ['admin', 'warehouse'] },
      { label: 'Packing', link: '/packing', roles: ['admin', 'warehouse'] },
      { label: 'Penerimaan Barang', link: '/receive', roles: ['admin', 'warehouse', 'finance'] },
    ];
  }

  // Filter menu berdasarkan role
  get filteredMenu() {
    return this.menuItems.filter(item => item.roles.includes(this.userRole));
  }
}



