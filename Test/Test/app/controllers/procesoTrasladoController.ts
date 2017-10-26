import express = require('express');
import mongoose = require('mongoose');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import caminoModel = require('../models/caminoModel');
import ICamino = caminoModel.ICamino;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import procesoTrasladoService = require('../services/procesoTrasladoService');

export async function calcularTrayecto(req: express.Request, res: express.Response) {
    let origen: IPosicionGPS = req.body.origen;
    let destino: IPosicionGPS = req.body.destino;

    let caminos: ICamino[] = await procesoTrasladoService.calcularTrayecto(origen, destino);
    res.status(200).send(caminos);
}

export function conexionServer(req: express.Request, res: express.Response) {
    let a = {} as IPosicionGPS;
    a.latitud = -38.707436;
    a.longitud = -62.273351;
    res.status(200).send(a);
}