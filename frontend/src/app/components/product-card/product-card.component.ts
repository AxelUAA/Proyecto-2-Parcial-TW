import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { environment } from '../../environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  auth = inject(AuthService);
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
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
