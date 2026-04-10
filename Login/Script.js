const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});
btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
});

// Manejador para registro
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (email && password) {
        localStorage.setItem('usuario', email);
        localStorage.setItem('password', password);
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        container.classList.remove("toggle"); // Cambia a login
    } else {
        alert('Completa todos los campos.');
    }
});

// Manejador para login
document.getElementById('signin-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const storedEmail = localStorage.getItem('usuario');
    const storedPassword = localStorage.getItem('password');
    if (email === storedEmail && password === storedPassword) {
        window.location.href = '../Admindashboard/index.html';
    } else {
        alert('Credenciales incorrectas.');
    }
});
