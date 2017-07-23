import express = require('express');
import mongoose = require('mongoose');
import paradaColectivoModel = require('../models/paradaColectivoModel');
import posicionGPSModel = require('../models/posicionGPSModel');

import IParadaColectivo = paradaColectivoModel.IParadaColectivo;
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import repository = paradaColectivoModel.repository;

export async function create(linea: number, posicionGPS: IPosicionGPS, sentido: string): Promise<IParadaColectivo> {

    //CONTROLAR QUE SI EXISTE NO SE CREA DE VUELTAAAAAAAA
    //AGREGAR A  LA POSICION CUANTAS PARADAS LA REFERENCIAN

    return await repository.create({ linea: linea, posicion_id: posicionGPS._id, sentido: sentido });
}

export function obtenerParadaColectivo(_id: string): IParadaColectivo {

    let nuevaParada: IParadaColectivo;
    repository.findById(_id, (error, parada) => {
        if (error) {
            console.log('Error al recuperar una posicion por su id');
        }
        nuevaParada = parada;
    });
    return nuevaParada;
}

export async function getAll(): Promise<IParadaColectivo[]> {

    return await repository.find({}).populate({
        path: 'posicion_id',
        model: 'PosicionGPS'
    }).exec();
}

export async function deleteAll(): Promise<Boolean> {

    await repository.remove({}).exec();
    return true;
}