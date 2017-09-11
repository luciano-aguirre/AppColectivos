import express = require('express');
import mongoose = require('mongoose');
var req = require('requisition');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;

import paradaColectivoModel = require('../models/paradaColectivoModel');
import IParadaColectivo = paradaColectivoModel.IParadaColectivo;

import lineaColectivoModel = require('../models/lineaColectivoModel');
import ILineaColectivo = lineaColectivoModel.ILineaColectivo;

import posicionGPSService = require('../services/posicionGPSService');
import paradaColectivoService = require('../services/paradaColectivoService');
import lineaColectivoService = require('../services/lineaColectivoService');


async function calcularDistancia(origen: IPosicionGPS, destino: IPosicionGPS): Promise<number> {

   /* const res = await req('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origen.latitud + ',' + origen.longitud + '&destinations=' + destino.latitud + ',' + destino.longitud + '&mode=walking&key=AIzaSyAa1HcCYyNcWztCG9e6O83cgGg6tpHic_w');
    const dataJSON = await res.json();
    return dataJSON['rows'][0]['elements'][0]['distance']['value'];*/

    const res = await req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud);
    const dataJSON = await res.json();
    let distancia = dataJSON['routes'][0]['distance'];
    return Math.round(distancia);
    
}
/*
async function paradaMasCercana(linea: ILineaColectivo, posicion: IPosicionGPS): Promise<[IParadaColectivo,number]> {
    let res: [IParadaColectivo, number] = [null, -1];

    for (let i: number = 0; i < linea.cantidadParadas; i++) {
        let parada: IParadaColectivo = await paradaColectivoService.obtenerParadaColectivo(linea.paradas[i]);
        let posicionParada: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(parada.posicion_id);
        let distanciaParada: number = await calcularDistancia(posicion, posicionParada);
        if (res[0] == null || distanciaParada < res[1]) {
            res = [parada, distanciaParada];
        }
    }

    return res;    
}*/

async function paradasMasCercanas(linea: ILineaColectivo, origen: IPosicionGPS, destino: IPosicionGPS): Promise<[IParadaColectivo, IParadaColectivo, number]> {
    let resOrigen: [IParadaColectivo, number] = [null, -1];
    let resDestino: [IParadaColectivo, number] = [null, -1];

    for (let i: number = 0; i < linea.cantidadParadas; i++) {
        let parada: IParadaColectivo = await paradaColectivoService.obtenerParadaColectivo(linea.paradas[i]);
        let posicionParada: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(parada.posicion_id);

        let distanciaParadaOrigen: number = await calcularDistancia(origen, posicionParada);
        if (resOrigen[0] == null || distanciaParadaOrigen < resOrigen[1]) {
            resOrigen = [parada, distanciaParadaOrigen];
        }

        let distanciaParadaDestino: number = await calcularDistancia(destino, posicionParada);
        if (resDestino[0] == null || distanciaParadaDestino < resDestino[1]) {
            resDestino = [parada, distanciaParadaDestino];
        }
    }

    return [resOrigen[0], resDestino[0], resOrigen[1] + resDestino[1]];
}


export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<[string,IParadaColectivo,IParadaColectivo,number]> {

    let res: [string,IParadaColectivo, IParadaColectivo, number] = ["",null, null, -1];
 
    let lineas: ILineaColectivo[] = await lineaColectivoService.obtenerLineasColectivo();

    for (let i: number = 0; i < lineas.length; i++) {
        let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(lineas[i].linea);
        let resLinea: [IParadaColectivo, IParadaColectivo, number] = await paradasMasCercanas(lineaColectivo, origen, destino);
      //  let calculoOrigen: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, origen);
      //  let calculoDestino: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, destino);
      //  let distanciaCaminada: number = calculoOrigen[1] + calculoDestino[1];

        if (res[3] == -1 || resLinea[2] < res[3]) {
            res = [lineas[i].linea.valueOf(), resLinea[0], resLinea[1], resLinea[2]];
        }
      //  res = ["503", calculoOrigen[0], calculoDestino[0], distanciaCaminada];
    }
    let posicionParadaOrigen: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(res[1].posicion_id);
    let posicionParadaDestino: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(res[2].posicion_id);
    return res;
}

export async function calcularLimites(): Promise<IPosicionGPS[]> {
    let limites: IPosicionGPS[];

        
    return limites;

}