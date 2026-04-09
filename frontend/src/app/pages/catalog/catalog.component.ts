import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  cartMessage = '';

  activeFilter = signal<string>('all');

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;

        // Soporte para query param ?category=
        this.route.queryParams.subscribe(params => {
          const cat = params['category'];
          if (cat) {
            this.activeFilter.set(cat);
            this.applyFilter(cat);
          } else {
            // CORRECCIÓN: Volver a poner activeFilter en 'all' para que el botón de la interfaz coincida
            this.activeFilter.set('all');
            // CORRECCIÓN: Crear una nueva referencia de array para que Angular fuerce un redibujado
            this.filteredProducts = [...this.allProducts];
          }
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(cat: string): void {
    this.activeFilter.set(cat);
    this.applyFilter(cat);
  }

  private applyFilter(cat: string): void {
    if (cat === 'all') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(p =>
        p.category_name?.toLowerCase() === cat.toLowerCase()
      );
    }
  }

  onAddToCart(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.cartMessage = ' Inicia sesión para agregar al carrito';
      setTimeout(() => this.cartMessage = '', 3000);
      return;
    }
    this.cartService.addToCart(product.id!).subscribe({
      next: () => {
        this.cartMessage = ` "${product.name}" agregado al carrito`;
        setTimeout(() => this.cartMessage = '', 3000);
      }
    });
  }
}
