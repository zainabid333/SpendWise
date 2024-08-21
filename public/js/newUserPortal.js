document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (validateEmail(email) && password) {
            alert('Login successful!');
            // Here you can handle the login logic, e.g., sending data to the server
        } else {
            alert('Please enter a valid email and password.');
        }
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (name && validateEmail(email) && password) {
            alert('Registration successful!');
            // Here you can handle the registration logic, e.g., sending data to the server
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
