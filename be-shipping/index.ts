import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors'

import axios from 'axios';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import cookie from 'cookie-parser';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

// Initialize and connect to the PostgreSQL database
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

await client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Connection error', err.stack));
// Initialize Elysia app
const app = new Elysia().use(cors());
const JWT_SECRET = 'shipping_order';

// Route for creating a new account with duplicate username checking
app.post('/register', async ({ body }) => {
    const { username, password } = body;
    try {
        // ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่
        const existingUser = await client.query(
            'SELECT * FROM se_66130_customers WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return {
                status: 409,
                body: { error: 'Username already exists. Please choose a different username.' },
            };
        }

        // เข้ารหัสรหัสผ่าน
        const passwordHash = await bcrypt.hash(password, 10);

        // เพิ่มข้อมูลผู้ใช้ใหม่ในฐานข้อมูล
        const result = await client.query(
            'INSERT INTO se_66130_customers (username, password_hash) VALUES ($1, $2) RETURNING id',
            [username, passwordHash]
        );

        return {
            status: 201,
            body: { message: 'Account created successfully' },
        };

    } catch (error) {
        console.error('Error creating account:', error);
        return {
            status: 500,
            body: { error: 'Account creation failed.' },
        };
    }
});

app.post('/login', async ({ body }) => {
    const { username, password } = body;

    try {
        // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
        const result = await client.query('SELECT * FROM se_66130_customers WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return {
                status: 401,
                body: { error: 'Invalid username or password' },
            };
        }

        // ตรวจสอบความถูกต้องของรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return {
                status: 401,
                body: { error: 'Invalid username or password' },
            };
        }

        // สร้าง JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        return {
            status: 200,
            body: { message: 'Logged in successfully', token, userId: user.id },
        };
    } catch (error) {
        console.error('Error logging in:', error);
        return {
            status: 500,
            body: { error: 'Login failed' },
        };
    }
});




app.get('/products', async () => {
    try {
        const result = await client.query('SELECT * FROM public.products');
        return result.rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { error: 'Could not fetch products' };
    }
});

// Fetch a single product by ID with token verification
app.get('/products/:id', async ({ params, req }) => {
    // if (req.error) return req.error; // Return error if token verification failed

    try {
        const result = await client.query('SELECT * FROM se_66130_products WHERE id = $1', [params.id]);
        if (result.rows.length === 0) {
            return { error: 'Product not found' };
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching product:', error);
        return { error: 'Could not fetch product' };
    }
});

const authenticate = async ({ req }) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return { error: 'No token provided' };

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach the decoded user ID to the request
        return true;
    } catch (error) {
        return { error: 'Invalid token' };
    }
};
app.get('/products/search', async ({ query }) => {
    const searchTerm = query.product;
    if (!searchTerm) {
        return { error: 'Please provide a search term' };
    } else if (searchTerm === "GetAllData") {
        // Return all data if the search term is "GetAllData"
        try {
            const result = await client.query('SELECT id, title, description,  price, thumbnail  FROM public.se_66130_products');
            return result.rows;
        } catch (error) {
            console.error('Error fetching all products:', error);
            return { error: 'Could not fetch all products' };
        }
    } else {
        // Search based on the search term
        try {
            const result = await client.query(
                `SELECT id, title, description,  price, thumbnail 
                 FROM public.se_66130_products 
                 WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1`,
                [`%${searchTerm}%`]
            );
            return result.rows;
        } catch (error) {
            console.error('Error searching products:', error);
            return { error: 'Could not search products' };
        }
    }
});



//cart

app.post('/cart', async ({ body }) => {
    const { userId, productId, quantity } = body;
    try {
        // Check if the product already exists in the user's cart
        const existingCartItem = await client.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (existingCartItem.rows.length > 0) {
            // Update quantity if item is already in cart
            const newQuantity = existingCartItem.rows[0].quantity + quantity;
            await client.query(
                'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
                [newQuantity, userId, productId]
            );
            return { message: 'Cart updated successfully', productId, newQuantity };
        } else {
            // Add new item to cart if it does not exist
            await client.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, productId, quantity]
            );
            return { message: 'Product added to cart', productId, quantity };
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return { error: 'Could not add product to cart' };
    }
});


