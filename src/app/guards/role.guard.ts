import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const role = localStorage.getItem('role');
    const allowedRoles = route.data['roles'] as string[];

    // Jika tidak ada role user (belum login)
    if (!role) {
      return this.router.createUrlTree(['/login']);
    }

    // Jika role user diizinkan
    if (allowedRoles.includes(role)) {
      return true;
    }

    // Jika role tidak sesuai, arahkan ke dashboard
    return this.router.createUrlTree(['/dashboard']);
  }
}
