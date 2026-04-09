import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = false;
  isEditMode = false;
  productId: number | null = null;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;

  private cdr = inject(ChangeDetectorRef);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', Validators.required],
    category_id: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    short_description: ['', Validators.maxLength(300)],
    description: [''],
    image_url: [''],
    featured: [false]
  });

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.isEditMode = true;
        this.productId = parseInt(idStr, 10);
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Rellenar formulario con los datos existentes
        this.productForm.patchValue({
          name: product.name,
          brand: product.brand,
          category_id: product.category_id,
          price: product.price,
          stock: product.stock,
          short_description: product.short_description,
          description: product.description,
          featured: product.featured
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el producto para editar';
        this.cdr.detectChanges();
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    const formValues = this.productForm.value;
    
    // Adjuntar todos los valores de texto excepto image_url, la foto se maneja directo
    Object.keys(formValues).forEach(key => {
      if (key !== 'image_url') {
        const value = formValues[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    // Adjuntar el archivo físico si se seleccionó uno
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          this.successMessage = ' Producto actualizado exitosamente';
          this.isLoading = false;
          this.cdr.detectChanges();
          // No reiniciamos el formulario ni redireccionamos como pidió el usuario
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 5000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || ' Error al actualizar el producto';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.successMessage = ' Producto creado exitosamente';
          this.productForm.reset({ featured: false });
          this.selectedFile = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 5000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || ' Error al crear el producto';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
