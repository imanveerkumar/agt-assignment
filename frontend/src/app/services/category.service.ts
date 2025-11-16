import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  unique_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  getCategories(limit: number = 10, offset: number = 0, search: string = ''): Observable<CategoryListResponse> {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());
    if (search) {
      params.set('search', search);
    }
    return this.http.get<CategoryListResponse>(
      `${this.apiUrl}/categories?${params.toString()}`,
      { headers: this.getHeaders() }
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/categories/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createCategory(name: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/categories`,
      { name },
      { headers: this.getHeaders() }
    );
  }

  updateCategory(id: number, name: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/categories/${id}`,
      { name },
      { headers: this.getHeaders() }
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/categories/${id}`,
      { headers: this.getHeaders() }
    );
  }
}

