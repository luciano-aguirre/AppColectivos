﻿import express = require('express');
import mongoose = require('mongoose');
var req = require('requisition');

import posicionGPSModel = require('../models/posicionGPSModel');
import IPosicionGPS = posicionGPSModel.IPosicionGPS;
//import IPuntoTrayecto = posicionGPSModel.IPuntoTrayecto;
//import ModoTrayecto = posicionGPSModel.TipoPunto;

import caminoModel = require('../models/caminoModel');
import ICamino = caminoModel.ICamino;
import ITrayecto = caminoModel.ITrayecto;
import IPuntoTrayecto = caminoModel.IPuntoTrayecto;

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

async function paradasRadioCercano(radio: number, posicion: IPosicionGPS): Promise<IParadaColectivo[]> {
    let paradas: IParadaColectivo[] = await paradaColectivoService.obtenerParadasColectivo();
    let paradasCercanas: IParadaColectivo[] = [];
    let posicionGPSParada: IPosicionGPS;

    for (let i: number = 0; i < paradas.length; i++) {
        posicionGPSParada = await posicionGPSService.obtenerPosicionGPS(paradas[i].posicion_id);
        if (getDistanceFromLatLonInKm(posicion.latitud.valueOf(), posicion.longitud.valueOf(), posicionGPSParada.latitud.valueOf(), posicionGPSParada.longitud.valueOf()) <= radio){
            paradasCercanas.push(paradas[i]);
        }
    }

    return paradasCercanas;
}

async function paradasMasCercanasIdaVuelta(linea: ILineaColectivo, origen: IPosicionGPS, destino: IPosicionGPS): Promise<[IParadaColectivo[],IParadaColectivo[]]> {
    let paradaCercanaOrigenIda: [IParadaColectivo, number] = [null, -1];
    let paradaCercanaOrigenVuelta: [IParadaColectivo, number] = [null, -1];
    let paradaCercanaDestinoIda: [IParadaColectivo, number] = [null, -1];
    let paradaCercanaDestinoVuelta: [IParadaColectivo, number] = [null, -1];

    let paradasCercanasOrigen: IParadaColectivo[] = [];
    let paradasCercanasDestino: IParadaColectivo[] = [];

    for (let i: number = 0; i < linea.cantidadParadas; i++) {
        let parada: IParadaColectivo = await paradaColectivoService.obtenerParadaColectivo(linea.paradas[i]);
        let posicionParada: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(parada.posicion_id);

        if (parada.sentido == 'i') {
            let distanciaParadaOrigenIda: number = await calcularDistancia(origen, posicionParada);
            if (paradaCercanaOrigenIda[0] == null || distanciaParadaOrigenIda < paradaCercanaOrigenIda[1]) {
                paradaCercanaOrigenIda = [parada, distanciaParadaOrigenIda];
            }

            let distanciaParadaDestinoIda: number = await calcularDistancia(posicionParada, destino);
            if (paradaCercanaDestinoIda[0] == null || distanciaParadaDestinoIda < paradaCercanaDestinoIda[1]) {
                paradaCercanaDestinoIda = [parada, distanciaParadaDestinoIda];
            }
        }
        else {
            let distanciaParadaOrigenVuelta: number = await calcularDistancia(origen, posicionParada);
            if (paradaCercanaOrigenVuelta[0] == null || distanciaParadaOrigenVuelta < paradaCercanaOrigenVuelta[1]) {
                paradaCercanaOrigenVuelta = [parada, distanciaParadaOrigenVuelta];
            }

            let distanciaParadaDestinoVuelta: number = await calcularDistancia(posicionParada, destino);
            if (paradaCercanaDestinoVuelta[0] == null || distanciaParadaDestinoVuelta < paradaCercanaDestinoVuelta[1]) {
                paradaCercanaDestinoVuelta = [parada, distanciaParadaDestinoVuelta];
            }
        }        
    }
    paradasCercanasOrigen.push(paradaCercanaOrigenIda[0], paradaCercanaOrigenVuelta[0]);
    paradasCercanasDestino.push(paradaCercanaDestinoIda[0], paradaCercanaDestinoVuelta[0]);

    return [paradasCercanasOrigen, paradasCercanasDestino];//SEGUIR VIENDO PARA ARMAR LOS CAMINOS
}

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

export async function armarTrayectoAPie(origen: IPosicionGPS, destino: IPosicionGPS): Promise<ITrayecto> {

    const res = await req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud + '?steps=true');
    const dataJSON = await res.json();

    let trayecto: ITrayecto = {} as ITrayecto;
    trayecto.modo = "pie";
    trayecto.coordenadas = [];
    trayecto.distanciaTrayecto = Math.round(dataJSON['routes'][0]['distance']);
  
    let steps = dataJSON['routes'][0]['legs'][0]['steps'];
    let punto: IPuntoTrayecto;

    punto = {} as IPuntoTrayecto;
    punto.latitude = origen.latitud;
    punto.longitude = origen.longitud;
    trayecto.coordenadas.push(punto);

    for (let i: number = 0; i < steps.length; i++) {
        punto = {} as IPuntoTrayecto;
        punto.latitude = steps[i]['maneuver']['location'][1];
        punto.longitude = steps[i]['maneuver']['location'][0];
        trayecto.coordenadas.push(punto);
    }

    punto = {} as IPuntoTrayecto;
    punto.latitude = destino.latitud;
    punto.longitude = destino.longitud;
    trayecto.coordenadas.push(punto);
    
    return trayecto;
}

