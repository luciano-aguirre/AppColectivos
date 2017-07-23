import express = require('express');
//import bodyParser = require('body-parser');
//import request = require('request');

import posicionGPSService = require('./posicionGPSService');
import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import paradaColectivoRepository = require('../repositories/paradaColectivoRepository');

/*
export async function cargarParadasColectivo(linea: number) {
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
                let posSentido: number = 9;
                let nuevaPosicionGPS: IPosicionGPS;
                let nuevaParadaColectivo: IParadaColectivo;

                while (posLatitud < paradas.length && posLongitud < paradas.length && posSentido < paradas.length) {
                    nuevaPosicionGPS = await posicionGPSService.crearPosicionGPS(paradas[posLatitud]['fStr'], paradas[posLongitud]['fStr']);
                    ++numeroParadas;
                    //VER POSIBLE ERROR SI PASARA
                    nuevaParadaColectivo = await paradaColectivoRepository.create(linea, nuevaPosicionGPS, paradas[posSentido]['fStr']);
                    if (nuevaParadaColectivo != null) {
                        console.log('Parada ' + numeroParadas + ' creada');
                    }
                    posLatitud += 4;
                    posLongitud += 4;
                    posSentido += 4;
                }
                console.log('Se cargaron ' + numeroParadas + ' de la linea ' + linea);
            } catch (e) {
                console.log('Error al cargar las paradas');
                throw e;
            }
        });
}
*/

export async function crearParadaColectivo(linea: number, latitud: number, longitud: number, sentido: string) {
    let posicionGPS: IPosicionGPS = await posicionGPSService.crearPosicionGPS(latitud, longitud);
    let parada: IParadaColectivo = await paradaColectivoRepository.create(linea, posicionGPS, sentido);
    return parada;
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