import express = require('express');

import lineaColectivoModel = require('../models/lineaColectivoModel');
import ILineaColectivo = lineaColectivoModel.ILineaColectivo;

import lineaColectivoService = require('../services/lineaCOlectivoService');

export async function obtenerLineasColectivo(req: express.Request, res: express.Response) {
    try {
        let lineas: ILineaColectivo[] = await lineaColectivoService.obtenerLineasColectivo();
        res.status(200).json(lineas);
    } catch (error) {
        res.status(400).send('Error al obtener las lineas de colectivo');
        console.log(error);
    }
}

export async function obtenerLineaColectivo(req: express.Request, res: express.Response) {
    try {
        let nroLinea: string = req.params.linea;
        let linea: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(nroLinea);
        res.status(200).json(linea);
    } catch (error) {
        res.status(400).send('Error al obtener la linea de colectivo');
        console.log(error);
    }
}

export async function actualizarLineasColectivo(req: express.Request, res: express.Response) {
    try {
        await lineaColectivoService.actualizarLineasColectivo();
        res.status(200).send('Se actualizaron las lineas de colectivo en la BD'); 
    } catch (error) {
        res.status(400).send('Error al actualizar las lineas de colectivo de la BD');
        console.log(error);
    }
}
/*
export async function cargarLineasColectivo(req: express.Request, res: express.Response) {
    
    try {
        await lineaColectivoService.cargarLineasColectivo();
        res.status(200).send('Se cargaron todas las lineas de colectivo');

    } catch (error) {
        res.status(400).send('Error al cargar las lineas de colectivo');
    }
}
*/
/*
export async function eliminarLineasColectivo(req: express.Request, res: express.Response) {

    let resultado: Boolean = await lineaColectivoService.eliminarLineasColectivo();
    if (resultado) {
        res.status(200).send('Se eliminaron las lineas de colectivo de la BD');
    } else {
        res.status(400).send('No se eliminaron las lineas de colectivo de la BD');
    }
}
*/