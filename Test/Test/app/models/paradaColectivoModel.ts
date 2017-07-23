import express = require('express');
import mongoose = require('mongoose');
import posicionGPSModel = require('./posicionGPSModel'); 

import IPosicionGPS = posicionGPSModel.IPosicionGPS;


export var paradaColectivoSchema = new mongoose.Schema({
    linea: Number,
    posicion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PosicionGPS' },
    sentido: String
});

export interface IParadaColectivo extends mongoose.Document {
    linea: Number,
    posicion_id: mongoose.Types.ObjectId,
    sentido: String
}

export var repository = mongoose.model<IParadaColectivo>('ParadaColectivo', paradaColectivoSchema);