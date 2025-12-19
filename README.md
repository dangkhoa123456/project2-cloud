# 💰 Quản lý Chi tiêu (Expense Tracker)

Ứng dụng quản lý chi tiêu đơn giản với Backend PHP + Frontend HTML/JS.

## 📁 Cấu trúc Project

```
Project2MNM/
├── backend/
│   └── api.php              # API xử lý CRUD (GET, POST, PUT, DELETE)
├── frontend/
│   ├── index.html           # Giao diện người dùng
│   └── script.js            # Xử lý fetch API
├── database.sql             # Script tạo Database
└── README.md                # Tài liệu này
```

---

## 🗄️ Database

### Tạo Database & Bảng

**Cách 1: Dùng phpMyAdmin**
1. Mở http://localhost/phpmyadmin
2. Click **New** → Nhập `expense_tracker` → **Create**
3. Chọn database vừa tạo → Tab **SQL**
4. Copy toàn bộ nội dung file `database.sql` → **Execute**

**Cách 2: Dùng Command Line**
```bash
mysql -u root < C:\xampp\htdocs\Project2MNM\database.sql
```

**Cách 3: Tạo thủ công**
```sql
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cấu trúc Bảng `expenses`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| **id** | INT | ID tự tăng (khóa chính) |
| **description** | VARCHAR(255) | Nội dung chi tiêu |
| **amount** | INT | Số tiền (đơn vị đồng) |
| **created_at** | TIMESTAMP | Thời gian tạo |

---

## 🚀 Cách Chạy

### 1. Khởi động Server

- **Bước 1**: Mở XAMPP Control Panel
- **Bước 2**: Click **Start** cho Apache và MySQL
- **Bước 3**: Kiểm tra xanh ✅ cạnh tên service

### 2. Truy cập Ứng dụng

Mở trình duyệt → Nhập URL:
```
http://localhost/Project2MNM/index.html
```

---

## ✨ Chức Năng

### 1️⃣ **Thêm Chi tiêu**
- Nhập **Nội dung** (VD: "Ăn sáng")
- Nhập **Số tiền** (VD: "30000")
- Click nút **Lưu**
- Danh sách tự động cập nhật

### 2️⃣ **Xem Danh sách**
- Hiển thị tất cả chi tiêu (mới nhất lên trước)
- Hiển thị số tiền với định dạng Việt (30.000 đ)
- Cột **Hành động** để sửa/xóa

### 3️⃣ **Tìm Kiếm**
- Gõ từ khóa trong ô tìm kiếm
- Tìm kiếm **real-time** theo nội dung
- Click xóa ô tìm kiếm để hiển thị toàn bộ

### 4️⃣ **Chỉnh Sửa**
- Click nút **Sửa** trên hàng cần sửa
- Modal mở lên → Chỉnh sửa dữ liệu
- Click **Cập nhật** để lưu
- Click **Hủy** để đóng modal

### 5️⃣ **Xóa**
- Click nút **Xóa** trên hàng cần xóa
- Xác nhận xóa → Dữ liệu xóa khỏi database

---

## 🔌 API Documentation

### Base URL
```
http://localhost/Project2MNM/backend/api.php
```

### 1. GET - Lấy Danh sách

**Request**
```
GET /api.php
GET /api.php?q=ăn        # Tìm kiếm
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "Ăn sáng",
      "amount": 30000,
      "created_at": "2025-12-19 10:30:00"
    }
  ]
}
```

### 2. POST - Thêm Chi tiêu

**Request**
```
POST /api.php
Content-Type: application/json

{
  "description": "Đổ xăng",
  "amount": 150000
}
```

**Response**
```json
{
  "success": true,
  "message": "Expense added successfully"
}
```

### 3. PUT - Cập nhật Chi tiêu

**Request**
```
PUT /api.php
Content-Type: application/json

