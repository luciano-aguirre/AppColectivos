import express = require('express');
//import bodyParser = require('body-parser');
//import request = require('request');
import posicionGPSRepository = require('../repositories/posicionGPSRepository');
import posicionGPSModel = require('../models/posicionGPSModel');

import IPosicionGPS = posicionGPSModel.IPosicionGPS;

/*
export async function cargarPosiciones(linea: number) {
    request(
        {
            method: 'GET',
            uri: 'http://api.datos.bahiablanca.gob.ar/api/v2/datastreams/PARAD-DE-COLEC/data.json/?auth_key=a049a7553f75ed50c8fab78b1685e7ac83c8d0a4&filter0=column0[==]' + linea
        }
        , async function (error, response, body) {
                   
            try {
                const dataJSON = JSON.parse(body);
                let paradas = dataJSON['result']['fArray'];//VER COMO TIPAR EL ARRAY
                let numeroParadas: number = 0;
                let posLatitud: number = 6;
                let posLongitud: number = 7;
                let posicionCreada: IPosicionGPS;
                    
                while (posLatitud < paradas.length && posLongitud < paradas.length) {
                    posicionCreada = await posicionGPSRepository.create(paradas[posLatitud]['fStr'], paradas[posLongitud]['fStr']);
                    ++numeroParadas;
                    if (posicionCreada != null) {
                        console.log('Parada ' + numeroParadas + ' creada');
                    }                        
                    posLatitud += 4;
                    posLongitud += 4;
                }
                console.log('Se cargaron ' + numeroParadas + ' de la linea ' + linea);
            } catch (e) {
                console.log('Error al cargar las posiciones');
                throw e;
            }
        });
}
*/

export async function crearPosicionGPS(latitud: number, longitud: number): Promise<IPosicionGPS> {

    let nuevaPosicionGPS: IPosicionGPS = await posicionGPSRepository.create(latitud, longitud);
    if (nuevaPosicionGPS != null) {
        console.log('Se creo correctamente una posicion');
    }
    else {
        console.log('Error al crear una posicion');
    }
    return nuevaPosicionGPS;
}

export async function obtenerPosicionesGPS(): Promise<IPosicionGPS[]> {
   
    let posicionesGPS: IPosicionGPS[] = await posicionGPSRepository.getAll();
    if (posicionesGPS != null) {
        console.log('Se obtuvieron las posiciones desde el servicio');
    } else {
        console.log('Posiciones null en el controlador');
    }
    return posicionesGPS;
}

export async function eliminarPosicionesGPS(): Promise<Boolean> {
   
    return await posicionGPSRepository.deleteAll();
}
