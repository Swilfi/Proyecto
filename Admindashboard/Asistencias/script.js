// ==========================================
// 1. VARIABLES GLOBALES Y CONFIGURACIÓN
// ==========================================
let estudiantes = []; // Se llenará con datos de MySQL
let fechasSistema = []; // Podrás cargar esto de la BD más adelante

// ==========================================
// 2. FUNCIÓN PARA CARGAR DESDE EL SERVIDOR (NUEVA)
// ==========================================

// Lista "maestra" de lo que DEBERÍA haber
const listaInicial = [
    { id: "001", nombre: "Ana García", iniciales: "AG", asistencias: 0, fechas: [] },
    { id: "002", nombre: "Juan Pérez", iniciales: "JP", asistencias: 0, fechas: [] },
    { id: "003", nombre: "Carla Solis", iniciales: "CS", asistencias: 0, fechas: [] }
];

let datosApp = JSON.parse(localStorage.getItem('asistencias_db'));

// Si no hay nada en LocalStorage O la lista de estudiantes está vacía/incompleta
if (!datosApp || !datosApp.estudiantes || datosApp.estudiantes.length < 3) {
    datosApp = {
        estudiantes: listaInicial,
        fechasSistema: []
    };
    // Guardamos la lista completa de una vez para que no se pierdan
    localStorage.setItem('asistencias_db', JSON.stringify(datosApp));
}

let estudiantes = datosApp.estudiantes;
let fechasSistema = datosApp.fechasSistema;

// ==========================================
// 2. FUNCIÓN PARA DIBUJAR LA TABLA
// ==========================================
function renderizarTabla() {
    const cuerpoTabla = document.getElementById('listaEstudiantes');
    const fechaActual = document.getElementById('fechaAsistencia').value;

    
    // El total de inasistencias se basa en cuántos días se ha pasado lista en total
    const totalDiasClase = fechasSistema.length;

    cuerpoTabla.innerHTML = ""; 

    estudiantes.forEach(est => {
        // ¿El estudiante ya tiene registro de asistencia en la fecha que muestra el calendario?
        const yaAsistioHoy = (est.fechas || []).includes(fechaActual);
        
        // Cálculo de inasistencias: (Días totales) - (Días que asistió)
        const inasistencias = totalDiasClase - (est.asistencias || 0);

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <div class="info-estudiante">
                    <span class="avatar-placeholder">${est.iniciales}</span>
                    <div class="detalles-nombre">
                        <span class="nombre-estudiante">${est.nombre}</span>
                        <span class="id-estudiante">ID: ${est.id}</span>
                    </div>
                </div>
            </td>
            <td class="text-center">
                <span class="badge-conteo badge-asistencia-verde">${est.asistencias}</span>
            </td>
            <td class="text-center">
                <span class="badge-conteo badge-inasistencia-roja">${inasistencias}</span>
            </td>
            <td class="text-center">
                <div class="controles-asistencia">
                    <label class="radio-asistencia presente ${yaAsistioHoy ? 'deshabilitado' : ''}">
                        <input type="radio" name="ast-${est.id}" value="p" id="p-${est.id}" ${yaAsistioHoy ? 'disabled' : ''}>
                        <span class="radio-label">Asistió</span>
                    </label>
                    <label class="radio-asistencia falto ${yaAsistioHoy ? 'deshabilitado' : ''}">
                        <input type="radio" name="ast-${est.id}" value="f" id="f-${est.id}" ${yaAsistioHoy ? 'disabled' : 'checked'}>
                        <span class="radio-label">Faltó</span>
                    </label>
                </div>
                ${yaAsistioHoy ? '<div style="margin-top:5px; color:#2ecc71; font-size:12px; font-weight:bold;">✓ Registrado</div>' : ''}
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// ==========================================
// 3. LÓGICA DE GUARDADO Y PERSISTENCIA
// ==========================================
function guardarAsistencia() {
    const fechaSeleccionada = document.getElementById('fechaAsistencia').value;
    
    if (!fechaSeleccionada) {
        alert("Por favor, selecciona una fecha válida.");
        return;
    }

    // 1. Registrar la fecha en el historial del sistema (si es nueva)
    if (!fechasSistema.includes(fechaSeleccionada)) {
        fechasSistema.push(fechaSeleccionada);
    }

    let nuevasAsistencias = 0;

    // 2. Recorrer estudiantes y actualizar solo si marcaron "Asistió"
    estudiantes.forEach(est => {
        const radioPresente = document.getElementById(`p-${est.id}`);
        
        if (radioPresente && radioPresente.checked) {
            // Verificar que no se duplique la asistencia para el mismo día
            if (!est.fechas.includes(fechaSeleccionada)) {
                est.asistencias += 1;
                est.fechas.push(fechaSeleccionada);
                nuevasAsistencias++;
            }
        }
    });

    // 3. Guardar el objeto completo en LocalStorage
    localStorage.setItem('asistencias_db', JSON.stringify({
        estudiantes: estudiantes,
        fechasSistema: fechasSistema
    }));
    
    // 4. Actualizar la interfaz
    renderizarTabla();

    if (nuevasAsistencias > 0) {
        alert(`Se guardaron ${nuevasAsistencias} asistencias para el día ${fechaSeleccionada}`);
    } else {
        alert("La asistencia para esta fecha ya estaba registrada o no hubo nuevos asistentes.");
    }
}

// ==========================================
// 4. CONFIGURACIÓN INICIAL (AL CARGAR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const inputFecha = document.getElementById('fechaAsistencia');
    
    // Ponemos la fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.value = hoy;

    // Si el profe cambia la fecha en el calendario, la tabla se actualiza
    // para mostrar quién ya tiene asistencia en esa fecha específica
    inputFecha.addEventListener('change', renderizarTabla);
});