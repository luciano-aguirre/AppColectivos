import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import request = require('request');

import paradaColectivoService = require('./paradaColectivoService');
import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import lineaColectivoModel = require('../models/lineaColectivoModel');
import ILineaColectivo = lineaColectivoModel.ILineaColectivo;

import lineaColectivoRepository = require('../repositories/lineaColectivoRepository');

export async function obtenerLineasColectivo(): Promise<ILineaColectivo[]> {
    try {
        let lineas: ILineaColectivo[] = await lineaColectivoRepository.getAll();
        console.log('Se obtuvieron las lineas de colectivo desde el servicio');
        return lineas;
    } catch (error) {
        console.log('Error al obtener las lineas de colectivo desde el servicio');
        return null;
    }
}

export async function actualizarLineasColectivo() {
    await eliminarLineasColectivo();
    console.log('Se eliminaron las lineas de colectivo de la BD');
    await cargarLineasColectivo();
    console.log('Se guardaron las lineas de colectivo en la BD');
}

async function cargarLineasColectivo() {
    let lineas: string[] = ['319', '500', '502', '503', '504', '505', '506', '507', '509', '512', '513', '514', '516', '517', '518', '519', '519 a'];

    lineas.forEach(async function (linea) {
        await cargarLineaColectivo(linea);
    });
}

async function cargarLineaColectivo(linea: string) {
    request(
        {
            method: 'GET',
            uri: 'http://api.datos.bahiablanca.gob.ar/api/v2/datastreams/PARAD-DE-COLEC/data.json/?auth_key=a049a7553f75ed50c8fab78b1685e7ac83c8d0a4&filter0=column0[==]' + linea
        }
        , async function (error, response, body) {

            try {
                const dataJSON = JSON.parse(body);
                let paradasJSON = dataJSON['result']['fArray'];
                let numeroParadas: number = 0;
                let posLatitud: number = 6;
                let posLongitud: number = 7;
                let posSentido: number = 9;

                let paradas: mongoose.Types.ObjectId[] = [];
                let nuevaParadaColectivo: IParadaColectivo;

                while (posLatitud < paradasJSON.length && posLongitud < paradasJSON.length && posSentido < paradasJSON.length) {
                    nuevaParadaColectivo = await paradaColectivoService.crearParadaColectivo(linea, paradasJSON[posLatitud]['fStr'], paradasJSON[posLongitud]['fStr'], paradasJSON[posSentido]['fStr']);
                    paradas.push(nuevaParadaColectivo._id);
                    ++numeroParadas;
                    posLatitud += 4;
                    posLongitud += 4;
                    posSentido += 4;
                }
                await lineaColectivoRepository.create(linea, paradas);

                console.log('Se cargaron ' + numeroParadas + ' de la linea ' + linea);
            } catch (e) {
                console.log('Error al cargar las paradas');
                throw e;
            }
        });
}

async function eliminarLineasColectivo(): Promise<Boolean> {
    try {
        await lineaColectivoRepository.deleteAll();
        await paradaColectivoService.eliminarParadasColectivos();
        console.log('Se eliminaron las lineas de colectivo del repositorio');
        return true;
    } catch (error) {
        console.log('No se pudieron eliminar las lineas de colectivo del repositorio');
        return false;
    }
}