import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  menuOpen = false;
  showLogoutModal = false;

  get firstName() {
    return this.auth.currentUser()?.name?.split(' ')[0] || '';
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  
  logout() {
    this.showLogoutModal = true;
    this.closeMenu();
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.auth.logout();
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
