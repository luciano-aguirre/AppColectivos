"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var req = require('requisition');
const posicionGPSService = require("../services/posicionGPSService");
const paradaColectivoService = require("../services/paradaColectivoService");
const lineaColectivoService = require("../services/lineaColectivoService");
function calcularDistancia(origen, destino) {
    return getDistanceFromLatLonInKm(origen.latitud.valueOf(), origen.longitud.valueOf(), destino.latitud.valueOf(), destino.longitud.valueOf());
}
function paradasMasCercanasIdaVuelta(linea, origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let paradaCercanaOrigenIda = [null, -1];
        let paradaCercanaOrigenVuelta = [null, -1];
        let paradaCercanaDestinoIda = [null, -1];
        let paradaCercanaDestinoVuelta = [null, -1];
        let paradasCercanasOrigen = [];
        let paradasCercanasDestino = [];
        for (let i = 0; i < linea.cantidadParadas; i++) {
            let parada = yield paradaColectivoService.obtenerParadaColectivo(linea.paradas[i]);
            let posicionParada = yield posicionGPSService.obtenerPosicionGPS(parada.posicion_id);
            if (parada.sentido == 'i') {
                let distanciaParadaOrigenIda = calcularDistancia(origen, posicionParada); //await calcularDistanciaCaminando(origen, posicionParada);
                if (paradaCercanaOrigenIda[0] == null || distanciaParadaOrigenIda < paradaCercanaOrigenIda[1]) {
                    paradaCercanaOrigenIda = [parada, distanciaParadaOrigenIda];
                }
                let distanciaParadaDestinoIda = calcularDistancia(posicionParada, destino); //await calcularDistanciaCaminando(posicionParada, destino);
                if (paradaCercanaDestinoIda[0] == null || distanciaParadaDestinoIda < paradaCercanaDestinoIda[1]) {
                    paradaCercanaDestinoIda = [parada, distanciaParadaDestinoIda];
                }
            }
            else {
                let distanciaParadaOrigenVuelta = calcularDistancia(origen, posicionParada); //await calcularDistanciaCaminando(origen, posicionParada);
                if (paradaCercanaOrigenVuelta[0] == null || distanciaParadaOrigenVuelta < paradaCercanaOrigenVuelta[1]) {
                    paradaCercanaOrigenVuelta = [parada, distanciaParadaOrigenVuelta];
                }
                let distanciaParadaDestinoVuelta = calcularDistancia(posicionParada, destino); //await calcularDistanciaCaminando(posicionParada, destino);
                if (paradaCercanaDestinoVuelta[0] == null || distanciaParadaDestinoVuelta < paradaCercanaDestinoVuelta[1]) {
                    paradaCercanaDestinoVuelta = [parada, distanciaParadaDestinoVuelta];
                }
            }
        }
        paradasCercanasOrigen.push(paradaCercanaOrigenIda[0], paradaCercanaOrigenVuelta[0]);
        paradasCercanasDestino.push(paradaCercanaDestinoIda[0], paradaCercanaDestinoVuelta[0]);
        return [paradasCercanasOrigen, paradasCercanasDestino]; //SEGUIR VIENDO PARA ARMAR LOS CAMINOS
    });
}
function armarTrayectoAPie(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud + '?steps=true');
        const dataJSON = yield res.json();
        let trayecto = {};
        trayecto.modo = "pie";
        trayecto.coordenadas = [];
        trayecto.distanciaTrayecto = Math.round(dataJSON['routes'][0]['distance']);
        let steps = dataJSON['routes'][0]['legs'][0]['steps'];
        let punto;
        punto = {};
        punto.latitude = origen.latitud;
        punto.longitude = origen.longitud;
        trayecto.coordenadas.push(punto);
        for (let i = 0; i < steps.length; i++) {
            punto = {};
            punto.latitude = steps[i]['maneuver']['location'][1];
            punto.longitude = steps[i]['maneuver']['location'][0];
            trayecto.coordenadas.push(punto);
        }
        punto = {};
        punto.latitude = destino.latitud;
        punto.longitude = destino.longitud;
        trayecto.coordenadas.push(punto);
        return trayecto;
    });
}
exports.armarTrayectoAPie = armarTrayectoAPie;
function distanciaCercana(camino, punto) {
    let ult = camino.length - 1;
    let toReturn = true;
    if (ult >= 0) {
        let res = getDistanceFromLatLonInKm(camino[ult].latitude.valueOf(), camino[ult].longitude.valueOf(), punto.latitude.valueOf(), punto.longitude.valueOf());
        if (res >= 1.0)
            toReturn = false;
    }
    return toReturn;
}
function distanciaUltimaParada(camino, punto) {
    let distancia = 0;
    let ult = camino.length - 1;
    if (ult >= 0) {
        distancia = getDistanceFromLatLonInKm(camino[ult].latitude.valueOf(), camino[ult].longitude.valueOf(), punto.latitude.valueOf(), punto.longitude.valueOf());
    }
    return Math.round(distancia * 1000);
}
function getDistanceFromLatLonInKm(lat1, long1, lat2, long2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(long2 - long1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function armarTrayectoColectivo(linea, posicionInicial, paradaOrigen, posicionFinal, paradaDestino) {
    return __awaiter(this, void 0, void 0, function* () {
        let lineaColectivo = yield lineaColectivoService.obtenerLineaColectivo(linea);
        let paradaActual;
        let posicionGPSParadaActual;
        let posParadaOrigen;
        let posParadaDestino;
        let posParadaActual;
        let punto;
        let trayecto = {};
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
            while ((posParadaActual <= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")) {
                posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {};
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                }
                posParadaActual++;
            }
            if (posParadaActual < posParadaDestino) {
                posParadaActual = lineaColectivo.paradas.length - 1;
                while ((posParadaActual >= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
                    posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                    punto = {};
                    punto.latitude = posicionGPSParadaActual.latitud;
                    punto.longitude = posicionGPSParadaActual.longitud;
                    //armarTrayectoEntreParadas(trayecto, punto);
                    if (distanciaCercana(trayecto.coordenadas, punto)) {
                        trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                        trayecto.coordenadas.push(punto);
                    }
                    else {
                        trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                    }
                    posParadaActual--;
                }
            }
        }
        else if ((paradaOrigen.sentido === "v") && (paradaDestino.sentido === "i")) {
            while ((posParadaActual >= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
                posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {};
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                }
                posParadaActual--;
            }
            if (posParadaActual > posParadaDestino) {
                posParadaActual = 0;
                while ((posParadaActual <= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")) {
                    posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                    punto = {};
                    punto.latitude = posicionGPSParadaActual.latitud;
                    punto.longitude = posicionGPSParadaActual.longitud;
                    //armarTrayectoEntreParadas(trayecto, punto);
                    if (distanciaCercana(trayecto.coordenadas, punto)) {
                        trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                        trayecto.coordenadas.push(punto);
                    }
                    else {
                        trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                    }
                    posParadaActual++;
                }
            }
        }
        else if ((paradaOrigen.sentido === "i") && (paradaDestino.sentido === "i")) {
            while ((posParadaActual <= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "i")) {
                posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {};
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                }
                posParadaActual++;
            }
        }
        else {
            while ((posParadaActual >= posParadaDestino) && ((paradaActual = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[posParadaActual])).sentido === "v")) {
                posicionGPSParadaActual = yield posicionGPSService.obtenerPosicionGPS(paradaActual.posicion_id);
                punto = {};
                punto.latitude = posicionGPSParadaActual.latitud;
                punto.longitude = posicionGPSParadaActual.longitud;
                //armarTrayectoEntreParadas(trayecto, punto);
                if (distanciaCercana(trayecto.coordenadas, punto)) {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, punto);
                    trayecto.coordenadas.push(punto);
                }
                else {
                    trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() * 10;
                }
                posParadaActual--;
            }
        }
        // trayecto.distanciaTrayecto = trayecto.distanciaTrayecto.valueOf() + distanciaUltimaParada(trayecto.coordenadas, posicionFinal);
        // trayecto.coordenadas.push(posicionFinal);
        return trayecto;
    });
}
function calcularTrayecto(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = ["", null, null, -1];
        let caminos = [];
        let caminoActual;
        let mejorCamino;
        let paradasCercanas;
        let numeroLineas = yield lineaColectivoService.obtenerNumeroLineas();
        let lineaColectivo;
        for (let i = 0; i < numeroLineas.length; i++) {
            lineaColectivo = yield lineaColectivoService.obtenerLineaColectivo(numeroLineas[i]);
            paradasCercanas = yield paradasMasCercanasIdaVuelta(lineaColectivo, origen, destino);
            mejorCamino = null;
            for (let j = 0; j < paradasCercanas[0].length; j++) {
                for (let k = 0; k < paradasCercanas[1].length; k++) {
                    let posicionParadaOrigen = yield posicionGPSService.obtenerPosicionGPS(paradasCercanas[0][j].posicion_id);
                    let trayectoHaciaParadaOrigen = yield armarTrayectoAPie(origen, posicionParadaOrigen);
                    let posicionParadaDestino = yield posicionGPSService.obtenerPosicionGPS(paradasCercanas[1][k].posicion_id);
                    let trayectoHaciaDestino = yield armarTrayectoAPie(posicionParadaDestino, destino);
                    let trayectoColectivo = yield armarTrayectoColectivo(lineaColectivo.linea.valueOf(), trayectoHaciaParadaOrigen.coordenadas[trayectoHaciaParadaOrigen.coordenadas.length - 1], paradasCercanas[0][j], trayectoHaciaDestino.coordenadas[0], paradasCercanas[1][k]);
                    if (trayectoColectivo.distanciaTrayecto.valueOf() > 0) {
                        if (trayectoColectivo.distanciaTrayecto.valueOf() < 700) {
                            //Penalizacion para que no tenga en cuenta viajes en colectivo de menos de 7 cuadras
                            trayectoColectivo.distanciaTrayecto = trayectoColectivo.distanciaTrayecto.valueOf() * 10;
                        }
                        caminoActual = {};
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
        }).slice(0, 3);
    });
}
exports.calcularTrayecto = calcularTrayecto;
//# sourceMappingURL=procesoTrasladoService.js.map