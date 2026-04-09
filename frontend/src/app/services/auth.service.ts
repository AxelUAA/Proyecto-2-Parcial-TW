import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/user.model';
import { environment } from '../environment';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'bbz_token';
  private userKey = 'bbz_user';

  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!this.getToken());
  isAdmin = signal<boolean>(this.getStoredUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router, private cartService: CartService) {}

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  updateProfile(payload: any): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout(): void {
    this.cartService.clearCart();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.isLoggedIn.set(true);
    this.isAdmin.set(res.user.role === 'admin');
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }
}
