-- Datos iniciales para desarrollo
INSERT INTO users (username, email, password, first_name, last_name, role, is_frequent_customer, created_at) VALUES
('admin', 'admin@ecommerce.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxdYshRrjw/Gq/y', 'Admin', 'User', 'ADMIN', false, NOW()),
('customer1', 'customer1@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxdYshRrjw/Gq/y', 'Juan', 'Pérez', 'CUSTOMER', true, NOW()),
('customer2', 'customer2@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lbdxdYshRrjw/Gq/y', 'María', 'García', 'CUSTOMER', false, NOW());

INSERT INTO products (name, description, price, category, stock, is_active, created_at) VALUES
('iPhone 15', 'Latest iPhone model', 999.99, 'Electronics', 50, true, NOW()),
('MacBook Pro', 'Professional laptop', 2499.99, 'Electronics', 20, true, NOW()),
('AirPods Pro', 'Wireless earbuds', 249.99, 'Electronics', 100, true, NOW()),
('Smart TV 55"', 'Ultra HD Smart TV', 799.99, 'Electronics', 15, true, NOW()),
('Gaming Chair', 'Ergonomic gaming chair', 299.99, 'Home', 30, true, NOW());

INSERT INTO discount_configs (time_discount_percentage, random_discount_percentage, start_date, end_date, is_active, created_at) VALUES
(10.0, 50.0, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true, NOW());