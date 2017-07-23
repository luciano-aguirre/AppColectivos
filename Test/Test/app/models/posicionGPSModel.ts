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

export var repository = mongoose.model<IPosicionGPS>('PosicionGPS', posicionGPSSchema);