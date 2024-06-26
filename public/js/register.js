document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registration successful');
        window.location.href = 'login.html';
    } else {
        alert(`Registration failed: ${data.error}`);
    }
});
