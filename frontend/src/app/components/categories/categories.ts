import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: Category[] = [];
  total = 0;
  limit = environment.pagination.defaultLimit;
  offset = environment.pagination.defaultOffset;
  searchTerm = '';
  showModal = false;
  editingCategory: Category | null = null;
  formData = { name: '' };

  get currentPage() {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories(this.limit, this.offset, this.searchTerm).subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.total = response.total;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        alert('Error loading categories');
      }
    });
  }

  openCreateModal() {
    this.editingCategory = null;
    this.formData = { name: '' };
    this.showModal = true;
  }

  openEditModal(category: Category) {
    this.editingCategory = category;
    this.formData = { name: category.name };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
  }

  saveCategory() {
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory.id, this.formData.name).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          alert(err.error?.error || 'Error updating category');
        }
      });
    } else {
      this.categoryService.createCategory(this.formData.name).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          alert(err.error?.error || 'Error creating category');
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category? This will also delete all associated products.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          alert(err.error?.error || 'Error deleting category');
        }
      });
    }
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadCategories();
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.loadCategories();
    }
  }
}

