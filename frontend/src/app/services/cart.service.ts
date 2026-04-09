import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().reduce((sum, i) => sum + i.quantity, 0));
  cartTotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
  );

  constructor(private http: HttpClient) {}

  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(
      tap(items => this.cartItems.set(items))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl, { product_id: productId, quantity }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
