<?php
// ===== CORS Headers =====
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===== Database Connection =====
$dbHost = 'sql305.infinityfree.com';
$dbUser = 'if0_40716381';
$dbPassword = 'nUVlKTdIjtfVmGh';
$dbName = 'if0_40716381_contact';

try {
    // Thêm dòng options để ép buộc dùng tiếng Việt (UTF-8)
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4" // <--- QUAN TRỌNG NHẤT
    ];

    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPassword, $options);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// ===== CRUD Logic =====
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

try {
    if ($method === 'GET') {
        // GET: Lấy danh sách chi tiêu (có thể tìm kiếm)
        $q = $_GET['q'] ?? '';
        
        if (!empty($q)) {
            $sql = "SELECT * FROM expenses WHERE description LIKE ? ORDER BY id DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(["%$q%"]);
        } else {
            $sql = "SELECT * FROM expenses ORDER BY id DESC";
            $stmt = $pdo->query($sql);
        }
        
        $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $expenses]);
    }
    
    elseif ($method === 'POST') {
        // POST: Thêm khoản chi mới
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['description']) || empty($data['amount'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Description and amount are required']);
            exit();
        }
        
        $sql = "INSERT INTO expenses (description, amount) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['description'], $data['amount']]);
        
        echo json_encode(['success' => true, 'message' => 'Expense added successfully']);
    }
    
    elseif ($method === 'PUT') {
        // PUT: Sửa khoản chi
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['id']) || empty($data['description']) || empty($data['amount'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID, description and amount are required']);
            exit();
        }
        
        $sql = "UPDATE expenses SET description = ?, amount = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['description'], $data['amount'], $data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Expense updated successfully']);
    }
    
    elseif ($method === 'DELETE') {
        // DELETE: Xóa khoản chi theo ID
        $id = $_GET['id'] ?? null;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required']);
            exit();
        }
        
        $sql = "DELETE FROM expenses WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Expense deleted successfully']);
    }
    
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
