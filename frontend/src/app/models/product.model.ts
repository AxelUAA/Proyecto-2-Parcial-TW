export interface Product {
  id?: number;
  name: string;
  short_description?: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: number;
  category_name?: string;
  brand?: string;
  stock: number;
  featured?: boolean;
  created_at?: string;
}
