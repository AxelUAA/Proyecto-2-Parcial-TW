import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { environment } from '../../environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  product: Product | null = null;
  isLoading = true;
  quantity = 1;
  cartMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (p) => { this.product = p; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  get isAvailable(): boolean {
    return (this.product?.stock ?? 0) > 0;
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.cartMessage = ' Inicia sesión para agregar al carrito';
      this.cdr.detectChanges();
      setTimeout(() => { this.cartMessage = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }
    this.cartService.addToCart(this.product!.id!, this.quantity).subscribe({
      next: () => {
        this.cartMessage = ' Producto agregado al carrito';
        this.cdr.detectChanges();
        setTimeout(() => { this.cartMessage = ''; this.cdr.detectChanges(); }, 3000);
      }
    });
  }

  fallbackImage = 'https://placehold.co/600x600/1e1e1e/666666?text=BBZ';

  get imageUrl(): string {
    if (!this.product?.image_url) return this.fallbackImage;
    if (this.product.image_url.startsWith('http')) return this.product.image_url;
    return `${environment.serverUrl}${this.product.image_url}`;
  }
}
