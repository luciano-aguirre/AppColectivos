import express = require('express');
import mongoose = require('mongoose');
import paradaColectivoModel = require('./paradaColectivoModel');

import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

export var lineaColectivoSchema = new mongoose.Schema({
    linea: String,
    paradas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PosicionGPS' }],
    cantidadParadas: Number
});

export interface ILineaColectivo extends mongoose.Document {
    linea: String,
    paradas: [mongoose.Types.ObjectId],
    cantidadParadas: Number
}

export var repository = mongoose.model<ILineaColectivo>('LineaColectivo', lineaColectivoSchema);