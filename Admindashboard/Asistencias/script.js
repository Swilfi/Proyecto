let estudiantes = []; 

async function cargarEstudiantesDesdeBD() {
    const anoEscolar = document.getElementById('selectAnoEscolar').value;
    const grado = document.getElementById('selectGrado').value;
    const seccion = document.getElementById('selectSeccion').value;
    const fecha = document.getElementById('fechaAsistencia').value;

    console.log("Cargando para:", { anoEscolar, grado, seccion, fecha }); 

    if (!anoEscolar || !grado || !seccion || !fecha) return;

    try {
        const url = `http://localhost:3000/api/obtener-estudiantes?ano_escolar=${encodeURIComponent(anoEscolar)}&grado=${encodeURIComponent(grado)}&seccion=${encodeURIComponent(seccion)}&fecha=${encodeURIComponent(fecha)}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        console.log("Datos crudos recibidos:", datos); 

        estudiantes = datos.map(est => ({
            id: est.id,
            nombre: `${est.nombre} ${est.apellido}`,
            iniciales: ((est.nombre ? est.nombre[0] : "") + (est.apellido ? est.apellido[0] : "")).toUpperCase(),
            asistencias: est.total_asistencias || 0,
            inasistencias: est.total_inasistencias || 0,
            registradoHoy: est.estado_hoy
        }));

        renderizarTabla(); 
    } catch (error) {
        console.error("Error al obtener datos:", error);
        document.getElementById('listaEstudiantes').innerHTML = `<tr><td colspan="4" style="color:red;">Error de conexión con el servidor</td></tr>`;
    }
}

function renderizarTabla() {
    const cuerpoTabla = document.getElementById('listaEstudiantes');
    const botonGuardar = document.querySelector('.btn-guardar-moderno');
    
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = ""; 

    if (estudiantes.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="4" class="text-center">No hay estudiantes registrados</td></tr>`;
        return;
    }

    estudiantes.forEach(est => {
        const yaRegistrado = est.registradoHoy !== null;

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
                <span class="badge-conteo badge-inasistencia-roja">${est.inasistencias}</span>
            </td>
            <td class="text-center">
                <div class="controles-asistencia">
                    <label class="radio-asistencia presente ${yaRegistrado ? 'deshabilitado' : ''}">
                        <input type="radio" name="ast-${est.id}" value="p" id="p-${est.id}" 
                            ${yaRegistrado && est.registradoHoy === 'Asistió' ? 'checked' : ''} 
                            ${yaRegistrado ? 'disabled' : ''}>
                        <span class="radio-label">Asistió</span>
                    </label>
                    <label class="radio-asistencia falto ${yaRegistrado ? 'deshabilitado' : ''}">
                        <input type="radio" name="ast-${est.id}" value="f" id="f-${est.id}" 
                            ${yaRegistrado && est.registradoHoy === 'Inasistente' ? 'checked' : (!yaRegistrado ? 'checked' : '')} 
                            ${yaRegistrado ? 'disabled' : ''}>
                        <span class="radio-label">Faltó</span>
                    </label>
                </div>
                ${yaRegistrado ? '<div style="margin-top:5px; color:#3db1ab; font-size:11px; font-weight:bold;">✓ REGISTRADO</div>' : ''}
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    if (botonGuardar) {
        const todosRegistrados = estudiantes.every(e => e.registradoHoy !== null);
        botonGuardar.disabled = todosRegistrados;
        botonGuardar.style.opacity = todosRegistrados ? "0.5" : "1";
        botonGuardar.innerHTML = todosRegistrados ? '<span>Asistencia Completada ✓</span>' : '<span>Guardar Asistencia del Día</span> <span class="icon">💾</span>';
    }
}

// NUEVA FUNCIÓN: Ahora sí el botón tendrá qué ejecutar
async function guardarAsistencia() {
    const fecha = document.getElementById('fechaAsistencia').value;
    
    // Filtrar solo los que NO están registrados para no duplicar en la BD
    const pendientes = estudiantes.filter(e => e.registradoHoy === null);

    if (pendientes.length === 0) return;

    const registros = pendientes.map(est => ({
        id_estudiante: est.id,
        estado_db: document.getElementById(`p-${est.id}`).checked ? 'Asistió' : 'Inasistente',
        observaciones: ""
    }));

    try {
        const respuesta = await fetch('http://localhost:3000/api/guardar-asistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha, registros })
        });

        if (respuesta.ok) {
            alert("Asistencia guardada correctamente");
            cargarEstudiantesDesdeBD(); // Recargar para bloquear botones
        } else {
            alert("Error al guardar");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputFecha = document.getElementById('fechaAsistencia');
    const selectGrado = document.getElementById('selectGrado');
    const selectSeccion = document.getElementById('selectSeccion');

    if (inputFecha) inputFecha.value = new Date().toISOString().split('T')[0];

    const selectAnoEscolar = document.getElementById('selectAnoEscolar');
    [selectAnoEscolar, selectGrado, selectSeccion, inputFecha].forEach(el => {
        if (el) el.addEventListener('change', cargarEstudiantesDesdeBD);
    });
});