/*
  # Insert Initial Data

  1. Categories
    - Insert default product categories
  
  2. Suppliers
    - Insert sample suppliers
  
  3. Products
    - Insert sample products with proper relationships
*/

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Flores Frescas', 'Flores recién cortadas para arreglos y ramos'),
  ('Plantas de Interior', 'Plantas decorativas para espacios interiores'),
  ('Plantas de Exterior', 'Plantas resistentes para jardines y exteriores'),
  ('Arreglos Florales', 'Composiciones florales para ocasiones especiales'),
  ('Accesorios', 'Complementos para arreglos y cuidado de plantas')
ON CONFLICT (name) DO NOTHING;

-- Insert suppliers
INSERT INTO suppliers (name, contact_name, email, phone, address, rating, notes) VALUES
  ('Jardines del Valle S.A.C.', 'María Sánchez', 'contacto@jardinesvalle.com.pe', '(+51) 1 234 5678', 'Av. La Marina 1234, San Miguel, Lima', 4.8, 'Excelente proveedor de flores exóticas. Entrega puntual.'),
  ('Viveros Santa Rosa', 'José Martínez', 'pedidos@viverossantarosa.com.pe', '(+51) 1 567 8901', 'Jr. Los Jardines 456, La Molina, Lima', 4.5, 'Especialistas en plantas de interior y exterior.'),
  ('Flores del Perú', 'Ana Pérez', 'info@floresdelperu.com.pe', '(+51) 1 678 1234', 'Av. Primavera 789, Surco, Lima', 4.3, 'Gran variedad de flores nacionales e importadas.'),
  ('Distribuidora Floral Lima', 'Javier López', 'ventas@distflorallima.com.pe', '(+51) 1 789 2345', 'Jr. Las Orquídeas 123, Miraflores, Lima', 4.0, 'Buenos precios en flores de temporada.')
ON CONFLICT (email) DO NOTHING;

-- Insert products (using subqueries to get category and supplier IDs)
INSERT INTO products (name, code, category_id, supplier_id, purchase_price, sale_price, stock, min_stock_level, image_url) VALUES
  (
    'Rosa Roja Premium', 
    'RR-001', 
    (SELECT id FROM categories WHERE name = 'Flores Frescas' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Jardines del Valle S.A.C.' LIMIT 1),
    4.50, 9.90, 150, 50,
    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg'
  ),
  (
    'Orquídea Phalaenopsis', 
    'OP-002', 
    (SELECT id FROM categories WHERE name = 'Plantas de Interior' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Viveros Santa Rosa' LIMIT 1),
    45.00, 89.90, 35, 10,
    'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg'
  ),
  (
    'Tulipán Holandés', 
    'TH-003', 
    (SELECT id FROM categories WHERE name = 'Flores Frescas' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Flores del Perú' LIMIT 1),
    3.50, 7.90, 200, 75,
    'https://images.pexels.com/photos/36729/tulip-flower-bloom-pink.jpg'
  ),
  (
    'Bonsái Ficus', 
    'BF-004', 
    (SELECT id FROM categories WHERE name = 'Plantas de Interior' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Viveros Santa Rosa' LIMIT 1),
    89.90, 179.90, 15, 5,
    'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg'
  ),
  (
    'Girasol Grande', 
    'GG-005', 
    (SELECT id FROM categories WHERE name = 'Flores Frescas' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Distribuidora Floral Lima' LIMIT 1),
    5.90, 12.90, 80, 30,
    'https://images.pexels.com/photos/33109/sunflower-blossom-bloom-yellow.jpg'
  ),
  (
    'Jazmín Estrella', 
    'JE-006', 
    (SELECT id FROM categories WHERE name = 'Plantas de Exterior' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Viveros Santa Rosa' LIMIT 1),
    29.90, 59.90, 25, 10,
    'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg'
  ),
  (
    'Ramo de Novia Clásico', 
    'RN-007', 
    (SELECT id FROM categories WHERE name = 'Arreglos Florales' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Jardines del Valle S.A.C.' LIMIT 1),
    149.90, 299.90, 8, 3,
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg'
  ),
  (
    'Maceta Decorativa', 
    'MD-008', 
    (SELECT id FROM categories WHERE name = 'Accesorios' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Distribuidora Floral Lima' LIMIT 1),
    19.90, 39.90, 40, 15,
    'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg'
  ),
  (
    'Suculenta Variada', 
    'SV-009', 
    (SELECT id FROM categories WHERE name = 'Plantas de Interior' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Viveros Santa Rosa' LIMIT 1),
    14.90, 29.90, 60, 20,
    'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg'
  ),
  (
    'Fertilizante Universal', 
    'FU-010', 
    (SELECT id FROM categories WHERE name = 'Accesorios' LIMIT 1),
    (SELECT id FROM suppliers WHERE name = 'Distribuidora Floral Lima' LIMIT 1),
    15.90, 34.90, 5, 20,
    'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg'
  )
ON CONFLICT (code) DO NOTHING;