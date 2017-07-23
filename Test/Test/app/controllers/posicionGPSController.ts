import express = require('express');
import posicionGPSModel = require('../models/posicionGPSModel');
import posicionGPSService = require('../services/posicionGPSService');

import IPosicionGPS = posicionGPSModel.IPosicionGPS;

/*
export function obtenerPosicionGPS(req: express.Request, res: express.Response) {

    let posicionGPSID: string = req.params.id;
    let posicionGPS: IPosicionGPS = posicionesGPSRepository.obtenerPosicionGPS(posicionGPSID);

    if (posicionGPS == null) {
        res.send('No se pudo recuperar la posicion especificada');
    } else {
        res.send('Posicion GPS ID: ' + posicionGPS.id + ' (' + posicionGPS.latitud + ',' + posicionGPS.longitud + ')');
    }
}
*/

export async function obtenerPosicionesGPS(req: express.Request, res: express.Response) {

    let posicionesGPS: IPosicionGPS[] = await posicionGPSService.obtenerPosicionesGPS();
    if (posicionesGPS != null) {
        res.status(200).json(posicionesGPS);
    } else {
        res.status(400).send('Posiciones null en el controlador');
    }
}

/*
export async function cargarPosicionesGPS(req: express.Request, res: express.Response) {

    let linea: number = req.params.linea;
    try {        
        await posicionGPSService.cargarPosiciones(linea);
        res.status(200).send('Se cargaron las paradas de la linea ' + linea);

    } catch (error) {
        res.status(400).send('Error al cargar las posiciones de la linea ' + linea);
    }
}*/

//https://nodejs.org/api/http.html#http_class_http_incomingmessage
    //https://github.com/request/request#requestoptions-callback
    //https://github.com/francotripi/Proyecto-Final-IAW-2015-Colectivos/blob/master/Cliente/modules/map.js


export async function eliminarPosicionesGPS(req: express.Request, res: express.Response) {
  
    let resultado: Boolean = await posicionGPSService.eliminarPosicionesGPS();
    if (resultado) {
        res.status(200).send('Se borro la BD');
    } else {
        res.status(400).send('Eliminar la BD no dio error, dio falso');
    }
}