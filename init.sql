-- Table for Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    rating DECIMAL(3, 2),
    stock INT,
    brand VARCHAR(100),
    sku VARCHAR(50),
    weight DECIMAL(5, 2),
    width DECIMAL(5, 2),
    height DECIMAL(5, 2),
    depth DECIMAL(5, 2),
    warranty_information VARCHAR(255),
    shipping_information VARCHAR(255),
    availability_status VARCHAR(50),
    return_policy VARCHAR(255),
    minimum_order_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    barcode VARCHAR(50),
    qr_code VARCHAR(255),
    thumbnail VARCHAR(255)
);

-- Table for Tags associated with Products (many-to-many relationship)
CREATE TABLE product_tags (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    tag VARCHAR(100)
);

-- Table for Reviews (one-to-many relationship with Products)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    rating INT,
    comment TEXT,
    review_date TIMESTAMP,
    reviewer_name VARCHAR(100),
    reviewer_email VARCHAR(100)
);

-- Table for Product Images (one-to-many relationship with Products)
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255)
);

-- Table for Meta information (one-to-one relationship with Products)
CREATE TABLE product_meta (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    barcode VARCHAR(50),
    qr_code VARCHAR(255)
);
CREATE TABLE se_66130_customers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES se_66130_customers(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
