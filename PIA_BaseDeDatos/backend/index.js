const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors'); // Importar el paquete cors
const bwipjs = require('bwip-js');
const app = express();
const port = 3027;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Imprimir la configuración de CORS
  
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON  

// Configuración de la conexión a SQL Server
const dbConfig = {
  server: 'DESKTOP-C75NA8M\\SQLEXPRESS',
  database: 'Eventos_UANL',
  options: {
    trustedConnection: true // Esto habilita la autenticación de Windows
  }
};

// Conexión a la base de datos
sql.connect(dbConfig).then(pool => {
  if (pool.connected) {
    console.log('Conexión a la base de datos exitosa');
  }

  // Endpoint para obtener datos
  app.get('/api/data', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM evento');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.get('/api/userInfo', async (req, res) => {
    try {
      const correo = req.query.correo; // Obtener el correo electrónico de la consulta
      if (!correo) {
        return res.status(400).json({ message: 'Correo no proporcionado' });
      }
      
      const result = await pool.request()
        .input('correo', sql.VarChar, correo)
        .query('SELECT * FROM participante WHERE correo = @correo');
      
      if (result.recordset.length > 0) {
        const userInfo = result.recordset[0]; // Obtener toda la información del primer resultado
        res.json(userInfo); // Enviar la información del usuario como respuesta
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.get('/api/getEventInfo', async (req, res) => {
    try {
      const id = req.query.eventId; // Obtener el correo electrónico de la consulta
      if (!id) {
        return res.status(400).json({ message: 'EventoId no proporcionado' });
      }
      
      const result = await pool.request()
        .input('eventId', sql.VarChar, id)
        .query('SELECT * FROM evento WHERE eventoId = @eventId');
      
      if (result.recordset.length > 0) {
        const eventInfo = result.recordset[0]; // Obtener toda la información del primer resultado
        res.json(eventInfo); // Enviar la información del evento como respuesta
      } else {
        res.status(404).json({ message: 'Evento no encontrado' });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  //Endpoints para agregar un nuevo participante
  app.post('/api/createUser', async(req, res) => {
    try {
        const { nombre, primerApellido, segundoApellido, correo, rolId, dependenciaId, afiliacion, contrasenia} = req.body;
        // Realiza la inserción en la base de datos
        const result = await pool.request()
          .input('nombre', sql.VarChar, nombre)
          .input('primerApellido', sql.VarChar, primerApellido)
          .input('segundoApellido', sql.VarChar, segundoApellido)
          .input('correo', sql.VarChar, correo)
          .input('rolId', sql.Int, rolId)
          .input('dependenciaId', sql.Int, dependenciaId)
          .input('afiliacion', sql.VarChar, afiliacion)
          .input('contrasenia', sql.VarChar, contrasenia)
          .query('INSERT INTO participante (nombre, primerApellido, segundoApellido, correo, rolId, dependenciaId, afiliacion, contrasenia) VALUES (@nombre, @primerApellido, @segundoApellido, @correo, @rolId, @dependenciaId, @afiliacion, @contrasenia)');
        res.json({ success: true, message: 'Participante creado exitosamente' });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
  })

  // Endpoint para crear un nuevo evento
  app.post('/api/evento', async (req, res) => {
    try {
      const { nombre, descripcion, ubicacion, fecha, dependenciaId, precio, numeroAsiento, categoriaId } = req.body;
      // Realiza la inserción en la base de datos
      const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('descripcion', sql.VarChar, descripcion)
        .input('ubicacion', sql.VarChar, ubicacion)
        .input('fecha', sql.DateTime, fecha)
        .input('dependenciaId', sql.Int, dependenciaId)
        .input('precio', sql.Decimal, precio)
        .input('numeroAsiento', sql.Int, numeroAsiento)
        .input('categoriaId', sql.Int, categoriaId)
        .query('INSERT INTO evento (nombre, descripcion, ubicacion, fecha, dependenciaId, precio, numeroAsiento, categoriaId) VALUES (@nombre, @descripcion, @ubicacion, @fecha, @dependenciaId, @precio, @numeroAsiento, @categoriaId)');
      res.json({ success: true, message: 'Evento creado exitosamente' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Endpoint para crear un nuevo boleto
  app.post('/api/createTicket', async (req, res) => {
    try {
      const { eventoId, userMail, precio } = req.body;
      
      // Paso 1: Obtener el participanteId basado en el correo electrónico
      const participanteResult = await pool.request()
        .input('correo', sql.VarChar, userMail)
        .query('SELECT participanteId FROM participante WHERE correo = @correo');

      if (participanteResult.recordset.length === 0) {
        return res.status(404).json({ success: false, message: 'Participante no encontrado' });
      }

      const participanteId = participanteResult.recordset[0].participanteId;
      
      // Paso 2: Generar un código de barras único
      const codigoDeBarras = await generateBarcode(eventoId, userMail);
      
      // Paso 3: Insertar el nuevo boleto en la tabla boleto
      const result = await pool.request()
        .input('eventoId', sql.Int, eventoId)
        .input('participanteId', sql.Int, participanteId)
        .input('codigoDeBarras', sql.VarChar, codigoDeBarras)
        .input('foto', sql.VarBinary, null) // Puedes cambiar esto si tienes una foto que subir
        .input('precio', sql.Money, precio)
        .query('INSERT INTO boleto (eventoId, participanteId, codigoDeBarras, foto, precio) VALUES (@eventoId, @participanteId, @codigoDeBarras, @foto, @precio)');
      
      // Enviar la respuesta con el boletoId generado
      res.json({ success: true, message: 'Boleto creado exitosamente', boletoId: result.recordset[0].boletoId });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });


  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});

async function generateBarcode(event, userEmail) {
    return new Promise((resolve, reject) => {
        const text = `${event}-${userEmail}`; // Concatenar el evento y el correo del usuario para formar el texto
        bwipjs.toBuffer({
            bcid: 'code128',       // Tipo de código de barras
            text: text,            // Texto a codificar
            scale: 3,              // Factor de escala 3x
            height: 10,            // Altura de la barra, en milímetros
            includetext: false,    // Mostrar texto legible por humanos
            textxalign: 'center',  // Centrar el texto
        }, function (err, png) {
            if (err) {
                reject(err);
            } else {
                // Convertir el buffer PNG a una cadena base64
                const base64 = Buffer.from(png).toString('base64');
                resolve(base64);
            }
        });
    });
}