app.delete('/cart', async ({ body }) => {
    const { userId, productId } = body;

    try {
        // ตรวจสอบว่าผลิตภัณฑ์มีอยู่ในตะกร้าหรือไม่
        const result = await client.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (result.rows.length === 0) {
            return {
                status: 404,
                body: { error: 'Product not found in cart' },
            };
        }

        // ลบสินค้าจากตะกร้า
        await client.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        return {
            status: 200,
            body: { message: 'Product removed from cart', productId },
        };
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return {
            status: 500,
            body: { error: 'Could not remove product from cart' },
        };
    }
});


app.get('/cart/:userId', async ({ params }) => {
    const userId = params.userId;

    try {
        // Fetch cart items with calculated total price for each item and overall total
        const result = await client.query(
            `SELECT 
                c.id, 
                p.id AS product_id, 
                p.title, 
                p.description, 
                p.price, 
                p.discount_percentage,
                c.quantity, 
                p.thumbnail,
                (p.price * c.quantity) AS total_price_per_product
             FROM cart c
             JOIN se_66130_products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
            [userId]
        );

        // Calculate the overall total price for all products in the cart
        const items = result.rows;
        const overallTotalPrice = items.reduce((sum, item) => sum + parseFloat(item.total_price_per_product), 0);

        return { items, overallTotalPrice };
    } catch (error) {
        console.error('Error fetching cart:', error);
        return { error: 'Could not fetch cart' };
    }
});



sync function fetchAndStoreProducts() {
    try {
        const response = await axios.get('https://dummyjson.com/products');
        const products = response.data.products;

        for (const product of products) {
            const result = await client.query(
                `INSERT INTO products 
                (title, description, category, price, discount_percentage, rating, stock, brand, sku, weight, width, height, depth, warranty_information, shipping_information, availability_status, return_policy, minimum_order_quantity, created_at, updated_at, barcode, qr_code, thumbnail) 
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING id`,
                [
                    product.title,
                    product.description,
                    product.category,
                    product.price,
                    product.discountPercentage,
                    product.rating,
                    product.stock,
                    product.brand,
                    product.sku,
                    product.weight,
                    product.dimensions.width,
                    product.dimensions.height,
                    product.dimensions.depth,
                    product.warrantyInformation,
                    product.shippingInformation,
                    product.availabilityStatus,
                    product.returnPolicy,
                    product.minimumOrderQuantity,
                    product.meta.createdAt,
                    product.meta.updatedAt,
                    product.meta.barcode,
                    product.meta.qrCode,
                    product.thumbnail
                ]
            );

            const productId = result.rows[0].id;

            for (const tag of product.tags) {
                await client.query('INSERT INTO product_tags (product_id, tag) VALUES ($1, $2)', [productId, tag]);
            }

            for (const imageUrl of product.images) {
                await client.query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [productId, imageUrl]);
            }

            for (const review of product.reviews) {
                await client.query(
                    `INSERT INTO reviews 
                    (product_id, rating, comment, review_date, reviewer_name, reviewer_email) 
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [productId, review.rating, review.comment, review.date, review.reviewerName, review.reviewerEmail]
                );
            }

            console.log(`Product ${product.title} inserted successfully.`);
        }

        return { message: 'Products inserted successfully' };
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
        throw error;
    }
}

// สร้าง API Endpoint สำหรับ POST
app.post('/fetch-and-store-products', async (req, res) => {
    try {
        const result = await fetchAndStoreProducts();
        res.status(200).json(result);  // ส่ง response กลับในกรณีสำเร็จ
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch and store products' });  // ส่ง error response ถ้ามีข้อผิดพลาด
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Server is running on http://3.0.50.174:4000');
});
