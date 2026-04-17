
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

document.addEventListener('DOMContentLoaded', () => {
    cargarUltimosEstudiantes();
    actualizarTotalEstudiantes();
});