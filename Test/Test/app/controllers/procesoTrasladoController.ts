import express = require('express');
import mongoose = require('mongoose');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import procesoTrasladoService = require('../services/procesoTrasladoService');

export async function calcularTrayecto(req: express.Request, res: express.Response) {
    let origen: IPosicionGPS = req.body.origen;
    let destino: IPosicionGPS = req.body.destino;
    let trayecto: [string,IParadaColectivo,IParadaColectivo,number] = await procesoTrasladoService.calcularTrayecto(origen, destino);
    if (trayecto[3] == -1) {
        res.status(404).send('Error al calcular el trayecto');
    }
    else {
        res.status(200).send('El usuario debe caminar en total ' + trayecto[3] + ' metros usando la linea de colectivo ' + trayecto[0]);
    }
}