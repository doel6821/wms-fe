import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { RequestLocation } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  registerLocation(request: RequestLocation) {
    return this.http.post(`${environment.apiBaseUrl}/location`, request);
  }

  getLocationList(filter?: { code?: string; page?: number; limit?: number }) {
    let params = new HttpParams();
    
    if (filter?.code) {
      params = params.set('code', filter.code);
    }
    if (filter?.page) {
      params = params.set('page', filter.page);
    }
    if (filter?.limit) {
      params = params.set('limit', filter.limit);
    }
    return this.http.get(`${environment.apiBaseUrl}lLocation/all`, { params });
  }

  getLocationByCode(code: string) {
    return this.http.get(`${environment.apiBaseUrl}/location/${code}`);
  }

  deleteLocationByID(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}lLocation/${id}`);
  }
}
