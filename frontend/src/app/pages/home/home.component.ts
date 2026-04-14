import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { environment } from '../../environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  featuredProducts: Product[] = [];
  isLoading = true;

  categories = [
    { name: 'Hoodies', emoji: '🧥', slug: 'Hoodies', image: '/images/categories/Hoodies.png' },
    { name: 'Playeras', emoji: '👕', slug: 'Playeras', image: '/images/categories/Playeras.png' },
    { name: 'Sneakers', emoji: '👟', slug: 'Sneakers', image: '/images/categories/Sneakers.png' },
    { name: 'Accesorios', emoji: '🎒', slug: 'Accesorios', image: '/images/categories/Accesorios.png' },
    { name: 'Pants', emoji: '👖', slug: 'Pants', image: '/images/categories/Pants.png' }
  ];

  ngOnInit(): void {
    fetch(`${environment.apiUrl}/products?featured=true`)
      .then(res => res.json())
      .then(products => {
        try {
          if (Array.isArray(products) && products.length > 0) {
            this.featuredProducts = products.slice(0, 4);
          } else {
            this.featuredProducts = [];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        } catch (err) {
          console.error("Error procesando productos:", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
      .catch(err => {
        console.error("Error Fetch API:", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  onAddToCart(product: Product): void {
    if (!this.auth.isLoggedIn()) { return; }
    this.cartService.addToCart(product.id!).subscribe();
  }

  onProductDeleted(id: number): void {
    this.featuredProducts = this.featuredProducts.filter(p => p.id !== id);
    this.cdr.detectChanges();
  }
}
