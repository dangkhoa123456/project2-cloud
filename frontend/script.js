const API_URL = 'api.php';
// Load danh sách chi tiêu khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
});

// ===== Load danh sách chi tiêu =====
function loadExpenses() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            displayExpenses(data.data || []);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Không thể tải danh sách chi tiêu');
        });
}

// ===== Hiển thị danh sách chi tiêu =====
function displayExpenses(expenses) {
    const tbody = document.getElementById('expensesBody');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">Chưa có chi tiêu nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = expenses.map((expense, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${expense.description}</td>
            <td class="amount">${formatCurrency(expense.amount)}</td>
            <td class="actions">
                <button class="btn-edit" onclick="openEditModal(${expense.id}, '${expense.description}', ${expense.amount})">Sửa</button>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// ===== Thêm chi tiêu mới =====
function addExpense() {
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value.trim();
    
    if (!description || !amount) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Số tiền phải là số dương!');
        return;
    }
    
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            amount: parseInt(amount)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
            loadExpenses();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Lỗi khi thêm chi tiêu');
    });
}

// ===== Xóa chi tiêu =====
function deleteExpense(id) {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;
    
    fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadExpenses();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Lỗi khi xóa chi tiêu');
    });
}

// ===== Mở modal chỉnh sửa =====
function openEditModal(id, description, amount) {
    document.getElementById('editId').value = id;
    document.getElementById('editDescription').value = description;
    document.getElementById('editAmount').value = amount;
    document.getElementById('editModal').classList.add('active');
}

// ===== Đóng modal =====
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// ===== Cập nhật chi tiêu =====
function updateExpense() {
    const id = document.getElementById('editId').value;
    const description = document.getElementById('editDescription').value.trim();
    const amount = document.getElementById('editAmount').value.trim();
    
    if (!description || !amount) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Số tiền phải là số dương!');
        return;
    }
    
    fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(id),
            description: description,
            amount: parseInt(amount)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal();
            loadExpenses();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Lỗi khi cập nhật chi tiêu');
    });
}

// ===== Tìm kiếm chi tiêu =====
function searchExpenses() {
    const query = document.getElementById('searchInput').value.trim();
    
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displayExpenses(data.data || []);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Lỗi khi tìm kiếm');
        });
}

// ===== Format tiền tệ (VD: 30000 → 30.000 đ) =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' đ';
}

// ===== Hiển thị lỗi =====
function showError(message) {
    alert(message);
}

// Đóng modal khi click ngoài
document.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});
