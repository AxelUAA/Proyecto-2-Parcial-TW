-- =============================================
-- BackpackBoyz - Seed Data
-- Datos de ejemplo para la tienda
-- =============================================

USE backpackboyz;

-- Categorías
INSERT INTO categories (name, description, image_url) VALUES
('Hoodies', 'Sudaderas y hoodies oversized para el streetwear diario', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
('Playeras', 'Tees gráficas y minimalistas de algodón premium', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
('Sneakers', 'Tenis urbanos y de edición limitada', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400'),
('Accesorios', 'Gorras, mochilas, cadenas y más', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Pants', 'Joggers, cargos y jeans streetwear', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400');

-- Productos

-- Hoodies (category_id = 1)
INSERT INTO products (name, short_description, description, price, image_url, category_id, brand, stock, featured) VALUES
('Hoodie Oversized Black', 'Hoodie negro oversized con logo bordado', 'Hoodie oversized en algodón premium 380gsm con logo BackpackBoyz bordado en el pecho. Capucha doble forrada, bolsillo canguro y puños acanalados. El fit oversized perfecto para el día a día.', 1299.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 1, 'BackpackBoyz', 25, true),
('Sudadera Logo Red', 'Sudadera crew neck con logo estampado en rojo', 'Sudadera crew neck con el logo BackpackBoyz estampado en rojo vibrante. Tela fleece de alta calidad 320gsm, cuello redondo reforzado y costuras dobles.', 1099.00, 'https://images.unsplash.com/photo-1578768079470-0a4c68a4e9e1?w=400', 1, 'BackpackBoyz', 15, true),
('Hoodie Camo Street', 'Hoodie con patrón camuflaje urbano', 'Hoodie con patrón de camuflaje urbano en tonos grises y negros. Cordones metálicos, etiqueta tejida en la manga y bolsillo interior oculto.', 1499.00, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', 1, 'BackpackBoyz', 10, false),

-- Playeras (category_id = 2)
('Tee Graphic Skull', 'Playera con gráfico de calavera streetwear', 'Playera de algodón 100% con gráfico de calavera estilo streetwear estampado en serigrafía. Corte regular, cuello redondo reforzado, tela 180gsm.', 599.00, 'https://images.unsplash.com/photo-1503341504253-dff4f94032e1?w=400', 2, 'BackpackBoyz', 40, true),
('Tee Minimal Logo', 'Playera básica con logo minimalista bordado', 'Playera básica premium con logo minimalista bordado en el pecho izquierdo. Algodón peinado 200gsm, cuello con ribete.', 499.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 2, 'BackpackBoyz', 50, false),
('Tee Oversized White', 'Playera oversized blanca de algodón pesado', 'Playera oversized en algodón pesado 240gsm. Corte drop shoulder, cuello reforzado con ribete, bajo curvo.', 549.00, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', 2, 'BackpackBoyz', 30, false),

-- Sneakers (category_id = 3)
('Air Street Black/Red', 'Tenis urbanos negro con detalles en rojo', 'Tenis de perfil medio con suela chunky de 4cm. Upper en cuero sintético negro con acentos rojos, logo lateral en relieve y plantilla de memory foam.', 2499.00, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400', 3, 'BackpackBoyz', 12, true),
('Urban Runner White', 'Tenis runner blancos minimalistas', 'Tenis estilo runner con suela de EVA ultra ligera. Diseño limpio en blanco total con detalles reflectivos en el talón.', 1999.00, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', 3, 'BackpackBoyz', 8, true),
('High Top Classic', 'Tenis bota clásicos en canvas negro', 'Tenis estilo high-top en canvas negro premium. Suela vulcanizada, ojales metálicos negros, etiqueta de goma en el talón.', 1799.00, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400', 3, 'BackpackBoyz', 0, false),

-- Accesorios (category_id = 4)
('Backpack Urban', 'Mochila urbana resistente al agua 25L', 'Mochila de 25L con material Cordura resistente al agua. Compartimento acolchado para laptop 15", bolsillos ocultos anti-robo, correas acolchadas.', 1899.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 4, 'BackpackBoyz', 20, true),
('Gorra Snapback', 'Gorra snapback con logo bordado 3D', 'Gorra snapback con logo BackpackBoyz bordado en 3D al frente. Panel estructurado, visera plana, ajuste snap trasero.', 449.00, 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400', 4, 'BackpackBoyz', 35, false),
('Cadena Silver Chain', 'Cadena cubana plateada de acero inoxidable', 'Cadena de eslabones cubanos en acero inoxidable 316L con baño de plata. 60cm de largo, 8mm de ancho, cierre de langosta.', 799.00, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 4, 'BackpackBoyz', 18, false),

-- Pants (category_id = 5)
('Cargo Jogger Black', 'Jogger cargo negro con 6 bolsillos funcionales', 'Jogger cargo con 6 bolsillos funcionales con solapa. Tela ripstop resistente, cintura elástica con cordón, puños con elástico ajustado.', 1199.00, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', 5, 'BackpackBoyz', 22, true),
('Track Pants Red Stripe', 'Pants deportivos con franja roja lateral', 'Track pants en poliéster premium con franja roja lateral icónica. Cintura elástica, bolsillos laterales con zipper, bajo con snap buttons.', 999.00, 'https://images.unsplash.com/photo-1580906853149-f48a8e1e2d6f?w=400', 5, 'BackpackBoyz', 15, false),
('Jeans Relaxed Fit', 'Jeans corte relajado en denim negro lavado', 'Jeans straight-relaxed en denim negro lavado premium. Parche de cuero con logo en la cintura, costuras contrastantes en rojo, botón metálico grabado.', 1399.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 5, 'BackpackBoyz', 12, false);
