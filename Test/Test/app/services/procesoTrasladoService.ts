import express = require('express');
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

function calcularDistancia(origen: IPosicionGPS, destino: IPosicionGPS): number {
    return getDistanceFromLatLonInKm(origen.latitud.valueOf(), origen.longitud.valueOf(), destino.latitud.valueOf(), destino.longitud.valueOf());
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
            let distanciaParadaOrigenIda: number = calcularDistancia(origen, posicionParada);//await calcularDistanciaCaminando(origen, posicionParada);
            if (paradaCercanaOrigenIda[0] == null || distanciaParadaOrigenIda < paradaCercanaOrigenIda[1]) {
                paradaCercanaOrigenIda = [parada, distanciaParadaOrigenIda];
            }

            let distanciaParadaDestinoIda: number = calcularDistancia(posicionParada, destino);//await calcularDistanciaCaminando(posicionParada, destino);
            if (paradaCercanaDestinoIda[0] == null || distanciaParadaDestinoIda < paradaCercanaDestinoIda[1]) {
                paradaCercanaDestinoIda = [parada, distanciaParadaDestinoIda];
            }
        }
        else {
            let distanciaParadaOrigenVuelta: number = calcularDistancia(origen, posicionParada);//await calcularDistanciaCaminando(origen, posicionParada);
            if (paradaCercanaOrigenVuelta[0] == null || distanciaParadaOrigenVuelta < paradaCercanaOrigenVuelta[1]) {
                paradaCercanaOrigenVuelta = [parada, distanciaParadaOrigenVuelta];
            }

            let distanciaParadaDestinoVuelta: number = calcularDistancia(posicionParada, destino);//await calcularDistanciaCaminando(posicionParada, destino);
            if (paradaCercanaDestinoVuelta[0] == null || distanciaParadaDestinoVuelta < paradaCercanaDestinoVuelta[1]) {
                paradaCercanaDestinoVuelta = [parada, distanciaParadaDestinoVuelta];
            }
        }        
    }
    paradasCercanasOrigen.push(paradaCercanaOrigenIda[0], paradaCercanaOrigenVuelta[0]);
    paradasCercanasDestino.push(paradaCercanaDestinoIda[0], paradaCercanaDestinoVuelta[0]);

    return [paradasCercanasOrigen, paradasCercanasDestino];//SEGUIR VIENDO PARA ARMAR LOS CAMINOS
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

async function armarTrayectoColectivo(linea: string, posicionInicial: IPuntoTrayecto, paradaOrigen: IParadaColectivo, posicionFinal: IPuntoTrayecto, paradaDestino: IParadaColectivo): Promise<ITrayecto> {
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
            //armarTrayectoEntreParadas(trayecto, punto);
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            else {//Penalizacion porque no sigue el orden de las paradas
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
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
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {//Penalizacion porque no sigue el orden de las paradas
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
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
            //armarTrayectoEntreParadas(trayecto, punto);
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            else {//Penalizacion porque no sigue el orden de las paradas
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
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
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {//Penalizacion porque no sigue el orden de las paradas
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
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
            //armarTrayectoEntreParadas(trayecto, punto);
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            else {//Penalizacion porque no sigue el orden de las paradas
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
            }
            posParadaActual++;
        }
    } else {
        while ((posParadaActual >= posParadaDestino) && ((paradaActual = await paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
            posicionGPSParadaActual = await posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
            punto = {} as IPuntoTrayecto;
            punto.latitude = posicionGPSParadaActual.latitud;
            punto.longitude = posicionGPSParadaActual.longitud;
            //armarTrayectoEntreParadas(trayecto, punto);
            if (distanciaCercana(trayecto.coordenadas, punto)) {
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                trayecto.coordenadas.push(punto);
            }
            else {//Penalizacion porque no sigue el orden de las paradas
                trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
            }
            posParadaActual--;
        }
    }
   // trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, posicionFinal);
   // trayecto.coordenadas.push(posicionFinal);
    return trayecto;
}

export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<ICamino[]> {
    let res: [string, IParadaColectivo, IParadaColectivo, number] = ["", null, null, -1];

    let caminos: ICamino[] = [];
    let caminoActual: ICamino;
    let mejorCamino: ICamino;
    let paradasCercanas: [IParadaColectivo[]];  

    let numeroLineas: String[] = await lineaColectivoService.obtenerNumeroLineas();
    let lineaColectivo: ILineaColectivo;

    for (let i: number = 0; i < numeroLineas.length; i++) {
        lineaColectivo = await lineaColectivoService.obtenerLineaColectivo(numeroLineas[i]);
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
                    if (trayectoColectivo.distanciaTrayecto.valueOf() < 700) {
                        //Penalizacion para que no tenga en cuenta viajes en colectivo de menos de 7 cuadras
                        trayectoColectivo.distanciaTrayecto = trayectoColectivo.distanciaTrayecto.valueOf() * 10;
                    }
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
            //await arreglarTrayectoColectivo(mejorCamino);
            caminos.push(mejorCamino);
        }
    }    

    return caminos.sort((camino1, camino2) => {
        return camino1.puntaje.valueOf() - camino2.puntaje.valueOf();
    }).slice(0,3);
}
