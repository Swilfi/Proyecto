function switchPage(num) {
            document.getElementById('page1').classList.toggle('active', num === 1);
            document.getElementById('page2').classList.toggle('active', num === 2);
            document.getElementById('btn-t1').classList.toggle('active', num === 1);
            document.getElementById('btn-t2').classList.toggle('active', num === 2);
            document.getElementById('controls-p1').style.display = num === 1 ? 'block' : 'none';
            document.getElementById('controls-p2').style.display = num === 2 ? 'block' : 'none';
        }

        function actualizar() {
            document.getElementById('out-nombre').innerText = document.getElementById('in-nombre').value || "____________________";
            document.getElementById('out-docente').innerText = document.getElementById('in-docente').value || "____________________";
            document.getElementById('out-periodo').innerText = document.getElementById('in-periodo').value;
            document.getElementById('out-momento').innerHTML = document.getElementById('in-momento').value;
            document.getElementById('out-proyectos').innerText = document.getElementById('in-proyectos').value;
            const infoText = document.getElementById('in-informe').value;
            document.getElementById('out-informe').innerText = infoText;
            document.getElementById('char-count').innerText = `${infoText.length} / 2000`;
            document.getElementById('out-faltas').innerText = document.getElementById('in-faltas').value || "0";
            document.getElementById('out-recom').innerText = document.getElementById('in-recom').value;
        }

        function descargarPDF() {
            const p1 = document.getElementById('page1');
            const p2 = document.getElementById('page2');
            const nombre = document.getElementById('in-nombre').value || 'Boletin';

            p1.style.display = 'flex';
            p2.style.display = 'flex';

            const opt = {
                margin: 0,
                filename: `Boletin_${nombre}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: 'css', after: '.hoja-a4' }
            };

            html2pdf().set(opt).from(document.getElementById('boleta-completa')).save().then(() => {
                p1.style.display = '';
                p2.style.display = '';
                switchPage(1);
            });
        }