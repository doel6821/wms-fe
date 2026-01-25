import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { ChangePasswordRequest, LoginRequest } from '../models/auth.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  login(credentials: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/login`, credentials);
  }

  changePassword(credentials: ChangePasswordRequest) {
    return this.http.post(`${environment.apiBaseUrl}/change-password`, credentials);
  }

  forgotPassword(credentials: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/forgot`, credentials);
  }

  registerTenant(credentials: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/register-tenant`, credentials, { 
              responseType: 'text'
            }).pipe(
              map(response => {
                try {
                  // Handle concatenated JSON responses from backend
                  const jsonObjects = response.split('}{');
                  if (jsonObjects.length > 1) {
                    // Fix the split by adding back the braces
                    for (let i = 0; i < jsonObjects.length; i++) {
                      if (i > 0) jsonObjects[i] = '{' + jsonObjects[i];
                      if (i < jsonObjects.length - 1) jsonObjects[i] = jsonObjects[i] + '}';
                    }
                    
                    // Parse each JSON and find the successful one
                    for (const jsonStr of jsonObjects) {
                      try {
                        const parsed = JSON.parse(jsonStr);
                        if (parsed.meta?.code === "2000100") {
                          return parsed;
                        }
                      } catch (e) {
                        console.warn('Failed to parse JSON fragment:', jsonStr);
                      }
                    }
                  }
                  
                  return JSON.parse(response);
                } catch (error) {
                  console.error('JSON Parse Error:', error);
                  console.error('Raw response:', response);
                  throw error;
                }
              })
            );
  }

  registerUser(credentials: LoginRequest) {
    return this.http.post(`${environment.apiBaseUrl}/register-user`, credentials);
  }
}
