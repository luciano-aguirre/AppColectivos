import express = require('express');
import mongoose = require('mongoose');

export var posicionGPSSchema = new mongoose.Schema({
    latitud: Number,
    longitud: Number
});

export interface IPosicionGPS extends mongoose.Document {
    latitud: Number,
    longitud: Number
}
//VER CUANDO USAR Number o number

export enum TipoPunto { foot = 0, bus = 1 };

export interface IPuntoTrayecto {
    latitude: Number,
    longitude: Number,
    mode: TipoPunto
}

export var repository = mongoose.model<IPosicionGPS>('PosicionGPS', posicionGPSSchema);