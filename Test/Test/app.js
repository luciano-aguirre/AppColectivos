"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const debug = require("debug");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const index_1 = require("./app/routes/index");
const lineaColectivo = require("./app/routes/lineaColectivoRoutes");
const procesoTraslado = require("./app/routes/procesoTrasladoRoutes");
mongoose.connect('mongodb://localhost/lineasColectivo');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
// configure app to use bodyParser()
// this will let us get response data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index_1.default);
//app.use('/users', users);
//app.get('/posicionesGPS', posicionGPS.obtenerPosicionesGPS);
//app.get('/paradasColectivo', paradaColectivo.obtenerParadasColectivo);
app.get("/numerosLineasColectivo", lineaColectivo.obtenerNumerosLineasColectivo);
app.get('/lineasColectivo', lineaColectivo.obtenerLineasColectivo);
app.get('/lineasColectivo/:linea', lineaColectivo.obtenerLineaColectivo);
app.post('/actualizarLineasColectivo', lineaColectivo.actualizarLineasColectivo);
//USAR POST O GET
app.post('/calcularTrayecto', procesoTraslado.calcularTrayecto);
app.get('/test', procesoTraslado.conexionServidor);
//app.delete('/lineasColectivo', lineaColectivo.eliminarLineasColectivo);
//app.post('/lineasColectivo', lineaColectivo.cargarLineaColectivo);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//app.set('port', process.env.PORT || 3000);
app.set('port', 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map