import express = require('express');
import mongoose = require('mongoose');
import posicionGPSModel = require('../models/posicionGPSModel');

import IPosicionGPS = posicionGPSModel.IPosicionGPS;
import repository = posicionGPSModel.repository;

export async function create(latitud: number, longitud: number): Promise<IPosicionGPS> {
    try {
        //Si existe una posicion GPS con esa latitud y longitud la devuelve, en caso contrario la crea
        let posicionGPS: IPosicionGPS = await repository.findOne({ latitud: latitud, longitud: longitud }).exec();
        if (posicionGPS == null) {
            posicionGPS = await repository.create({ latitud: latitud, longitud: longitud });
        }
        else {
            console.log('Se reutiliza posicionGPS con ID ' + posicionGPS._id);
        }
        return posicionGPS;
    } catch (error) {
        console.log('No se pudo crear una posicion en el repositorio');
        return null;
    }
}

export async function obtenerPosicionGPS(_id: string): Promise<IPosicionGPS>{

    let nuevaPosicionGPS: IPosicionGPS = await repository.findById(_id).exec();

    return nuevaPosicionGPS;
}

export async function getAll(): Promise<IPosicionGPS[]> {
    try {
        let posicionesGPS: IPosicionGPS[] = await repository.find({}).exec();
        console.log('Se obtuvieron las posiciones desde el repositorio');
        return posicionesGPS;
    } catch (error) {
        console.log('Error al obtener las paradas desde el repositorio');
        return null;
    }
}

export async function deleteAll(): Promise<Boolean> {
    try {
        await repository.remove({}).exec();
        return true;
    } catch (error) {
        return false;
    }
}