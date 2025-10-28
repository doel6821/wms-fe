import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const router = inject(Router);

  // Cek apakah running di browser
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // ✅ akses diperbolehkan
    } else {
      return router.parseUrl('/login'); // ✅ redirect ke login
    }
  }

  // Default kalau SSR → redirect ke login
  return router.parseUrl('/login');
};
