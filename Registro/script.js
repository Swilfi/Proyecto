const API_BASE = 'http://localhost:3000/api';

const registroData = {
    estudiante: {
        title: 'Registro: Estudiante',
        headers: ['Cédula / Rep.', 'Nombre', 'Apellido', 'Fecha de Nac.', 'Dirección'],
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date' },
            { name: 'direccion', label: 'Dirección', type: 'text' }
        ],
        rows: [
            ['V12345678', 'Andrés', 'García', '2009-05-12', 'Av. Central 1'],
            ['V98765432', 'María', 'López', '2010-08-21', 'Calle Falsa 123']
        ]
    },
    representante: {
        title: 'Registro: Representante',
        headers: ['Cédula', 'Nombre', 'Apellido', 'Teléfono', 'Dirección'],
        fields: [
            { name: 'cedula', label: 'Cédula', type: 'text' },
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'telefono', label: 'Teléfono', type: 'text' },
            { name: 'direccion', label: 'Dirección', type: 'text' }
        ],
        rows: [
            ['V10123456', 'Ana', 'Pérez', '04141234567', 'Av. Central 123']
        ]
    },
    profesor: {
        title: 'Registro: Profesor',
        headers: ['Cédula', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Cargo', 'Grado', 'Sección'],
        fields: [
            { name: 'cedula', label: 'Cédula', type: 'text' },
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'email', label: 'Email', type: 'text' },
            { name: 'telefono', label: 'Teléfono', type: 'text' },
            { name: 'cargo', label: 'Cargo', type: 'select' },
            { name: 'grado', label: 'Grado', type: 'select' },
            { name: 'seccion', label: 'Sección', type: 'select' }
        ],
        rows: [
            ['V15678912', 'Carlos', 'Ramírez', 'carlos@colegio.com', '04122345678', 'Docente', '1°', 'A']
        ]
    }
};

const opcionesGrado = ['1°', '2°', '3°', '4°', '5°', '6°'];
const opcionesSeccion = ['A', 'B', 'C'];