function distanciaCercana(camino: IPuntoTrayecto[], punto: IPuntoTrayecto): boolean {
    let ult: number = camino.length - 1;
    let toReturn: boolean = true;
    if (ult >= 0) {
        let res: number = getDistanceFromLatLonInKm(camino[ult].latitude.valueOf(), camino[ult].longitude.valueOf(), punto.latitude.valueOf(), punto.longitude.valueOf());
        if (res >= 1.0)
            toReturn = false;
    }
    return toReturn;
}

function distanciaUltimaParada(camino: IPuntoTrayecto[], punto: IPuntoTrayecto): number {
    let distancia: number = 0;
    let ult: number = camino.length - 1;

    if (ult >= 0) {
        distancia = getDistanceFromLatLonInKm(camino[ult].latitude.valueOf(), camino[ult].longitude.valueOf(), punto.latitude.valueOf(), punto.longitude.valueOf());
    }

    return Math.round(distancia * 1000);
}

function getDistanceFromLatLonInKm(lat1: number, long1: number, lat2: number, long2: number): number {
    let R: number = 6371; // Radius of the earth in km
    let dLat: number = deg2rad(lat2 - lat1); // deg2rad below
    let dLon: number = deg2rad(long2 - long1);
    let a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d: number = R * c; // Distance in km

    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export async function armarTrayectoColectivo(linea: string, posicionInicial: IPuntoTrayecto, paradaOrigen: IParadaColectivo, posicionFinal: IPuntoTrayecto, paradaDestino: IParadaColectivo): Promise<ITrayecto> {
    let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(linea);
    
    let paradaActual: IParadaColectivo;
    let posicionGPSParadaActual: IPosicionGPS;    
    let posParadaOrigen: number;
    let posParadaDestino: number;
    let posParadaActual: number;
    let punto: IPuntoTrayecto;

    let trayecto: ITrayecto = {} as ITrayecto;
    trayecto.modo = "colectivo";
    trayecto.detalle = linea;
    trayecto.coordenadas = [];
    trayecto.distanciaTrayecto = 0;

    //PARA QUE COINCIDAN EL INICIO Y FIN DEL RECORRIDO EN COLECTIVO CON LOS RECORRIDOS A PIE
    posParadaOrigen = lineaColectivo.paradas.findIndex(p => p.equals(paradaOrigen._id));
    //trayecto.coordenadas.push(posicionInicial);

    posParadaDestino = lineaColectivo.paradas.findIndex(p => p.equals(paradaDestino._id));
    posParadaActual = posParadaOrigen;
    //SE SEPARA EN 4 CASOS
    if ((paradaOrigen.sentido === "i") && (paradaDestino.sentido === "v")) {
      //  posParadaActual++;
      //  trayecto.coordenadas.push(posicionInicial);
      //  posParadaDestino++;

        while ((posParadaActual <= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")) {
            posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionGPSParadaActual.latitud;
            punto.longitude = posicionGPSParadaActual.longitud;
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            posParadaActual++;
        }
        if (posParadaActual < posParadaDestino) {//siempre es true creo
            posParadaActual = lineaColectivo.paradas.length - 1;
            while ((posParadaActual >= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
                posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {} as IPuntoTrayecto;
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                posParadaActual--;
            }
        }
    } else if ((paradaOrigen.sentido === "v") && (paradaDestino.sentido === "i")) {
        while ((posParadaActual >= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
            posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionGPSParadaActual.latitud;
            punto.longitude = posicionGPSParadaActual.longitud;
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            posParadaActual--;
        }
        if (posParadaActual > posParadaDestino) {
            posParadaActual = 0;
            while ((posParadaActual <= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")) {
                posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {} as IPuntoTrayecto;
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                posParadaActual++;
            }
        }
    } else if ((paradaOrigen.sentido === "i") && (paradaDestino.sentido === "i")) {
        while ((posParadaActual <= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")){
            posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionGPSParadaActual.latitud;
            punto.longitude = posicionGPSParadaActual.longitud;
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            posParadaActual++;
        }
    } else {
        while ((posParadaActual >= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
            posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionGPSParadaActual.latitud;
            punto.longitude = posicionGPSParadaActual.longitud;
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            posParadaActual--;
        }
    }

   // trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, posicionFinal);
   // trayecto.coordenadas.push(posicionFinal);

    return trayecto;
}

/*
export async function armarTrayectoColectivo(linea: string, posicionInicial: IPuntoTrayecto, paradaOrigen: IParadaColectivo, posicionFinal: IPuntoTrayecto, paradaDestino: IParadaColectivo): Promise<IPuntoTrayecto[]> {
    let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(linea);
    let trayecto: IPuntoTrayecto[] = [];
    let parada: IParadaColectivo;
    let posicionParada: IPosicionGPS;

    let i: number = 0;
    let posOrigen: number;
    let posDestino: number;
    let seguir: boolean = true;   
    let punto; 

    while (seguir) {
        parada = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[i]);
        seguir = !parada.equals(paradaOrigen);
        i = (i + 1) % lineaColectivo.cantidadParadas.valueOf();
      //  if (parada.equals(paradaOrigen)) {
       //     seguir = false;
       // }
       // else {
       //     i = (i + 1) % lineaColectivo.cantidadParadas.valueOf();
       // }
    }
    //Agrego la posicion de origen como inicio para que coincidan bien los recorridos, idem posicion de destino
  // punto = {} as IPuntoTrayecto;
  //  punto.latitude = posicionOrigen.latitud;
  //  punto.longitude = posicionOrigen.longitud;
  //  punto.mode = ModoTrayecto.foot;
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

 //  punto = {} as IPuntoTrayecto;
 //   punto.latitude = posicionDestino.latitud;
 //   punto.longitude = posicionDestino.longitud;
 //   punto.mode = ModoTrayecto.foot;
    trayecto.push(posicionFinal);   

    return trayecto;
}
*/

//export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<[string,IParadaColectivo,IParadaColectivo,number]> {
export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<ICamino[]> {
    let res: [string, IParadaColectivo, IParadaColectivo, number] = ["", null, null, -1];

   // paradasRadioCercano(1.0, origen);

    let caminos: ICamino[] = [];
    let caminoActual: ICamino;
    let mejorCamino: ICamino;
    let paradasCercanas: [IParadaColectivo[]];
    
    let lineas: ILineaColectivo[] = await lineaColectivoService.obtenerLineasColectivo();
    let numeroLineas: String[] = await lineaColectivoService.obtenerNumeroLineas();

   // for (let i: number = 0; i < lineas.length; i++) {
  /*  for (let i: number = 0; i < 1; i++) {
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
    }*/

    for (let i: number = 0; i < 3; i++) {
        let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(numeroLineas[i]);
        paradasCercanas = await paradasMasCercanasIdaVuelta(lineaColectivo, origen, destino);
        mejorCamino = null;

        for (let j: number = 0; j < paradasCercanas[0].length; j++) {
            for (let k: number = 0; k < paradasCercanas[1].length; k++) {
                let posicionParadaOrigen: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(paradasCercanas[0][j].posicion_id);
                let trayectoHaciaParadaOrigen: ITrayecto = await armarTrayectoAPie(origen, posicionParadaOrigen);

                let posicionParadaDestino: IPosicionGPS = await posicionGPSService.obtenerPosicionGPS(paradasCercanas[1][k].posicion_id);
                let trayectoHaciaDestino: ITrayecto = await armarTrayectoAPie(posicionParadaDestino, destino);

                let trayectoColectivo: ITrayecto = await armarTrayectoColectivo(lineaColectivo.linea.valueOf(), trayectoHaciaParadaOrigen.coordenadas[trayectoHaciaParadaOrigen.coordenadas.length - 1], paradasCercanas[0][j], trayectoHaciaDestino.coordenadas[0], paradasCercanas[1][k]);

                if (trayectoColectivo.distanciaTrayecto.valueOf() > 0) {
                    caminoActual = {} as ICamino;
                    caminoActual.trayectos = [];
                    caminoActual.puntaje = (trayectoHaciaParadaOrigen.distanciaTrayecto.valueOf() + trayectoHaciaDestino.distanciaTrayecto.valueOf()) * 2 + trayectoColectivo.distanciaTrayecto.valueOf() * 0.5;
                    caminoActual.distanciaCamino = trayectoHaciaParadaOrigen.distanciaTrayecto.valueOf() + trayectoColectivo.distanciaTrayecto.valueOf() + trayectoHaciaDestino.distanciaTrayecto.valueOf();
                    caminoActual.trayectos.push(trayectoHaciaParadaOrigen, trayectoColectivo, trayectoHaciaDestino);

                    if ((mejorCamino == null) || (mejorCamino.distanciaCamino.valueOf() >= caminoActual.distanciaCamino.valueOf())) {
                        mejorCamino = caminoActual;
                    }
                }
            }
        }

        if (mejorCamino != null) {
            caminos.push(mejorCamino);
        }
    }    
    return caminos.sort((camino1, camino2) => {
        return camino1.puntaje.valueOf() - camino2.puntaje.valueOf();
    });
}
