export interface CartItem {
  id?: number;
  user_id?: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  // Campos que vienen directamente del JOIN en el backend
  name?: string;
  price?: number;
  image_url?: string;
  stock?: number;
  brand?: string;
}