// --- VALIDACIONES EN TIEMPO REAL ---
document.addEventListener('input', (e) => {
    // Validación de Cédulas (V/E/J/P + Números)
    if (e.target.name === 'cedula' || e.target.name === 'cedula_representante') {
        let value = e.target.value.toUpperCase();
        if (value.length === 1 && !/[VEJP]/.test(value)) {
            e.target.value = '';
            return;
        }
        if (value.length > 1) {
            const firstChar = value.charAt(0);
            const rest = value.substring(1).replace(/[^0-9]/g, '');
            e.target.value = firstChar + rest;
        } else {
            e.target.value = value;
        }
    }

    // Validación de Teléfono (Solo números)
    if (e.target.name === 'telefono') {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    // Validación de Nombres y Apellidos (Solo letras)
    if (e.target.name === 'nombre' || e.target.name === 'apellido') {
        e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
    }
});

// --- FUNCIONES DE CONTROL VISUAL ---
function toggleGradoAsignado(selectElement) {
    const wrapperGrado = document.getElementById('wrapper-grado-asignado');
    const wrapperSeccion = document.getElementById('wrapper-seccion-asignado');
    const inputGrado = document.getElementById('grado');
    const inputSeccion = document.getElementById('seccion');

    if (selectElement.value === 'Docente') {
        wrapperGrado.classList.remove('hidden');
        wrapperSeccion.classList.remove('hidden');
        if (inputGrado) inputGrado.required = true;
        if (inputSeccion) inputSeccion.required = true;
    } else {
        wrapperGrado.classList.add('hidden');
        wrapperSeccion.classList.add('hidden');
        if (inputGrado) {
            inputGrado.required = false;
            inputGrado.value = "";
        }
        if (inputSeccion) {
            inputSeccion.required = false;
            inputSeccion.value = "";
        }
    }
}

function updateCedulaVisibility() {
    const cedulaSection = document.getElementById('cedulaSection');
    const sinCedulaSection = document.getElementById('sinCedulaSection');
    const cedulaInput = document.getElementById('cedula');
    const cedulaRepInput = document.getElementById('cedula_representante');
    
    if (estudianteConCedula) {
        cedulaSection.classList.remove('hidden');
        sinCedulaSection.classList.add('hidden');
        if (cedulaInput) cedulaInput.required = true;
        if (cedulaRepInput) cedulaRepInput.required = false;
    } else {
        cedulaSection.classList.add('hidden');
        sinCedulaSection.classList.remove('hidden');
        if (cedulaInput) cedulaInput.required = false;
        if (cedulaRepInput) cedulaRepInput.required = true;
    }
}

// --- RENDERIZADO ---
const registroTitle = document.getElementById('registroTitle');
const registroHead = document.getElementById('registroHead');
const registroBody = document.getElementById('registroBody');
const formFields = document.getElementById('formFields');
const registroForm = document.getElementById('registroForm');
const buttons = document.querySelectorAll('.check-button');
let currentType = 'estudiante';
let estudianteConCedula = true;

let currentRows = [];

function renderTable(type) {
    const data = registroData[type];
    const rows = currentRows.length ? currentRows : data.rows;

    registroTitle.textContent = data.title;
    registroHead.innerHTML = '<tr>' + data.headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    registroBody.innerHTML = rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
}

async function fetchRegistroRows(type) {
    try {
        if (type === 'estudiante') {
            const response = await fetch(`${API_BASE}/estudiantes`);
            const estudiantes = await response.json();
            return estudiantes.map(est => [
                est.cedula_escolar || `Rep: ${est.cedula_rep || 'Sin representante'}`,
                est.nombre,
                est.apellido,
                est.fecha_nacimiento || 'N/A',
                est.direccion || 'N/A'
            ]);
        }

        if (type === 'representante') {
            const response = await fetch(`${API_BASE}/representantes`);
            const reps = await response.json();
            return reps.map(rep => [rep.cedula, rep.nombre, rep.apellido, rep.telefono, rep.direccion]);
        }

        if (type === 'profesor') {
            const response = await fetch(`${API_BASE}/profesores`);
            const profs = await response.json();
            return profs.map(prof => [
                prof.cedula,
                prof.nombre,
                prof.apellido,
                prof.email || 'N/A',
                prof.telefono || 'N/A',
                prof.cargo_nombre || 'N/A',
                prof.grado_num ? `${prof.grado_num}°` : 'N/A',
                prof.seccion_num ? String.fromCharCode(64 + prof.seccion_num) : 'N/A'
            ]);
        }

        return [];
    } catch (error) {
        console.error('Error cargando registros:', error);
        return [];
    }
}

async function loadRegistroTable(type) {
    currentRows = await fetchRegistroRows(type);
    renderTable(type);
}

function renderForm(type) {
    const data = registroData[type];
    const opcionesCargo = ['Administrativo', 'Obrero', 'Docente'];

    if (type === 'estudiante') {
        formFields.innerHTML = `
            <div class="field field-full">
                <label>¿El estudiante tiene cédula?</label>
                <div class="radio-group">
                    <button type="button" class="toggle-button active" data-value="si">Sí</button>
                    <button type="button" class="toggle-button" data-value="no">No</button>
                </div>
            </div>
            <div id="cedulaSection" class="field field-full">
                <label for="cedula">Cédula del Estudiante</label>
                <input id="cedula" name="cedula" type="text" placeholder="Ej: V12345678">
            </div>
            <div id="sinCedulaSection" class="field field-full hidden">
                <label for="cedula_representante">Cédula del Representante</label>
                <input id="cedula_representante" name="cedula_representante" type="text" placeholder="Ej: V87654321">
            </div>
            ${data.fields.map(field => {
                const inputType = field.type === 'date' ? 'date' : 'text';
                return `<div class="field"><label>${field.label}</label><input id="${field.name}" name="${field.name}" type="${inputType}" placeholder="Ingrese ${field.label.toLowerCase()}" required></div>`;
            }).join('')}
        `;
        setupCedulaToggleEvents();
    } else {
        formFields.innerHTML = data.fields.map(field => {
            let extraClass = (field.name === 'email' || field.name === 'seccion') ? 'field-full' : '';
            
            if (field.type === 'select') {
                if (field.name === 'cargo') {
                    return `<div class="field"><label>Cargo</label><select id="cargo" name="cargo" onchange="toggleGradoAsignado(this)" required><option value="" disabled selected>Seleccione</option>${opcionesCargo.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>`;
                }
                if (field.name === 'grado') {
                    return `<div id="wrapper-grado-asignado" class="field hidden"><label>Grado Asignado</label><select id="grado" name="grado"><option value="" disabled selected>Seleccione</option>${opcionesGrado.map(g => `<option value="${g}">${g}</option>`).join('')}</select></div>`;
                }
                if (field.name === 'seccion') {
                    return `<div id="wrapper-seccion-asignado" class="field hidden"><label>Sección Asignada</label><select id="seccion" name="seccion"><option value="" disabled selected>Seleccione</option>${opcionesSeccion.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>`;
                }
            }

            let pattern = field.name === 'cedula' ? '^[VEJP][0-9]{7,9}$' : (field.name === 'telefono' ? '[0-9]{10,11}' : '');
            let placeholder = field.name === 'cedula' ? 'Ej: V12345678' : `Ingrese ${field.label.toLowerCase()}`;
            const inputType = field.name === 'email' ? 'email' : 'text';

            return `<div class="field ${extraClass}"><label>${field.label}</label><input id="${field.name}" name="${field.name}" type="${inputType}" placeholder="${placeholder}" ${pattern ? `pattern="${pattern}"` : ''} required></div>`;
        }).join('');
    }
}

function setupCedulaToggleEvents() {
    const toggleButtons = formFields.querySelectorAll('.toggle-button');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            estudianteConCedula = btn.dataset.value === 'si';
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCedulaVisibility();
        });
    });
    updateCedulaVisibility();
}

