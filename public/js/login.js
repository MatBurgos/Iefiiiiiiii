document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Login exitoso');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        window.location.href = 'index.html';
    } else {
        alert(`Error de login: ${data.error}`);
    }
});
