import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  login(credentials: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/login`, credentials);
  }
}
