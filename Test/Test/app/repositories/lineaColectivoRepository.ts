import express = require('express');
import mongoose = require('mongoose');
import lineaColectivoModel = require('../models/lineaColectivoModel');
import paradaColectivoModel = require('../models/paradaColectivoModel');
import posicionGPSModel = require('../models/posicionGPSModel');

import ILineaColectivo = lineaColectivoModel.ILineaColectivo;
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import repositoryLineaColectivo = lineaColectivoModel.repository;
import repositoryParadasColectivo = paradaColectivoModel.repository;

export async function create(linea: string, paradas: mongoose.Types.ObjectId[]): Promise<ILineaColectivo> {

    return await repositoryLineaColectivo.create({ linea: linea, paradas: paradas, cantidadParadas: paradas.length });

}

export async function getByLinea(linea: string): Promise<ILineaColectivo> {
    return await repositoryLineaColectivo.findOne({ linea: linea }).populate({
        path: 'paradas',
        model: 'ParadaColectivo',
        populate: {
            path: 'posicion_id',
            model: 'PosicionGPS'
        }
    }).exec();
}

export async function getAll(): Promise<ILineaColectivo[]> {
    //http://techqa.info/programming/question/32174803/mongoose-two-level-population-using-keystonejs

    return await repositoryLineaColectivo.find({}).populate({
        path: 'paradas',
        model: 'ParadaColectivo',
        populate: {
            path: 'posicion_id',
            model: 'PosicionGPS'
        }
    }).exec();
}


export async function deleteAll(): Promise<Boolean> {

    await repositoryLineaColectivo.remove({}).exec();
    return true;
}