async function selectPerson(type, button) {
    currentType = type;
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderForm(type);
    await loadRegistroTable(type);
}

async function sendRegistration(endpoint, payload) {
    try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Error en el servidor');
    }

    return result;
    } catch (error) {
    console.error(error);
    throw error;
    }
}

// --- EVENTO SUBMIT ---
registroForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = registroData[currentType];
    let payload = {};
    let values = [];
    let endpoint = '';

    if (currentType === 'estudiante') {
        endpoint = 'estudiantes';
        payload = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        direccion: document.getElementById('direccion').value,
        cedula: estudianteConCedula ? document.getElementById('cedula').value : null,
        cedula_representante: estudianteConCedula ? null : document.getElementById('cedula_representante').value
        };

        values = [
        estudianteConCedula ? payload.cedula : `Rep: ${payload.cedula_representante}`,
        payload.nombre,
        payload.apellido,
        payload.fecha_nacimiento,
        payload.direccion
        ];
    } else if (currentType === 'representante') {
        endpoint = 'representantes';
        payload = {
        cedula: document.getElementById('cedula').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value
        };
        values = [payload.cedula, payload.nombre, payload.apellido, payload.telefono, payload.direccion];
    } else if (currentType === 'profesor') {
        endpoint = 'profesores';
        payload = {
        cedula: document.getElementById('cedula').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        cargo: document.getElementById('cargo').value,
        grado: document.getElementById('grado').value,
        seccion: document.getElementById('seccion').value
        };
        values = [payload.cedula, payload.nombre, payload.apellido, payload.email, payload.telefono, payload.cargo, payload.grado || 'N/A', payload.seccion || 'N/A'];
    }

    try {
        await sendRegistration(endpoint, payload);
        await loadRegistroTable(currentType);
        alert('Registro guardado en la base de datos correctamente.');
    } catch (error) {
        alert(`Error al guardar el registro: ${error.message}`);
        return;
    }

    registroForm.reset();
    renderForm(currentType);
});

// Inicialización
buttons.forEach(button => button.addEventListener('click', async () => selectPerson(button.dataset.person, button)));
selectPerson('estudiante', document.querySelector('[data-person="estudiante"]')).catch(console.error);