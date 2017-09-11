import express = require('express');
import mongoose = require('mongoose');
//import bodyParser = require('body-parser');
//import request = require('request');
import posicionGPSRepository = require('../repositories/posicionGPSRepository');
import posicionGPSModel = require('../models/posicionGPSModel');

import IPosicionGPS = posicionGPSModel.IPosicionGPS;

export async function crearPosicionGPS(latitud: number, longitud: number): Promise<IPosicionGPS> {

    return await posicionGPSRepository.create(latitud, longitud);
}

export async function obtenerPosicionGPS(id: mongoose.Types.ObjectId): Promise<IPosicionGPS> {

    return await posicionGPSRepository.obtenerPosicionGPS(id);
}

export async function obtenerPosicionesGPS(): Promise<IPosicionGPS[]> {
   
    return await posicionGPSRepository.getAll();
}

export async function eliminarPosicionesGPS(): Promise<Boolean> {
   
    return await posicionGPSRepository.deleteAll();
}
