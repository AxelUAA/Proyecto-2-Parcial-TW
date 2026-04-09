import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';
import { environment } from '../../environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = true;

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.cartService.loadCart().subscribe({ 
        next: () => { this.isLoading = false; this.cdr.detectChanges(); }, 
        error: () => { this.isLoading = false; this.cdr.detectChanges(); } 
      });
    } else {
      this.isLoading = false;
    }
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return 'https://placehold.co/120x120/1e1e1e/666?text=BBZ';
    if (url.startsWith('http')) return url;
    return `${environment.serverUrl}${url}`;
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    this.cartService.updateQuantity(item.id!, newQty).subscribe();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id!).subscribe();
  }

  checkout(): void {
    alert(' ¡Pedido realizado con éxito! (Feature en desarrollo)');
  }
}
