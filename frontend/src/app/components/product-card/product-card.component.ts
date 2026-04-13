import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ModalComponent } from '../modal/modal.component';
import { Product } from '../../models/product.model';
import { environment } from '../../environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, RouterLink, ModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  auth = inject(AuthService);
  private productService = inject(ProductService);
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() deleted = new EventEmitter<number>();
  
  showDeleteModal = false;

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.showDeleteModal = false;
    this.productService.deleteProduct(this.product.id!).subscribe({
      next: () => {
        this.deleted.emit(this.product.id);
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        alert('No se pudo eliminar el producto. Inténtalo de nuevo.');
      }
    });
  }

  closeModal(): void {
    this.showDeleteModal = false;
  }

  get imageUrl(): string {
    if (!this.product.image_url) return this.fallbackImage;
    if (this.product.image_url.startsWith('http')) return this.product.image_url;
    return `${environment.serverUrl}${this.product.image_url}`;
  }

  get isAvailable(): boolean {
    return this.product.stock > 0;
  }

  get fallbackImage(): string {
    return 'https://placehold.co/400x400/1e1e1e/666666?text=BBZ';
  }
}
