import express = require('express');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import paradaColectivoService = require('../services/paradaColectivoService');

export async function obtenerParadasColectivo(req: express.Request, res: express.Response) {
    
    let paradas: IParadaColectivo[] = await paradaColectivoService.obtenerParadasColectivo();
    if (paradas != null) {
        res.status(200).json(paradas);
    } else {
        res.status(400).send('Error al obtener las paradas en el controlador');
    }
}

export async function eliminarParadasColectivo(req: express.Request, res: express.Response) {

    let resultado: Boolean = await paradaColectivoService.eliminarParadasColectivos();
    if (resultado) {
        res.status(200).send('Se eliminaron las paradas de la BD');
    } else {
        res.status(400).send('No se eliminaron las paradas de la BD');
    }
}