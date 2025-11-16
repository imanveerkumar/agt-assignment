import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: User[] = [];
  total = 0;
  limit = environment.pagination.defaultLimit;
  offset = environment.pagination.defaultOffset;
  showModal = false;
  editingUser: User | null = null;
  formData = { email: '', password: '' };

  get currentPage() {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.limit, this.offset).subscribe({
      next: (response) => {
        this.users = response.users;
        this.total = response.total;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        alert('Error loading users');
      }
    });
  }

  openCreateModal() {
    this.editingUser = null;
    this.formData = { email: '', password: '' };
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.editingUser = user;
    this.formData = { email: user.email, password: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingUser = null;
  }

  saveUser() {
    if (this.editingUser) {
      this.userService.updateUser(this.editingUser.id, this.formData.email, this.formData.password || undefined).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          alert(err.error?.error || 'Error updating user');
        }
      });
    } else {
      this.userService.createUser(this.formData.email, this.formData.password).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          alert(err.error?.error || 'Error creating user');
        }
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          alert(err.error?.error || 'Error deleting user');
        }
      });
    }
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.loadUsers();
    }
  }
}

