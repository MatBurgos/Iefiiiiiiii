// public/js/script.js
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const productsContainer = document.getElementById('products-container');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p>Categoria: ${product.category}</p>
            <p>Precio: $${product.price}</p>
        `;
        productsContainer.appendChild(productElement);
    });
});