document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await fetchProducts();

    document.getElementById('filterButton').addEventListener('click', () => {
        const category = document.getElementById('categorySelect').value;
        fetchProducts(category);
    });
});

async function fetchProducts(category) {
    let url = '/api/products';
    if (category) {
        url += `/category/${category}`;
    }
    const response = await fetch(url);
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
            <input type="number" id="quantity-${product._id}" min="1" value="1">
            <button onclick="addToCart('${product._id}', '${product.title}', '${product.image}', ${product.price})">Añadir al carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

function addToCart(id, title, image, price) {
    const quantity = document.getElementById(`quantity-${id}`).value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += parseInt(quantity);
    } else {
        cart.push({ id, title, image, price, quantity: parseInt(quantity) });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
}

async function loadCategories() {
    const response = await fetch('/api/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('categorySelect');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}