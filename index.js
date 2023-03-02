let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');

const api = require('./routes/images.routes');
const dbConfig = require('./database/db.config');

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`);

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})
app.use(cors());
app.use('/public', express.static('public'));
app.use('/api', api)
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Conectado en el puerto ' + port)
})
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Algo salio mal'));
    });
});
app.use(function(err, req, res,next) {
    console.error(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})