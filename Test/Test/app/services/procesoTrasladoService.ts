import express = require('express');
import mongoose = require('mongoose');
var req = require('requisition');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;
import IPuntoTrayecto = posicionGPSModel.IPuntoTrayecto;
import ModoTrayecto = posicionGPSModel.TipoPunto;

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

export async function armarTrayectoAPie(origen: IPosicionGPS, destino: IPosicionGPS): Promise<IPuntoTrayecto[]> {
    let trayecto: IPuntoTrayecto[] = [];

    const res = await req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud + '?steps=true');
    const dataJSON = await res.json();

    let steps = dataJSON['routes'][0]['legs'][0]['steps'];

    for (let i: number = 0; i < steps.length; i++) {
        let punto = {} as IPuntoTrayecto;
        punto.latitude = steps[i]['maneuver']['location'][1],
        punto.longitude = steps[i]['maneuver']['location'][0]
        punto.mode = ModoTrayecto.foot;
        trayecto.push(punto);
    }
    
    return trayecto;
}

export async function armarTrayectoColectivo(linea: string, posicionInicial: IPuntoTrayecto, paradaOrigen: IParadaColectivo, posicionFinal: IPuntoTrayecto, paradaDestino: IParadaColectivo): Promise<IPuntoTrayecto[]> {
    let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(linea);
    let trayecto: IPuntoTrayecto[] = [];
    let parada: IParadaColectivo;
    let posicionParada: IPosicionGPS;

    let i: number = 0;
    let seguir: boolean = true;   
    let punto; 

    while (seguir) {
        parada = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[i]);
        seguir = !parada.equals(paradaOrigen);
        i = (i + 1) % lineaColectivo.cantidadParadas.valueOf();
      /*  if (parada.equals(paradaOrigen)) {
            seguir = false;
        }
        else {
            i = (i + 1) % lineaColectivo.cantidadParadas.valueOf();
        }*/
    }
    //Agrego la posicion de origen como inicio para que coincidan bien los recorridos, idem posicion de destino
   /* punto = {} as IPuntoTrayecto;
    punto.latitude = posicionOrigen.latitud;
    punto.longitude = posicionOrigen.longitud;
    punto.mode = ModoTrayecto.foot;*/
    trayecto.push(posicionInicial);
    
    seguir = true;
    while (seguir){
        parada = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[i]);        
        posicionParada = await posicionGPSService.obtenerPosicionGPS(parada.posicion_id);
        if (parada.equals(paradaDestino)) {
            seguir = false;
        }
        //seguir = !parada.equals(paradaOrigen);
        else {
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionParada.latitud;
            punto.longitude = posicionParada.longitud;
            punto.mode = ModoTrayecto.bus;
            trayecto.push(punto);
            i = (i + 1) % lineaColectivo.cantidadParadas.valueOf();
        }       
    }
/*
    punto = {} as IPuntoTrayecto;
    punto.latitude = posicionDestino.latitud;
    punto.longitude = posicionDestino.longitud;
    punto.mode = ModoTrayecto.foot;*/
    trayecto.push(posicionFinal);   

    return trayecto;
}


//export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<[string,IParadaColectivo,IParadaColectivo,number]> {
export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<[IPuntoTrayecto[], IPuntoTrayecto[], IPuntoTrayecto[]]> {
    let res: [string,IParadaColectivo, IParadaColectivo, number] = ["",null, null, -1];
 
    let lineas: ILineaColectivo[] = await lineaColectivoService.obtenerLineasColectivo();

   // for (let i: number = 0; i < lineas.length; i++) {
    for (let i: number = 0; i < 1; i++) {
     //   let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(lineas[i].linea);
        let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo("503");
        let resLinea: [IParadaColectivo, IParadaColectivo, number] = await paradasMasCercanas(lineaColectivo, origen, destino);
      //  let calculoOrigen: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, origen);
      //  let calculoDestino: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, destino);
      //  let distanciaCaminada: number = calculoOrigen[1] + calculoDestino[1];

        if (res[3] == -1 || resLinea[2] < res[3]) {
            //res = [lineas[i].linea.valueOf(), resLinea[0], resLinea[1], resLinea[2]];
            res = ["503", resLinea[0], resLinea[1], resLinea[2]];
        }
      //  res = ["503", calculoOrigen[0], calculoDestino[0], distanciaCaminada];
    }
    let posicionParadaOrigen: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(res[1].posicion_id);
    let trayectoHaciaParadaOrigen: IPuntoTrayecto[] = await armarTrayectoAPie(origen, posicionParadaOrigen); 
    
    let posicionParadaDestino: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(res[2].posicion_id);
    let trayectoHaciaDestino: IPuntoTrayecto[] = await armarTrayectoAPie(posicionParadaDestino, destino);

    let trayectoColectivo: IPuntoTrayecto[] = await armarTrayectoColectivo(res[0], trayectoHaciaParadaOrigen[trayectoHaciaParadaOrigen.length - 1], res[1], trayectoHaciaDestino[0], res[2]);

    return [trayectoHaciaParadaOrigen, trayectoColectivo, trayectoHaciaDestino];
    //return res;
}
