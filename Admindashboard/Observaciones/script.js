// script.js — maneja el formulario de observaciones y almacenamiento local
(function(){
    const studentSelect = document.getElementById('studentSelect');
    const form = document.getElementById('observacionForm');
    const descripcion = document.getElementById('descripcion');
    const observacionesContainer = document.getElementById('observacionesContainer');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const gradeFilterEl = document.getElementById('gradeFilter');
    const clearGradeBtn = document.getElementById('clearGrade');

  // Fuente de estudiantes: intenta leer de localStorage 'students', sino usa ejemplos.
    const sampleStudents = [
    {id: 's1', name: 'Ana Pérez', grado: '1'},
    {id: 's2', name: 'Luis Gómez', grado: '2'},
    {id: 's3', name: 'María Rodríguez', grado: '3'}
    ];

    function getCurrentGradeFilter(){
      return gradeFilterEl && gradeFilterEl.value ? gradeFilterEl.value : '';
    }

    async function loadStudents(){
    const endpoints = ['/api/estudiantes', 'http://localhost:3000/api/estudiantes'];
    const grado = getCurrentGradeFilter();
    // limpia opciones previas (deja el placeholder)
    studentSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    const statusEl = document.getElementById('studentStatus');
    if(statusEl){ statusEl.textContent = 'Cargando estudiantes...'; statusEl.className = 'status'; }
    try{
        let res;
        try{
        const q = grado ? `?grado=${encodeURIComponent(grado)}` : '';
        console.debug('Trying endpoint', endpoints[0] + q);
        res = await fetch(endpoints[0] + q);
        if(!res.ok) throw new Error('bad status');
        }catch(_){
        console.debug('Falling back to', endpoints[1]);
        const q = grado ? `?grado=${encodeURIComponent(grado)}` : '';
        res = await fetch(endpoints[1] + q);
        if(!res.ok) throw new Error('bad status');
        }
        const data = await res.json();
        let students = (Array.isArray(data) ? data : []).map(s => ({
        id: s.id || s.ID || s.codigo || '',
        name: `${s.nombre || s.name || ''} ${s.apellido || ''}`.trim() || (s.nombre_completo || s.fullName || 'Estudiante'),
        grado: s.grado || s.grade || ''
        }));
        if(grado){
        students = students.filter(s => String(s.grado) === String(grado));
        }
        if(students.length === 0) throw new Error('no students');
        populateStudentSelect(students);
        if(statusEl){ statusEl.textContent = `Cargados ${students.length} estudiantes`; statusEl.className = 'status ok'; }
        try{ localStorage.setItem('students', JSON.stringify(students)); }catch(e){}
    }catch(err){
        console.error('Error cargando estudiantes:', err);
        if(statusEl){ statusEl.textContent = 'No se pudieron cargar estudiantes desde el servidor, usando datos locales.'; statusEl.className = 'status error'; }
      // fallback a localStorage o muestra ejemplos
        try{
        const raw = localStorage.getItem('students');
        let students = raw ? JSON.parse(raw) : sampleStudents;
        if(grado){
            students = students.filter(s => String(s.grado) === String(grado));
        }
        populateStudentSelect(students);
        }catch(e){
        const students = sampleStudents.filter(s => !grado || String(s.grado) === String(grado));
        populateStudentSelect(students);
        }
    }
    }

    function populateStudentSelect(students){
    students.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        if(s.grado){
        opt.dataset.grade = s.grado;
        }
        studentSelect.appendChild(opt);
    });
    }

  // grade filter listeners
    if(gradeFilterEl){
    gradeFilterEl.addEventListener('change', function(){ loadStudents(); renderObservaciones(); });
    }
    if(clearGradeBtn){
    clearGradeBtn.addEventListener('click', function(){ if(gradeFilterEl){ gradeFilterEl.value = ''; loadStudents(); renderObservaciones(); } });
    }

    function getObservaciones(){
    const raw = localStorage.getItem('observaciones');
    return raw ? JSON.parse(raw) : [];
    }

    function saveObservaciones(list){
    localStorage.setItem('observaciones', JSON.stringify(list));
    }

    function renderObservaciones(){
    const filterGrade = getCurrentGradeFilter();
    let list = getObservaciones();
    if(filterGrade){
        list = list.filter(obs => String(obs.grado) === String(filterGrade));
    }
    observacionesContainer.innerHTML = '';
    if(!list.length){
        observacionesContainer.innerHTML = `<p class="empty">No hay observaciones${filterGrade ? ' para el grado ' + escapeHtml(filterGrade) : ''} registradas.</p>`;
        return;
    }
    list.slice().reverse().forEach(obs => {
        const el = document.createElement('div');
        el.className = 'obs-item';
        el.innerHTML = `
        <div class="obs-meta">
            <strong>${escapeHtml(obs.studentName)}</strong>
            ${obs.grado ? `<span class="grade-label">Grado ${escapeHtml(obs.grado)}</span>` : ''}
            <span class="tag ${obs.tipo === 'Positiva' ? 'pos' : 'neg'}">${obs.tipo}</span>
            <small class="date">${new Date(obs.date).toLocaleString()}</small>
        </div>
        <p class="obs-desc">${escapeHtml(obs.descripcion)}</p>
        <div class="obs-actions"><button data-id="${obs.id}" class="delete">Eliminar</button></div>
        `;
        observacionesContainer.appendChild(el);
    });
    }

    function escapeHtml(str){
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    form.addEventListener('submit', function(e){
    e.preventDefault();
    const studentId = studentSelect.value;
    if(!studentId) return alert('Seleccione un estudiante.');
    const tipo = form.tipo.value;
    const desc = descripcion.value.trim();
    if(!desc) return alert('Agregue una descripción.');

    const studentName = studentSelect.options[studentSelect.selectedIndex].text;
    const studentGrade = studentSelect.options[studentSelect.selectedIndex].dataset.grade || getCurrentGradeFilter() || '';
    const obs = {
        id: 'o_' + Date.now(),
        studentId: studentId,
        studentName: studentName,
        grado: studentGrade,
        tipo: tipo,
        descripcion: desc,
        date: new Date().toISOString()
    };

    const list = getObservaciones();
    list.push(obs);
    saveObservaciones(list);
    renderObservaciones();
    form.reset();
    studentSelect.value = '';
    alert('Observación agregada.');
    });

    limpiarBtn.addEventListener('click', function(){
    if(confirm('¿Limpiar todos los campos?')) form.reset();
    });

    observacionesContainer.addEventListener('click', function(e){
    if(e.target.matches('button.delete')){
        const id = e.target.getAttribute('data-id');
        if(!confirm('Eliminar esta observación?')) return;
        let list = getObservaciones();
        list = list.filter(x => x.id !== id);
        saveObservaciones(list);
        renderObservaciones();
    }
    });

  // Init
    loadStudents();
    renderObservaciones();

})();
