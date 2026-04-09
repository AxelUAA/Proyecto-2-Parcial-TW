import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: ['', [Validators.minLength(6)]]
  });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  get userRole() {
    return this.auth.currentUser()?.role === 'admin' ? 'Administrador' : 'Cliente';
  }

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.profileForm.value;
    
    // Si no quiere cambiar la contraseña, limpiamos esos campos para no enviarlos vacíos
    if (!payload.newPassword) {
      delete payload.currentPassword;
      delete payload.newPassword;
    }

    this.auth.updateProfile(payload).subscribe({
      next: (res) => {
        this.successMessage = '¡Tus datos han sido actualizados!';
        // Limpiamos los campos de contraseñas por seguridad
        this.profileForm.patchValue({ currentPassword: '', newPassword: '' });
        
        // Desmarcamos los errores
        this.profileForm.markAsUntouched();
        this.profileForm.markAsPristine();

        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Hubo un problema actualizando el perfil';
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.errorMessage = ''; this.cdr.detectChanges(); }, 5000);
      }
    });
  }
}
