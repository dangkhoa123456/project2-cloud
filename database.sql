

-- ===== Tạo bảng expenses =====
CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Dữ liệu mẫu (tuỳ chọn) =====
INSERT INTO expenses (description, amount) VALUES
('Ăn sáng', 30000),
('Đổ xăng', 150000),
('Mua sách', 85000);
