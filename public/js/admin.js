document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    document.getElementById('addCategoryForm').addEventListener('submit', addCategory);
    document.getElementById('logoutButton').addEventListener('click', logoutUser);
});

async function fetchProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p>Categoria: ${product.category}</p>
            <p>Precio: $${product.price}</p>
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

async function addProduct(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, image, description, category, price })
    });

    if (response.ok) {
        alert('Producto añadido con exito');
        fetchProducts();
    } else {
        const data = await response.json();
        alert(`Error al añadir producto: ${data.error}`);
    }
}

async function deleteProduct(productId) {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        alert('Producto eliminado');
        fetchProducts();
    } else {
        const data = await response.json();
        alert(`Error eliminar el producto: ${data.error}`);
    }
}

async function fetchOrders() {
    const response = await fetch('/api/orders', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        const orders = await response.json();
        displayOrders(orders);
    } else {
        const data = await response.json();
        alert(`Error all conseguir las ordenes: ${data.error}`);
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order';
        orderElement.innerHTML = `
            <h3>Order ID: ${order._id}</h3>
            <p>User ID: ${order.userId}</p>
            <p>Status: ${order.status}</p>
            <p>Created At: ${new Date(order.createdAt).toLocaleString()}</p>
            <p>Items:</p>
            <ul>
                ${order.items.map(item => `<li>${item.title} (x${item.quantity}) - $${item.price}</li>`).join('')}
            </ul>
            <button onclick="updateOrderStatus('${order._id}', 'received')">Marcar como recibida</button>
            <button onclick="updateOrderStatus('${order._id}', 'delivered')">marcar como eliminada</button>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

async function updateOrderStatus(orderId, status) {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
    });

    if (response.ok) {
        alert('Estado de orden actualizado');
        fetchOrders();
    } else {
        const data = await response.json();
        alert(`Error al actualizar estado: ${data.error}`);
    }
}

async function fetchCategories() {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    displayCategories(categories);
    populateCategoryDropdown(categories);
}

function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <h3>${category.name}</h3>
            <button onclick="deleteCategory('${category._id}')">Eliminar</button>
        `;
        categoriesContainer.appendChild(categoryElement);
    });
}

async function addCategory(event) {
    event.preventDefault();
    const name = document.getElementById('categoryName').value;

    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        alert('Categoria añadida con exito');
        fetchCategories();
    } else {
        const data = await response.json();
        alert(`Error al añadir categoria: ${data.error}`);
    }
}

async function deleteCategory(categoryId) {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        alert('Categoria eliminada con exito');
        fetchCategories();
    } else {
        const data = await response.json();
        alert(`Error al borra categoria: ${data.error}`);
    }
}

function populateCategoryDropdown(categories) {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function logoutUser() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
