import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { Location, RequestLocation, LocationListResponse } from '../models/location.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerLocation(request: RequestLocation) {
    return this.http.post(`${environment.apiBaseUrl}/location/`, request);
  }

  getLocationList(filter?: { code?: string; name?: string; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.code) {
      params = params.set('code', filter.code);
    }
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter?.limit !== undefined) {
      params = params.set('limit', filter.limit.toString());
    }

    return this.http.get(`${environment.apiBaseUrl}/location/all`, { 
      params,
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

  getLocationByID(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/location/${id}`);
  }

  getLocationByCode(code: string) {
    return this.http.get(`${environment.apiBaseUrl}/location/${code}`);
  }

  updateLocation(id: number, request: RequestLocation) {
    return this.http.post(`${environment.apiBaseUrl}/location/`, request);
  }

  deleteLocationByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/location/${id}`);
  }
}
