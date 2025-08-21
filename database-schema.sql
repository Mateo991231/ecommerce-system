-- Database schema for E-commerce System
-- Database ecommerce_db is created automatically by docker-compose

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    is_frequent_customer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    total_amount DECIMAL(12,2) NOT NULL,
    discount_applied DECIMAL(12,2) DEFAULT 0,
    discount_type VARCHAR(20),
    order_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    product_name VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL
);

-- Discount configuration table
CREATE TABLE discount_config (
    id BIGSERIAL PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    time_discount_percentage DECIMAL(5,2) DEFAULT 10.00,
    random_discount_percentage DECIMAL(5,2) DEFAULT 50.00,
    frequent_customer_discount_percentage DECIMAL(5,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE
);

-- Audit logs table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id BIGINT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values TEXT,
    new_values TEXT
);

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_name, entity_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role) 
VALUES ('admin', 'admin@ecommerce.com', 'admin123', 'Admin', 'User', 'ADMIN');

-- Insert sample users
INSERT INTO users (username, email, password, first_name, last_name, role, is_frequent_customer) VALUES
('juan.perez', 'juan.perez@email.com', 'password123', 'Juan', 'Pérez', 'CUSTOMER', false),
('maria.garcia', 'maria.garcia@email.com', 'password123', 'María', 'García', 'CUSTOMER', true),
('carlos.lopez', 'carlos.lopez@email.com', 'password123', 'Carlos', 'López', 'CUSTOMER', false),
('ana.martinez', 'ana.martinez@email.com', 'password123', 'Ana', 'Martínez', 'CUSTOMER', true),
('luis.rodriguez', 'luis.rodriguez@email.com', 'password123', 'Luis', 'Rodríguez', 'CUSTOMER', false),
('sofia.hernandez', 'sofia.hernandez@email.com', 'password123', 'Sofía', 'Hernández', 'CUSTOMER', false),
('diego.morales', 'diego.morales@email.com', 'password123', 'Diego', 'Morales', 'CUSTOMER', true);

-- Insert sample products
INSERT INTO products (name, description, price, category, stock) VALUES
('Laptop HP', 'High performance laptop', 1200.00, 'Electronics', 10),
('iPhone 15', 'Latest Apple smartphone', 999.99, 'Electronics', 15),
('Coffee Mug', 'Ceramic coffee mug', 12.99, 'Home', 50),
('Running Shoes', 'Comfortable running shoes', 89.99, 'Sports', 25),
('Wireless Headphones', 'Bluetooth wireless headphones', 149.99, 'Electronics', 30),
('MacBook Pro 16', 'Apple laptop with M2 chip', 2499.99, 'Electronics', 8),
('Samsung Galaxy S24', 'Latest Samsung smartphone', 899.99, 'Electronics', 20),
('Sony WH-1000XM5', 'Noise cancelling headphones', 399.99, 'Electronics', 15),
('iPad Air', 'Apple tablet 10.9 inch', 599.99, 'Electronics', 12),
('Nintendo Switch', 'Gaming console', 299.99, 'Electronics', 25),
('Dell Monitor 27', '4K UHD monitor', 349.99, 'Electronics', 18),
('Logitech MX Master 3', 'Wireless mouse', 99.99, 'Electronics', 30),
('Mechanical Keyboard', 'RGB gaming keyboard', 149.99, 'Electronics', 22),
('Canon EOS R6', 'Mirrorless camera', 2399.99, 'Electronics', 5),
('GoPro Hero 12', 'Action camera', 399.99, 'Electronics', 14),
('Adidas Ultraboost 22', 'Running shoes', 180.00, 'Sports', 35),
('Nike Air Max 270', 'Casual sneakers', 150.00, 'Sports', 40),
('Wilson Tennis Racket', 'Professional tennis racket', 120.00, 'Sports', 16),
('Spalding Basketball', 'Official size basketball', 29.99, 'Sports', 50),
('Yoga Mat Premium', 'Non-slip exercise mat', 45.99, 'Sports', 25),
('Dumbbells Set 20kg', 'Adjustable weight set', 89.99, 'Sports', 12),
('Bicycle Helmet', 'Safety cycling helmet', 59.99, 'Sports', 28),
('Soccer Ball FIFA', 'Official match ball', 39.99, 'Sports', 45),
('IKEA Sofa 3-Seater', 'Comfortable living room sofa', 599.99, 'Home', 8),
('Dining Table Oak', 'Solid wood dining table', 449.99, 'Home', 6),
('LED Desk Lamp', 'Adjustable brightness lamp', 79.99, 'Home', 20),
('Kitchen Blender', 'High-speed blender', 129.99, 'Home', 15),
('Vacuum Cleaner Robot', 'Smart cleaning robot', 299.99, 'Home', 10),
('Air Purifier HEPA', 'Room air purifier', 199.99, 'Home', 12),
('Ceramic Dinner Set', '16-piece dinnerware set', 89.99, 'Home', 18),
('Throw Pillow Set', 'Decorative cushions 4-pack', 49.99, 'Home', 30),
('Essential Oil Diffuser', 'Aromatherapy diffuser', 69.99, 'Home', 22),
('Wall Clock Modern', 'Minimalist wall clock', 34.99, 'Home', 25);

-- Insert default discount configuration
INSERT INTO discount_config (start_date, end_date, is_active) 
VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', TRUE);