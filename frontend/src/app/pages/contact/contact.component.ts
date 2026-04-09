import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private contactService = inject(ContactService);

  // Modelo de formulario basado en plantillas (template-driven)
  contact = { name: '', email: '', subject: '', message: '' };
  isLoading = false;

  // Signal para el mensaje de estado
  statusMessage = signal<string>('');
  isSuccess = signal<boolean>(false);

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.isLoading = true;
    this.statusMessage.set('');

    this.contactService.sendMessage(this.contact).subscribe({
      next: () => {
        this.isSuccess.set(true);
        this.statusMessage.set(' ¡Mensaje enviado! Te contactaremos pronto.');
        form.reset();
        this.isLoading = false;
        setTimeout(() => this.statusMessage.set(''), 5000);
      },
      error: (err) => {
        this.isSuccess.set(false);
        this.statusMessage.set(err.error?.message || ' Error al enviar el mensaje. Inténtalo de nuevo.');
        this.isLoading = false;
      }
    });
  }
}
