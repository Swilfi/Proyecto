document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filterToggle');
    const filterOptions = document.getElementById('filterOptions');
    const tableBody = document.querySelector('.orden-reciente table tbody');
    const filterButtons = document.querySelectorAll('.filter-option');
    let tableRows = [];

    const gradeMap = {
        'Primer Grado': '1°',
        'Segundo Grado': '2°',
        'Tercer Grado': '3°',
        'Cuarto Grado': '4°',
        'Quinto Grado': '5°',
        'Sexto Grado': '6°'
    };

    async function loadStudents() {
        const pageTitle = document.querySelector('.orden-reciente .header h2');
        const gradeLabel = pageTitle ? pageTitle.textContent.replace('Estudiantes ', '').trim() : '';
        const grado = gradeMap[gradeLabel] || '';
        const url = grado ? `http://localhost:3000/api/estudiantes?grado=${encodeURIComponent(grado)}` : 'http://localhost:3000/api/estudiantes';

        try {
            const response = await fetch(url);
            const students = await response.json();
            tableRows = students.map(student => ({
                nombre: student.nombre,
                apellido: student.apellido,
                seccion: student.seccion,
                ano_escolar: student.ano_escolar,
                cedula_rep: student.cedula_rep || 'Sin representante'
            }));
            renderTable();
        } catch (error) {
            console.error('Error cargando estudiantes:', error);
        }
    }

    function renderTable() {
        tableBody.innerHTML = tableRows.map(row => `
            <tr>
                <td>${row.nombre}</td>
                <td>${row.apellido}</td>
                <td>${row.seccion}</td>
                <td>${row.ano_escolar}</td>
                <td>${row.cedula_rep}</td>
            </tr>
        `).join('');
    }

    function sortTable(sortBy) {
        const sorted = [...tableRows].sort((a, b) => {
            if (sortBy === 'cedula') {
                return a.cedula_rep.localeCompare(b.cedula_rep, undefined, { numeric: true });
            }
            return a[sortBy].localeCompare(b[sortBy], undefined, { numeric: true });
        });
        tableRows = sorted;
        renderTable();
    }

    filterToggle.addEventListener('click', () => {
        filterOptions.classList.toggle('visible');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            sortTable(button.dataset.sort);
            filterOptions.classList.remove('visible');
        });
    });

    loadStudents();
});