const registroData = {
    estudiante: {
        title: 'Registro: Estudiante',
        headers: ['Cédula / Rep.', 'Nombre', 'Apellido', 'Año Escolar', 'Sección', 'Grado'],
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'ano', label: 'Año Escolar', type: 'text' },
            { name: 'seccion', label: 'Sección', type: 'text' },
            { name: 'grado', label: 'Grado', type: 'text' }
        ],
        rows: [
            ['V12345678', 'Andrés', 'García', '2023-2024', 'A', '1°'],
            ['V98765432', 'María', 'López', '2023-2024', 'B', '1°']
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
        headers: ['Cédula', 'Nombre', 'Apellido', 'Grado Asignado', 'Cargo', 'Teléfono'],
        fields: [
            { name: 'cedula', label: 'Cédula', type: 'text' },
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'cargo', label: 'Cargo', type: 'select' },
            { name: 'grado', label: 'Grado Asignado', type: 'select' },
            { name: 'telefono', label: 'Teléfono', type: 'text' }
        ],
        rows: [
            ['V15678912', 'Carlos', 'Ramírez', '1°', 'Docente', '04122345678']
        ]
    }
};

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
    const inputGrado = document.getElementById('grado');

    if (selectElement.value === 'Docente') {
        wrapperGrado.classList.remove('hidden');
        if (inputGrado) inputGrado.required = true;
    } else {
        wrapperGrado.classList.add('hidden');
        if (inputGrado) {
            inputGrado.required = false;
            inputGrado.value = "";
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

function renderTable(type) {
    const data = registroData[type];
    registroTitle.textContent = data.title;
    registroHead.innerHTML = '<tr>' + data.headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    registroBody.innerHTML = data.rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
}

function renderForm(type) {
    const data = registroData[type];
    const opcionesGrado = ['1°', '2°', '3°', '4°', '5°', '6°'];
    const opcionesSeccion = ['A', 'B', 'C'];
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
                if (field.name === 'grado') {
                    return `<div class="field"><label>Grado</label><select id="grado" name="grado" required><option value="" disabled selected>Seleccione</option>${opcionesGrado.map(g => `<option value="${g}">${g}</option>`).join('')}</select></div>`;
                }
                if (field.name === 'seccion') {
                    return `<div class="field"><label>Sección</label><select id="seccion" name="seccion" required><option value="" disabled selected>Seleccione</option>${opcionesSeccion.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>`;
                }
                return `<div class="field"><label>${field.label}</label><input id="${field.name}" name="${field.name}" type="text" placeholder="Ingrese ${field.label.toLowerCase()}" required></div>`;
            }).join('')}
        `;
        setupCedulaToggleEvents();
    } else {
        formFields.innerHTML = data.fields.map(field => {
            let extraClass = field.name === 'direccion' ? 'field-full' : '';
            
            if (field.name === 'cargo') {
                return `<div class="field"><label>Cargo</label><select id="cargo" name="cargo" onchange="toggleGradoAsignado(this)" required><option value="" disabled selected>Seleccione</option>${opcionesCargo.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>`;
            }
            if (field.name === 'grado') {
                return `<div id="wrapper-grado-asignado" class="field hidden"><label>Grado Asignado</label><select id="grado" name="grado"><option value="" disabled selected>Seleccione</option>${opcionesGrado.map(g => `<option value="${g}">${g}</option>`).join('')}</select></div>`;
            }

            let pattern = field.name === 'cedula' ? '^[VEJP][0-9]{7,9}$' : (field.name === 'telefono' ? '[0-9]{10,11}' : '');
            let placeholder = field.name === 'cedula' ? 'Ej: V12345678' : `Ingrese ${field.label.toLowerCase()}`;

            return `<div class="field ${extraClass}"><label>${field.label}</label><input id="${field.name}" name="${field.name}" type="text" placeholder="${placeholder}" ${pattern ? `pattern="${pattern}"` : ''} required></div>`;
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

function selectPerson(type, button) {
    currentType = type;
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderTable(type);
    renderForm(type);
}

// --- EVENTO SUBMIT ---
registroForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = registroData[currentType];
    let values = [];

    if (currentType === 'estudiante') {
        const cedVal = estudianteConCedula ? document.getElementById('cedula').value : "Rep: " + document.getElementById('cedula_representante').value;
        values.push(cedVal);
        data.fields.forEach(f => values.push(document.getElementById(f.name).value));
    } else {
        data.fields.forEach(f => {
            const el = document.getElementById(f.name);
            if (f.name === 'grado' && el.closest('.hidden')) {
                values.push('N/A');
            } else {
                values.push(el.value);
            }
        });
    }

    data.rows.push(values);
    renderTable(currentType);
    registroForm.reset();
    renderForm(currentType);
});

// Inicialización
buttons.forEach(button => button.addEventListener('click', () => selectPerson(button.dataset.person, button)));
selectPerson('estudiante', document.querySelector('[data-person="estudiante"]'));