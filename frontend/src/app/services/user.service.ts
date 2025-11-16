import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  getUsers(limit: number = 10, offset: number = 0): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(
      `${this.apiUrl}/users?limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/users/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createUser(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/register`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }

  updateUser(id: number, email: string, password?: string): Observable<any> {
    const body: any = { email };
    if (password) {
      body.password = password;
    }
    return this.http.put(
      `${this.apiUrl}/users/${id}`,
      body,
      { headers: this.getHeaders() }
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/users/${id}`,
      { headers: this.getHeaders() }
    );
  }
}

