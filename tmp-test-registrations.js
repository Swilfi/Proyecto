const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(response) });
        } catch (err) {
          resolve({ status: res.statusCode, body: response });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const prof = await post('http://localhost:3000/api/profesores', {
      nombre: 'Luis',
      apellido: 'Martinez',
      cedula: 'V77777777',
      telefono: '04141230000',
      email: 'luis@colegio.com',
      cargo: 'Docente',
      grado: '1°',
      seccion: 'A'
    });
    console.log('Profesor:', prof);

    const estudiante = await post('http://localhost:3000/api/estudiantes', {
      nombre: 'Marta',
      apellido: 'Diaz',
      fecha_nacimiento: '2012-06-10',
      direccion: 'Av Principal 10',
      cedula: 'V55555555',
      cedula_representante: null
    });
    console.log('Estudiante:', estudiante);
  } catch (error) {
    console.error('Error testing registration:', error);
  }
})();