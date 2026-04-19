
var lista = document.querySelectorAll('.nav li');
function activarlink() {
    lista.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}

lista.forEach((item) =>
    item.addEventListener('mouseover', activarlink));

/* submenu - click para abrir/cerrar */
var submenuLinks = document.querySelectorAll('.nav li.has-submenu > a');
submenuLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var parent = this.parentElement;
        parent.classList.toggle('open');
    });
});

/* funcion para mostrar/ocultar el menu */
var toggle = document.querySelector('.toggle');
var nav = document.querySelector('.nav');
var container = document.querySelector('.container');

toggle.onclick = function() {
    nav.classList.toggle('active');
    container.classList.toggle('active');
};

// Funciones para cargar datos de estudiantes en la tabla y actualizar el contador total
async function cargarUltimosEstudiantes() {
    const tbody = document.getElementById('ultimos-estudiantes-body');
    if (!tbody) return;

    const apiBase = 'http://localhost:3000';

    try {
        const response = await fetch(`${apiBase}/api/estudiantes?limit=10`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const estudiantes = await response.json();

        if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay estudiantes registrados aún.</td></tr>';
            return;
        }

        tbody.innerHTML = estudiantes.map(est => `
            <tr>
                <td>${est.nombre || ''}</td>
                <td>${est.apellido || ''}</td>
                <td>${est.cedula_escolar || 'N/A'}</td>
                <td>${est.nombre_rep ? `${est.nombre_rep} ${est.apellido_rep}` : 'Sin representante'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando últimos estudiantes:', error);
        tbody.innerHTML = '<tr><td colspan="4">No se pudo cargar los estudiantes.</td></tr>';
    }
}

async function actualizarTotalEstudiantes() {
    const contador = document.getElementById('total-estudiantes-count');
    if (!contador) return;

    const apiBase = 'http://localhost:3000';

    try {
        let response = await fetch(`${apiBase}/api/estudiantes/count`);
        if (!response.ok) {
            if (response.status === 404) {
                const fallback = await fetch(`${apiBase}/api/estudiantes`);
                if (!fallback.ok) throw new Error(`HTTP ${fallback.status}`);
                const estudiantes = await fallback.json();
                contador.textContent = Array.isArray(estudiantes) ? estudiantes.length : '0';
                return;
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (Number.isInteger(data.count)) {
            contador.textContent = data.count;
            return;
        }

        const fallback = await fetch(`${apiBase}/api/estudiantes`);
        if (!fallback.ok) throw new Error(`HTTP ${fallback.status}`);
        const estudiantes = await fallback.json();
        contador.textContent = Array.isArray(estudiantes) ? estudiantes.length : '0';
    } catch (error) {
        console.error('Error cargando total de estudiantes:', error);
        contador.textContent = 'Error';
    }
}



//Funcion para actualizar en la tabla los profesores registrados
async function cargarPersonal() {
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;

    const apiBase = 'http://localhost:3000';

    try {
        // Ajustamos la URL para el personal
        const response = await fetch(`${apiBase}/api/personal`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const personal = await response.json();

        if (!Array.isArray(personal) || personal.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay personal registrado aún.</td></tr>';
            return;
        }

        // Mapeamos los campos según tu base de datos (ej: nombre, cargo, cedula)
        tbody.innerHTML = personal.map(p => `

            <tr>
                <td>${p.id || ''}</td>
                <td>${p.nombre || ''}</td>
                <td>${p.apellido || ''}</td>
                <td>${p.cedula || 'N/A'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando personal:', error);
        tbody.innerHTML = '<tr><td colspan="4">No se pudo cargar la información del personal.</td></tr>';
    }
}

async function actualizarTotalPersonal() {
    const contador = document.getElementById('total-personal-count');
    if (!contador) return;

    const apiBase = 'http://localhost:3000';

    try {
        let response = await fetch(`${apiBase}/api/personal/count`);
        
        // Si no tienes un endpoint de conteo, usamos el fallback al array completo
        if (!response.ok) {
            const fallback = await fetch(`${apiBase}/api/personal`);
            const data = await fallback.json();
            contador.textContent = Array.isArray(data) ? data.length : '0';
            return;
        }

        const data = await response.json();
        contador.textContent = data.count ?? '0';
    } catch (error) {
        console.error('Error en total personal:', error);
        contador.textContent = '-';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Tus funciones de estudiantes existentes
    cargarUltimosEstudiantes();
    actualizarTotalEstudiantes();

    // Nuevas funciones de personal
    cargarPersonal();
    actualizarTotalPersonal();
});