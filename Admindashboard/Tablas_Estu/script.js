document.addEventListener('DOMContentLoaded', () => {
            const filterToggle = document.getElementById('filterToggle');
            const filterOptions = document.getElementById('filterOptions');
            const tableBody = document.querySelector('.orden-reciente table tbody');
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            filterToggle.addEventListener('click', () => {
                filterOptions.classList.toggle('visible');
            });

            document.querySelectorAll('.filter-option').forEach(button => {
                button.addEventListener('click', () => {
                    sortTable(button.dataset.sort);
                    filterOptions.classList.remove('visible');
                });
            });

            function sortTable(sortBy) {
                const indexMap = {
                    nombre: 0,
                    apellido: 1,
                    cedula: 4
                };

                const index = indexMap[sortBy];
                const sortedRows = rows.slice().sort((a, b) => {
                    const aText = a.children[index].textContent.trim().toLowerCase();
                    const bText = b.children[index].textContent.trim().toLowerCase();
                    if (sortBy === 'cedula') {
                        return aText.localeCompare(bText, undefined, { numeric: true });
                    }
                    return aText.localeCompare(bText);
                });

                tableBody.innerHTML = '';
                sortedRows.forEach(row => tableBody.appendChild(row));
            }
        });