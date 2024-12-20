# โครงการ Shopping Order API
API นี้ใช้สำหรับจัดการระบบสั่งซื้อสินค้าและข้อมูลผู้ใช้ โดยใช้ Elysia เป็นเฟรมเวิร์กหลัก 
และเชื่อมต่อกับฐานข้อมูล **PostgreSQL**  **bcrypt** สำหรับการเข้ารหัสรหัสผ่าน, และ **CORS** เพื่ออนุญาตให้เชื่อมต่อจากแหล่งอื่น ๆ
## คุณสมบัติของโปรเจค

- **สร้างบัญชีผู้ใช้ใหม่** พร้อมตรวจสอบชื่อผู้ใช้ซ้ำ
- **เข้าสู่ระบบ** เพื่อเข้าใช้งานระบบ
- **เรียกดูสินค้า** ทั้งหมดหรือค้นหาตามคำที่ต้องการ
- **จัดการสินค้าตะกร้า** เช่น เพิ่มสินค้าในตะกร้า ปรับจำนวน หรือลบสินค้า
- **เชื่อมต่อกับ API ภายนอก** เพื่อนำเข้าข้อมูลสินค้า

### ข้อกำหนด
- bun 
- PostgreSQL

### การติดตั้ง

1. ติดตั้ง dependencies:

    bun install
2. ตั้งค่า PostgreSQL Database:

    สร้างฐานข้อมูลชื่อ `shipping_order` และกำหนดการตั้งค่าดังนี้:

    ```javascript
    const client = new Client({
        host: '3.0.50.174',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'shipping_order'
    });
    ```

3. รันเซิร์ฟเวอร์:
    ```bash
    bun index.js
    ```
4. เซิร์ฟเวอร์จะพร้อมใช้งานที่ [http://3.0.50.174:4000]

## เส้นทาง API

### 1. ทดสอบ API
- **GET /**
  - **รายละเอียด**: ทดสอบการทำงานของ API
  - **การตอบกลับ**: `{ message: "API is running" }`

### 2. สร้างบัญชีผู้ใช้
- **POST /register**
  - **รายละเอียด**: ลงทะเบียนบัญชีใหม่และตรวจสอบชื่อผู้ใช้ซ้ำ
  - **พารามิเตอร์**:
    - `username` - ชื่อผู้ใช้
    - `password` - รหัสผ่าน
  - **การตอบกลับ**: 
    - สำเร็จ: `{ message: "Account created successfully" }`
    - ชื่อผู้ใช้ซ้ำ: `{ error: "Username already exists" }`

### 3. เข้าสู่ระบบ
- **POST /login**
  - **รายละเอียด**: ยืนยันตัวตนของผู้ใช้ด้วยชื่อผู้ใช้และรหัสผ่าน
  - **พารามิเตอร์**:
    - `username` - ชื่อผู้ใช้
    - `password` - รหัสผ่าน
  - **การตอบกลับ**:
    - สำเร็จ: `{ message: "Logged in successfully", token, userId }`
    - ไม่สำเร็จ: `{ error: "Invalid username or password" }`

### 4. เรียกดูสินค้า
- **GET /products**
  - **รายละเอียด**: เรียกดูสินค้าทั้งหมดในระบบ
  - **การตอบกลับ**: รายการสินค้าทั้งหมด

- **GET /products/:id**
  - **รายละเอียด**: เรียกดูสินค้าด้วย ID
  - **พารามิเตอร์**: 
    - `id` - รหัสสินค้า
  - **การตอบกลับ**: ข้อมูลของสินค้าที่ตรงกับ ID

### 5. ค้นหาสินค้า
- **GET /products/search**
  - **รายละเอียด**: ค้นหาสินค้าโดยใช้คำค้น
  - **พารามิเตอร์**: 
    - `product` - คำค้น (หรือใช้ `GetAllData` เพื่อเรียกดูข้อมูลทั้งหมด)
  - **การตอบกลับ**: รายการสินค้าที่ตรงกับคำค้น

### 6. จัดการตะกร้าสินค้า
- **POST /cart**
  - **รายละเอียด**: เพิ่มสินค้าในตะกร้า หรือเพิ่มจำนวนสินค้าที่มีอยู่แล้ว
  - **พารามิเตอร์**:
    - `userId` - รหัสผู้ใช้
    - `productId` - รหัสสินค้า
    - `quantity` - จำนวน
  - **การตอบกลับ**: `{ message: "Product added to cart" }` หรือ `{ message: "Cart updated successfully" }`

- **DELETE /cart**
  - **รายละเอียด**: ลบสินค้าจากตะกร้า
  - **พารามิเตอร์**:
    - `userId` - รหัสผู้ใช้
    - `productId` - รหัสสินค้า
  - **การตอบกลับ**: `{ message: "Product removed from cart" }`

- **GET /cart/:userId**
  - **รายละเอียด**: เรียกดูสินค้าทั้งหมดในตะกร้าพร้อมคำนวณราคารวม
  - **พารามิเตอร์**: 
    - `userId` - รหัสผู้ใช้
  - **การตอบกลับ**: รายการสินค้าในตะกร้าพร้อมราคารวมทั้งหมด

## การตั้งค่าการยืนยันตัวตนด้วย JWT

API นี้ใช้ JWT เพื่อยืนยันตัวตนผู้ใช้ โดยมี secret key ที่ตั้งไว้ดังนี้:

## ข้อมูลเพิ่มเติม

- **ฐานข้อมูล**: ฐานข้อมูล PostgreSQL ต้องมีตาราง `customers`, `products`, `cart`, `product_tags`, `product_images`, และ `reviews` ตามโครงสร้างที่ใช้ในโค้ด
รันบน EC2 ด้วย
sudo docker run --name my-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=shipping_order -p 5432:5432 -d postgres:latest
- **API ภายนอก**: ระบบนี้สามารถดึงข้อมูลสินค้าจาก `https://dummyjson.com/products` และบันทึกในฐานข้อมูล