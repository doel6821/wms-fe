import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environtments/environtment';
import { Observable } from 'rxjs';
import { User, UserListResponse, CreateUserRequest } from '../models/user.model';
import * as sha512 from 'js-sha512';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(filter?: { email?: string; page?: number; limit?: number }): Observable<UserListResponse> {
    let params = new HttpParams();
    if (filter?.email) params = params.set('email', filter.email);
    if (filter?.page) params = params.set('page', filter.page);
    if (filter?.limit) params = params.set('limit', filter.limit);

    return this.http.get<UserListResponse>(`${environment.apiBaseUrl}/user/all`, { params });
  }

  createUser(body: CreateUserRequest) {
    let pass = sha512.sha512(body.password)
    body.password =  pass
    console.log(body)
    return this.http.post(`${environment.apiBaseUrl}/register-user`, body);
  }

  updateUserRole(id: number, role: string) {
    return this.http.post(`${environment.apiBaseUrl}/update-user/${id}`, { role });
  }
}
