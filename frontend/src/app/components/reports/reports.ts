import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductListOptions } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  allCategories: Category[] = [];
  searchTerm = '';
  selectedCategoryId: number | null = null;
  sortBy = 'created_at';
  sortOrder: 'ASC' | 'DESC' = 'DESC';
  downloading: 'csv' | 'xlsx' | null = null;
  error = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories(1000, 0).subscribe({
      next: (response) => {
        this.allCategories = response.categories;
      }
    });
  }

  downloadReport(format: 'csv' | 'xlsx') {
    this.downloading = format;
    this.error = '';

    const options: ProductListOptions = {
      search: this.searchTerm,
      category_id: this.selectedCategoryId || undefined,
      sort_by: this.sortBy,
      sort_order: this.sortOrder
    };

    this.productService.downloadReport(format, options).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.downloading = null;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error downloading report';
        this.downloading = null;
      }
    });
  }
}

