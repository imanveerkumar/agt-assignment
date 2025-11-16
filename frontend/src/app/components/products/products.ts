import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductListOptions } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [];
  allCategories: Category[] = [];
  total = 0;
  limit = environment.pagination.defaultLimit;
  offset = environment.pagination.defaultOffset;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  sortBy = 'created_at';
  sortOrder: 'ASC' | 'DESC' = 'DESC';
  showModal = false;
  editingProduct: Product | null = null;
  formData = { name: '', price: 0, category_id: 0, image: '' };

  get currentPage() {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories(1000, 0).subscribe({
      next: (response) => {
        this.allCategories = response.categories;
      }
    });
  }

  loadProducts() {
    const options: ProductListOptions = {
      limit: this.limit,
      offset: this.offset,
      search: this.searchTerm,
      category_id: this.selectedCategoryId || undefined,
      sort_by: this.sortBy,
      sort_order: this.sortOrder
    };

    this.productService.getProducts(options).subscribe({
      next: (response) => {
        this.products = response.products;
        this.total = response.total;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        alert('Error loading products');
      }
    });
  }

  openCreateModal() {
    this.editingProduct = null;
    this.formData = { name: '', price: 0, category_id: this.allCategories[0]?.id || 0, image: '' };
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.editingProduct = product;
    this.formData = {
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      image: product.image || ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
  }

  saveProduct() {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, this.formData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          alert(err.error?.error || 'Error updating product');
        }
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          alert(err.error?.error || 'Error creating product');
        }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          alert(err.error?.error || 'Error deleting product');
        }
      });
    }
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.loadProducts();
    }
  }
}

