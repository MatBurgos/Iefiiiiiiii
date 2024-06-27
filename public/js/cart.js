document.addEventListener('DOMContentLoaded', displayCart);

async function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <h3>${item.title}</h3>
            <img src="${item.image}" alt="${item.title}">
            <p>Precio: $${item.price}</p>
            <p>Cantidad: ${item.quantity}</p>
            <p>Subtotal: $${item.price * item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Remover</button>
        `;

        subtotal += item.price * item.quantity;
        cartContainer.appendChild(productElement);
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `
        <h3>Total: $${subtotal}</h3>
        <button id="checkoutButton">Checkout</button>
    `;
    cartContainer.appendChild(totalElement);

    document.getElementById('checkoutButton').addEventListener('click', checkout);
}

async function checkout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ items: cartItems })
    });

    if (response.ok) {
        alert('Order placed successfully');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    } else {
        const data = await response.json();
        alert(`Failed to place order: ${data.error}`);
    }
}

function removeFromCart(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
}
