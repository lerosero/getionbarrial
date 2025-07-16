// Variables globales
let currentUser = null;
let stats = {
    users: 15,
    alicuotas: 8,
    gastos: 12,
    notifications: 3
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initializePanel();
    loadStats();
    setupEventListeners();
});

// Función de inicialización principal
function initializePanel() {
    // Verificar autenticación
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        // No hay sesión activa, redirigir al login
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        document.getElementById('currentUser').textContent = currentUser.name;
    } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        logout();
    }
    
    // Verificar expiración de sesión
    checkSessionExpiration();
}

// Función para verificar expiración de sesión
function checkSessionExpiration() {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
            alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            logout();
        }
    }
}

// Función para cargar estadísticas
function loadStats() {
    // Simular carga de datos con animación
    animateCounter('userCount', stats.users);
    animateCounter('alicuotaCount', stats.alicuotas);
    animateCounter('gastoCount', stats.gastos);
    
    // Actualizar badge de notificaciones
    document.getElementById('notificationBadge').textContent = stats.notifications;
}

// Función para animar contadores
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    let currentValue = 0;
    const increment = targetValue / 30; // 30 frames de animación
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 50);
}

// Función para configurar event listeners
function setupEventListeners() {
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('notificationModal');
        if (event.target === modal) {
            closeModal('notificationModal');
        }
    });
    
    // Atajos de teclado
    document.addEventListener('keydown', (event) => {
        // ESC para cerrar modales
        if (event.key === 'Escape') {
            closeModal('notificationModal');
        }
        
        // Atajos para navegación rápida
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    navigateToModule('usuarios');
                    break;
                case '2':
                    event.preventDefault();
                    navigateToModule('alicuotas');
                    break;
                case '3':
                    event.preventDefault();
                    navigateToModule('gastos');
                    break;
            }
        }
    });
}

// Función para navegar a módulos
function navigateToModule(module) {
    // Mostrar animación de carga
    showLoadingOverlay();
    
    // Simular navegación (en un sistema real, esto sería una redirección)
    setTimeout(() => {
        hideLoadingOverlay();
        
        switch (module) {
            case 'usuarios':
                showModuleInfo('Gestión de Usuarios', 'Aquí podrá administrar los usuarios del sistema, asignar roles y permisos.');
                break;
            case 'alicuotas':
                showModuleInfo('Gestión de Alícuotas', 'Módulo para administrar pagos, cuotas mensuales y estados de cuenta de los residentes.');
                break;
            case 'gastos':
                showModuleInfo('Gestión de Gastos', 'Control de gastos comunes, presupuestos y reportes financieros del barrio.');
                break;
            default:
                showModuleInfo('Módulo no encontrado', 'El módulo solicitado no está disponible.');
        }
    }, 1500);
}

// Función para mostrar información del módulo
function showModuleInfo(title, description) {
    const modal = createModal(title, description);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        modal.remove();
    }, 3000);
}

// Función para crear modal dinámico
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <p>${content}</p>
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="this.closest('.modal').remove()" 
                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                   color: white; border: none; padding: 10px 20px; 
                                   border-radius: 8px; cursor: pointer;">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Función para mostrar overlay de carga
function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; 
                        border-top: 4px solid #667eea; border-radius: 50%; 
                        animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: #333; font-size: 1.1rem; font-weight: 500;">Cargando módulo...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Función para ocultar overlay de carga
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Función para cerrar sesión
function logout() {
    // Mostrar confirmación
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        
        // Mostrar mensaje de despedida
        showLogoutMessage();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Función para mostrar mensaje de logout
function showLogoutMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        animation: fadeInScale 0.5s ease-out;
    `;
    
    message.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">¡Hasta pronto!</h3>
        <p style="margin: 0; opacity: 0.9;">Cerrando sesión...</p>
    `;
    
    document.body.appendChild(message);
}

// Funciones para acciones rápidas
function showQuickReport() {
    const reportData = `
        <h4>Reporte Rápido del Sistema</h4>
        <div style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Usuarios activos:</span>
                <strong>${stats.users}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Alícuotas pendientes:</span>
                <strong>${stats.alicuotas}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Gastos del mes:</span>
                <strong>${stats.gastos}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; border-top: 1px solid #eee; padding-top: 10px;">
                <span>Estado del sistema:</span>
                <strong style="color: #27ae60;">Operativo</strong>
            </div>
        </div>
    `;
    
    const modal = createModal('Reporte Rápido', reportData);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

function showNotifications() {
    document.getElementById('notificationModal').style.display = 'block';
}

function showSettings() {
    const settingsContent = `
        <div style="margin: 20px 0;">
            <h4>Configuración del Sistema</h4>
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">Tema:</label>
                <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    <option>Claro</option>
                    <option>Oscuro</option>
                    <option>Automático</option>
                </select>
            </div>
            <div style="margin: 15px 0;">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" checked> Notificaciones por email
                </label>
            </div>
            <div style="margin: 15px 0;">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox"> Modo mantenimiento
                </label>
            </div>
        </div>
    `;
    
    const modal = createModal('Configuración', settingsContent);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showHelp() {
    const helpContent = `
        <h4>Ayuda del Sistema</h4>
        <div style="margin: 20px 0; text-align: left;">
            <h5>Atajos de teclado:</h5>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Ctrl + 1:</strong> Gestión de Usuarios</li>
                <li><strong>Ctrl + 2:</strong> Gestión de Alícuotas</li>
                <li><strong>Ctrl + 3:</strong> Gestión de Gastos</li>
                <li><strong>ESC:</strong> Cerrar modales</li>
            </ul>
            <h5>Contacto de soporte:</h5>
            <p>Email: soporte@gestor25.com<br>
               Teléfono: +54 11 1234-5678</p>
        </div>
    `;
    
    const modal = createModal('Ayuda', helpContent);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showAbout() {
    const aboutContent = `
        <h4>Acerca de Gestor 25</h4>
        <div style="margin: 20px 0; text-align: left;">
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Desarrollado por:</strong> Equipo Gestor 25</p>
            <p><strong>Año:</strong> 2025</p>
            <p style="margin-top: 15px;">
                Sistema integral para la gestión de barrios cerrados, 
                incluyendo administración de usuarios, alícuotas y gastos comunes.
            </p>
        </div>
    `;
    
    const modal = createModal('Acerca de', aboutContent);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showContact() {
    const contactContent = `
        <h4>Información de Contacto</h4>
        <div style="margin: 20px 0; text-align: left;">
            <p><strong>Empresa:</strong> Gestor 25 Solutions</p>
            <p><strong>Dirección:</strong> Av. Principal 123, Ciudad</p>
            <p><strong>Teléfono:</strong> +54 11 1234-5678</p>
            <p><strong>Email:</strong> contacto@gestor25.com</p>
            <p><strong>Sitio web:</strong> www.gestor25.com</p>
            <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>
    `;
    
    const modal = createModal('Contacto', contactContent);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);