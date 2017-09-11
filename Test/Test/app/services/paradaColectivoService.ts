import express = require('express');
import mongoose = require('mongoose');

import posicionGPSService = require('./posicionGPSService');
import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import paradaColectivoRepository = require('../repositories/paradaColectivoRepository');

export async function crearParadaColectivo(linea: string, latitud: number, longitud: number, sentido: string) {
    let posicionGPS: IPosicionGPS = await posicionGPSService.crearPosicionGPS(latitud, longitud);
    let parada: IParadaColectivo = await paradaColectivoRepository.create(linea, posicionGPS, sentido);
    return parada;
}

export async function obtenerParadaColectivo(id: mongoose.Types.ObjectId): Promise<IParadaColectivo> {
    return await paradaColectivoRepository.obtenerParadaColectivo(id);
}

export async function obtenerParadasColectivo(): Promise<IParadaColectivo[]> {
    try {
        let paradas: IParadaColectivo[] = await paradaColectivoRepository.getAll();
        console.log('Se obtuvieron las posiciones desde el servicio');
        return paradas;
    } catch (error) {
         console.log('Error al obtener las paradas desde el servicio');
         return null;
    }
}

export async function eliminarParadasColectivos(): Promise<Boolean> {
    try {
        await paradaColectivoRepository.deleteAll();
        await posicionGPSService.eliminarPosicionesGPS();
        console.log('Se eliminaron las paradas de colectivo del repositorio');
        return true;
    } catch (error) {
        console.log('No se pudieron eliminar las paradas de colectivo del repositorio');
        return false;
    }
}