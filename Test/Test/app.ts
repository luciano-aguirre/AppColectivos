﻿import bodyParser = require('body-parser');
import debug = require('debug');
import express = require('express');
import path = require('path');
import mongoose = require('mongoose');

import routes from './app/routes/index';
import posicionGPS = require('./app/routes/posicionGPSRoutes');
import paradaColectivo = require('./app/routes/paradaColectivoRoutes');
import lineaColectivo = require('./app/routes/lineaColectivoRoutes');

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

app.use('/', routes);
//app.use('/users', users);

app.get('/posicionesGPS', posicionGPS.obtenerPosicionesGPS);
app.get('/paradasColectivo', paradaColectivo.obtenerParadasColectivo);
app.get('/lineasColectivos', lineaColectivo.obtenerLineasColectivo);
app.delete('/lineasColectivos', lineaColectivo.eliminarLineasColectivo);
app.post('/lineasColectivos/:linea', lineaColectivo.cargarLineaColectivo);

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
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
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