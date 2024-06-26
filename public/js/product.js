document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
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
            <p>Category: ${product.category}</p>
            <p>Price: $${product.price}</p>
            <input type="number" id="quantity-${product._id}" min="1" value="1">
            <button onclick="addToCart('${product._id}', '${product.title}', '${product.image}', ${product.price})">Add to Cart</button>
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
    alert('Product added to cart');
}
