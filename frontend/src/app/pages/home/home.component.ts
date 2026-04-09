import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

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
    { name: 'Hoodies', emoji: '', slug: 'Hoodies' },
    { name: 'Playeras', emoji: '', slug: 'Playeras' },
    { name: 'Sneakers', emoji: '', slug: 'Sneakers' },
    { name: 'Accesorios', emoji: '', slug: 'Accesorios' },
    { name: 'Pants', emoji: '', slug: 'Pants' }
  ];

  ngOnInit(): void {
    fetch('http://localhost:3000/api/products?featured=true')
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
}
