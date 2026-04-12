console.log('script cargado');
const registroData = {
    estudiante: {
        title: 'Registro: Estudiante',
        headers: ['Cédula Es / Representante + Nacimiento', 'Nombre', 'Apellido', 'Año Escolar', 'Sección', 'Grado'],
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'ano', label: 'Año Escolar', type: 'text' },
            { name: 'seccion', label: 'Sección', type: 'text' },
            { name: 'grado', label: 'Grado', type: 'text' }
        ],
        rows: [
            ['123456789', 'Andrés', 'García', '2023-2024', 'A', '1°'],
            ['987654321', 'María', 'López', '2023-2024', 'B', '1°']
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
            ['40123456789', 'Ana', 'Pérez', '829-123-4567', 'Av. Central 123'],
            ['40234567890', 'Luis', 'Martínez', '849-987-6543', 'Calle Secundaria 45']
        ]
    },
    profesor: {
        title: 'Registro: Profesor',
        headers: ['Cédula', 'Nombre', 'Apellido', 'Grado Asignado', 'Teléfono'],
        fields: [
            { name: 'cedula', label: 'Cédula', type: 'text' },
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'apellido', label: 'Apellido', type: 'text' },
            { name: 'grado', label: 'Grado Asignado', type: 'text' },
            { name: 'telefono', label: 'Teléfono', type: 'text' }
        ],
        rows: [
            ['30567891234', 'Carlos', 'Ramírez', '1°', '809-234-5678'],
            ['30678912345', 'Lucía', 'Gómez', '2°', '829-345-6789']
        ]
    }
};

const registroTitle = document.getElementById('registroTitle');
const registroHead = document.getElementById('registroHead');
const registroBody = document.getElementById('registroBody');
const formFields = document.getElementById('formFields');
const registroForm = document.getElementById('registroForm');
const buttons = document.querySelectorAll('.check-button');
let currentType = 'estudiante';
let estudianteConCedula = true;
let cedulaSection, sinCedulaSection;

function renderTable(type) {
    const data = registroData[type];
    registroTitle.textContent = data.title;
    registroHead.innerHTML = '<tr>' + data.headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    registroBody.innerHTML = data.rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
}

function renderForm(type) {
    const data = registroData[type];

    if (type === 'estudiante') {
        formFields.innerHTML = `
            <div class="field">
                <label>¿El estudiante tiene cédula?</label>
                <div class="radio-group">
                    <button type="button" class="toggle-button active" data-value="si">Sí</button>
                    <button type="button" class="toggle-button" data-value="no">No</button>
                </div>
            </div>
            <div id="cedulaSection" class="field">
                <label for="cedula">Cédula Est</label>
                <input id="cedula" name="cedula" type="text" required>
            </div>
            <div id="sinCedulaSection" class="hidden">
                <div class="field">
                    <label for="cedula_representante">Cédula Representante</label>
                    <input id="cedula_representante" name="cedula_representante" type="text">
                </div>
            </div>
            ${data.fields.map(field => `
                <div class="field">
                    <label for="${field.name}">${field.label}</label>
                    <input id="${field.name}" name="${field.name}" type="${field.type}" required>
                </div>
            `).join('')}
        `;

        setupCedulaToggle();
        estudianteConCedula = true;
        updateCedulaVisibility();
        return;
    }

    formFields.innerHTML = data.fields.map(field => `
        <div class="field">
            <label for="${field.name}">${field.label}</label>
            <input id="${field.name}" name="${field.name}" type="${field.type}" required>
        </div>
    `).join('');
}

function setupCedulaToggle() {
    cedulaSection = document.getElementById('cedulaSection');
    sinCedulaSection = document.getElementById('sinCedulaSection');

    formFields.addEventListener('click', event => {
        if (event.target.classList.contains('toggle-button')) {
            estudianteConCedula = event.target.dataset.value === 'si';
            document.querySelectorAll('.toggle-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            updateCedulaVisibility();
        }
    });

    updateCedulaVisibility();
}

function updateCedulaVisibility() {
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

function selectPerson(type, button) {
    currentType = type;
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderTable(type);
    renderForm(type);
}

buttons.forEach(button => {
    button.addEventListener('click', () => selectPerson(button.dataset.person, button));
});

registroForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = registroData[currentType];
    let values = [];

    if (currentType === 'estudiante') {
        if (estudianteConCedula) {
            const cedula = document.getElementById('cedula').value.trim();
            if (!cedula) {
                alert('Ingrese la cédula del estudiante.');
                return;
            }
            values.push(cedula);
        } else {
            const cedulaRep = document.getElementById('cedula_representante').value.trim();
            if (!cedulaRep) {
                alert('Por favor complete la cédula del representante.');
                return;
            }
            values.push(`Rep: ${cedulaRep}`);
        }

        const studentFields = ['nombre', 'apellido', 'ano', 'seccion', 'grado'];
        for (const name of studentFields) {
            const input = document.getElementById(name);
            if (!input || !input.value.trim()) {
                alert('Por favor complete todos los campos del estudiante.');
                return;
            }
            values.push(input.value.trim());
        }
    } else {
        values = data.fields.map(field => {
            const input = document.getElementById(field.name);
            return input ? input.value.trim() : '';
        });

        if (values.some(value => value === '')) {
            alert('Por favor complete todos los campos antes de registrar.');
            return;
        }
    }

    data.rows.push(values);
    renderTable(currentType);
    registroForm.reset();

    if (currentType === 'estudiante') {
        estudianteConCedula = true;
        renderForm('estudiante');
    }
});

selectPerson('estudiante', document.querySelector('[data-person="estudiante"]'));