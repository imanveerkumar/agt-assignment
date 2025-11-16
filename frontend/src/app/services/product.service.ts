import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  unique_id: string;
  name: string;
  image?: string;
  price: number;
  category_id: number;
  category_name?: string;
  category_unique_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductListOptions {
  limit?: number;
  offset?: number;
  search?: string;
  category_id?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  getProducts(options: ProductListOptions = {}): Observable<ProductListResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.offset) params.set('offset', options.offset.toString());
    if (options.search) params.set('search', options.search);
    if (options.category_id) params.set('category_id', options.category_id.toString());
    if (options.sort_by) params.set('sort_by', options.sort_by);
    if (options.sort_order) params.set('sort_order', options.sort_order);

    return this.http.get<ProductListResponse>(
      `${this.apiUrl}/products?${params.toString()}`,
      { headers: this.getHeaders() }
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/products/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createProduct(product: Partial<Product>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/products`,
      product,
      { headers: this.getHeaders() }
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/products/${id}`,
      product,
      { headers: this.getHeaders() }
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/products/${id}`,
      { headers: this.getHeaders() }
    );
  }

  bulkUpload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${this.apiUrl}/upload/bulk`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  downloadReport(format: 'csv' | 'xlsx', options: ProductListOptions = {}): Observable<Blob> {
    const params = new URLSearchParams();
    params.set('format', format);
    if (options.search) params.set('search', options.search);
    if (options.category_id) params.set('category_id', options.category_id.toString());
    if (options.sort_by) params.set('sort_by', options.sort_by);
    if (options.sort_order) params.set('sort_order', options.sort_order);

    return this.http.get(
      `${this.apiUrl}/reports/products?${params.toString()}`,
      {
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
  }
}

