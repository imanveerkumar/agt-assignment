import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  uploadResult: any = null;

  constructor(private productService: ProductService) {}

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadResult = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        this.selectedFile = file;
        this.uploadResult = null;
      } else {
        alert('Please upload a CSV file');
      }
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadResult = null;

    this.productService.bulkUpload(this.selectedFile).subscribe({
      next: (result) => {
        this.uploading = false;
        this.uploadResult = { ...result, success: true };
      },
      error: (err) => {
        this.uploading = false;
        this.uploadResult = {
          success: false,
          error: err.error?.error || 'Upload failed'
        };
      }
    });
  }

  clearFile() {
    this.selectedFile = null;
    this.uploadResult = null;
  }
}

