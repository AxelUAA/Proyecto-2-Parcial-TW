import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  name = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Por favor llena todos los campos';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => { 
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al crear la cuenta';
        this.cdr.detectChanges();
      }
    });
  }
}
