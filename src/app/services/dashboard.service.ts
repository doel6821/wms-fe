import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { DashboardQueryParams, DashboardResponse, DashboardResponseData } from '../models/dashboard.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient); // ✅ ini yang direkomendasikan di standalone

  getDashboardData(filter?: { startDate?: string; endDate?: string;}) {
    let params = new HttpParams();
    
     if (filter?.startDate) {
      params = params.set('startDate', filter.startDate);
    }
    if (filter?.endDate) {
      params = params.set('endDate', filter.endDate);
    }

    return this.http.get(`${environment.apiBaseUrl}/dashboard/`, { 
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

}
