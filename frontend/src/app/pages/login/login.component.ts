import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor llena todos los campos';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => { 
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Credenciales incorrectas';
        this.cdr.detectChanges();
      }
    });
  }
}
