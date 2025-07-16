// Datos de usuarios de ejemplo (en un sistema real, esto vendría de una base de datos)
const validUsers = [
    { username: 'admin', password: 'admin123', name: 'Administrador' },
    { username: 'gestor', password: 'gestor123', name: 'Gestor Barrial' },
    { username: 'usuario', password: 'usuario123', name: 'Usuario' }
];

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');
const btnLoader = document.getElementById('btnLoader');
const errorMessage = document.getElementById('errorMessage');

// Event listeners
loginForm.addEventListener('submit', handleLogin);
usernameInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);

// Función principal de login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validaciones básicas
    if (!username || !password) {
        showError('Por favor, complete todos los campos');
        return;
    }
    
    // Mostrar estado de carga
    setLoadingState(true);
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar credenciales
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login exitoso
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Animación de éxito
        showSuccess();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'panel.html';
        }, 1000);
    } else {
        // Login fallido
        setLoadingState(false);
        showError('Usuario o contraseña incorrectos');
        shakeForm();
    }
}

// Función para mostrar estado de carga
function setLoadingState(loading) {
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        loginBtn.querySelector('span').textContent = 'Verificando...';
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        loginBtn.querySelector('span').textContent = 'Ingresar al Sistema';
    }
}

// Función para mostrar errores
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        clearError();
    }, 5000);
}

// Función para limpiar errores
function clearError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

// Función para mostrar éxito
function showSuccess() {
    loginBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    loginBtn.querySelector('span').textContent = '¡Acceso concedido!';
    
    // Agregar efecto de éxito
    const successIcon = document.createElement('span');
    successIcon.innerHTML = '✓';
    successIcon.style.marginLeft = '10px';
    successIcon.style.fontSize = '1.2rem';
    loginBtn.querySelector('span').appendChild(successIcon);
}

// Función para animar el formulario en caso de error
function shakeForm() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
}

// Función para mostrar modal de recuperación de contraseña
function showForgotPassword() {
    alert('Funcionalidad de recuperación de contraseña.\n\nPara esta demostración, puede usar:\n\nUsuario: admin\nContraseña: admin123\n\nUsuario: gestor\nContraseña: gestor123\n\nUsuario: usuario\nContraseña: usuario123');
}

// Verificar si ya hay una sesión activa al cargar la página
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    const loginTime = localStorage.getItem('loginTime');
    
    if (currentUser && loginTime) {
        // Verificar si la sesión no ha expirado (24 horas)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // Sesión válida, redirigir al panel
            window.location.href = 'panel.html';
        } else {
            // Sesión expirada, limpiar localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loginTime');
        }
    }
});

// Agregar efectos visuales adicionales
document.addEventListener('DOMContentLoaded', () => {
    // Efecto de focus en los inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Efecto de typing en el título
    const title = document.querySelector('.logo-section h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 500);
});