{
  "id": 1,
  "description": "Ăn trưa",
  "amount": 50000
}
```

**Response**
```json
{
  "success": true,
  "message": "Expense updated successfully"
}
```

### 4. DELETE - Xóa Chi tiêu

**Request**
```
DELETE /api.php?id=1
```

**Response**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

## ⚙️ Cấu hình

### Sửa Kết nối Database

Nếu cấu hình MySQL khác, mở [backend/api.php](backend/api.php) → Sửa dòng 13-16:

```php
$dbHost = 'localhost';      // Địa chỉ server
$dbUser = 'root';           // Tên user MySQL
$dbPassword = '';           // Mật khẩu (trống nếu không có)
$dbName = 'expense_tracker'; // Tên database
```

### CORS Settings

File `api.php` đã cấu hình CORS cho phép request từ mọi origin:
```php
header('Access-Control-Allow-Origin: *');
```

---

## 🛡️ Bảo mật

✅ **Implemented**
- PDO Prepared Statements (chống SQL Injection)
- CORS Headers xử lý
- Input validation
- JSON response

⚠️ **Lưu ý cho Production**
- Không nên dùng `Access-Control-Allow-Origin: *`
- Thêm Authentication (Login/Token)
- Validate dữ liệu nặng hơn
- Sử dụng HTTPS
- Rate limiting

---

## 🐛 Troubleshooting

### ❌ Lỗi: "Database connection failed"

**Giải pháp**:
1. Kiểm tra MySQL có chạy không (XAMPP Control Panel)
2. Kiểm tra tên database: `expense_tracker`
3. Kiểm tra username/password trong [api.php](backend/api.php)

### ❌ Lỗi: "CORS error" hoặc "No 'Access-Control-Allow-Origin' header"

**Giải pháp**:
- Kiểm tra [api.php](backend/api.php) có header CORS không
- Reload lại trang (Ctrl + Shift + R)

### ❌ Lỗi: "Fetch failed"

**Giải pháp**:
1. Kiểm tra URL API có đúng không:
   - Mở http://localhost/Project2MNM/backend/api.php
   - Phải thấy JSON response
2. Kiểm tra Apache có chạy không

### ❌ Dữ liệu không lưu được

**Giải pháp**:
1. Kiểm tra bảng `expenses` đã tạo chưa
2. Kiểm tra quyền MySQL
3. Mở Console (F12) xem lỗi chi tiết

---

## 📝 Ví dụ Sử dụng

### Thêm Chi tiêu
```javascript
fetch('http://localhost/Project2MNM/backend/api.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Ăn sáng',
    amount: 30000
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

### Tìm Kiếm
```javascript
fetch('http://localhost/Project2MNM/backend/api.php?q=ăn')
  .then(r => r.json())
  .then(d => console.log(d.data));
```

---

## 📊 Dữ liệu Mẫu

Khi chạy `database.sql`, bảng sẽ có 3 dòng mẫu:

| ID | Description | Amount |
|----|-------------|--------|
| 1 | Ăn sáng | 30000 |
| 2 | Đổ xăng | 150000 |
| 3 | Mua sách | 85000 |

---

## 🎨 Giao diện

- **Responsive**: Tương thích với mobile
- **Gradient Background**: Tím - xanh
- **Color Scheme**:
  - Nút Lưu: Xanh dương (`#667eea`)
  - Nút Sửa: Xanh nhạt (`#3498db`)
  - Nút Xóa: Đỏ (`#e74c3c`)
  - Số tiền: Đỏ đậm

---

## 📱 Tính năng Phụ

✅ Auto-load danh sách khi trang tải  
✅ Format tiền tệ kiểu Việt (30.000 đ)  
✅ Modal chỉnh sửa  
✅ Xác nhận trước khi xóa  
✅ Tìm kiếm real-time  
✅ Hover effects & animations  

---

## 🔗 Liên kết Nhanh

- **Frontend**: http://localhost/Project2MNM/frontend/index.html
- **API Endpoint**: http://localhost/Project2MNM/backend/api.php
- **phpMyAdmin**: http://localhost/phpmyadmin

---

## 📄 License

Dự án học tập - Sử dụng tự do

---

**Tác giả**: PHP Developer  
**Ngày tạo**: 19/12/2025  
**Version**: 1.0
