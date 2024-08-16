let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');


// Importa las rutas de la API y la configuración de la base de datos
const api = require('./routes/images.routes');
const dbConfig = require('./database/db.config');

// Configura Mongoose para utilizar Promesas globales
mongoose.Promise = global.Promise;
// Desactiva la advertencia de consulta estricta en Mongoose
mongoose.set("strictQuery", false);
//mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`);
// Conecta a la base de datos de MongoDB utilizando una cadena de conexión (en este caso, a MongoDB Atlas)
mongoose.connect('mongodb+srv://r60jZirgWGQpuqMH:r60jZirgWGQpuqMH@cluster0.30yfs2v.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log("API user_image: Conectando a atlas..."); // Mensaje de éxito si la conexión es exitosa
}).catch((error)=>{
    console.log(error);  // Muestra un mensaje de error si la conexión falla
})

// Crea una instancia de la aplicación Express
const app = express();
// Configura el middleware bodyParser para analizar el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true}));  // Analiza datos codificados en URL
app.use(bodyParser.json());                         // Analiza datos en formato JSON

// Configura los encabezados de respuesta para permitir CORS desde https://localhost:3001
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001'); // Permite solicitudes desde esta URL específica
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'); // Permite estos encabezados en las solicitudes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Permite estos métodos HTTP
    res.setHeader('Access-Control-Allow-Credentials', true); // Permite el uso de credenciales en las solicitudes

    // Pass to next layer of middleware
    next();
})
app.use(cors()); // Habilita CORS para todas las rutas
app.use('/public', express.static('public')); // Configura una ruta estática para servir archivos públicos
app.use('/api', api) // Configura las rutas de la API bajo el prefijo '/api'
const port = process.env.PORT || 4000; // Define el puerto en el que la aplicación escuchará las solicitudes
// Inicia el servidor y escucha en el puerto especificado
const server = app.listen(port, () => {
    console.log('Conectado en el puerto ' + port) // Muestra un mensaje cuando el servidor está listo
})
// Middleware para manejar errores asíncronos
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Algo salio mal')); // Genera un error y lo pasa al siguiente middleware de manejo de errores
    });
});
// Middleware para manejar errores generales
app.use(function(err, req, res,next) {
    console.error(err.message);  // Muestra el mensaje de error en la consola
    if(!err.statusCode) err.statusCode = 500;  // Establece el código de estado a 500 si no se especifica otro
    res.status(err.statusCode).send(err.message);  // Envía el mensaje de error al cliente con el código de estado adecuado
})