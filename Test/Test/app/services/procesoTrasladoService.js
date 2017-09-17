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
const posicionGPSModel = require("../models/posicionGPSModel");
var ModoTrayecto = posicionGPSModel.TipoPunto;
const posicionGPSService = require("../services/posicionGPSService");
const paradaColectivoService = require("../services/paradaColectivoService");
const lineaColectivoService = require("../services/lineaColectivoService");
function calcularDistancia(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        /* const res = await req('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origen.latitud + ',' + origen.longitud + '&destinations=' + destino.latitud + ',' + destino.longitud + '&mode=walking&key=AIzaSyAa1HcCYyNcWztCG9e6O83cgGg6tpHic_w');
         const dataJSON = await res.json();
         return dataJSON['rows'][0]['elements'][0]['distance']['value'];*/
        const res = yield req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud);
        const dataJSON = yield res.json();
        let distancia = dataJSON['routes'][0]['distance'];
        return Math.round(distancia);
    });
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
function paradasMasCercanas(linea, origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let resOrigen = [null, -1];
        let resDestino = [null, -1];
        for (let i = 0; i < linea.cantidadParadas; i++) {
            let parada = yield paradaColectivoService.obtenerParadaColectivo(linea.paradas[i]);
            let posicionParada = yield posicionGPSService.obtenerPosicionGPS(parada.posicion_id);
            let distanciaParadaOrigen = yield calcularDistancia(origen, posicionParada);
            if (resOrigen[0] == null || distanciaParadaOrigen < resOrigen[1]) {
                resOrigen = [parada, distanciaParadaOrigen];
            }
            let distanciaParadaDestino = yield calcularDistancia(destino, posicionParada);
            if (resDestino[0] == null || distanciaParadaDestino < resDestino[1]) {
                resDestino = [parada, distanciaParadaDestino];
            }
        }
        return [resOrigen[0], resDestino[0], resOrigen[1] + resDestino[1]];
    });
}
function armarTrayectoAPie(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let trayecto = [];
        const res = yield req('http://192.168.230.129:5000/route/v1/foot/' + origen.longitud + ',' + origen.latitud + ';' + destino.longitud + ',' + destino.latitud + '?steps=true');
        const dataJSON = yield res.json();
        let steps = dataJSON['routes'][0]['legs'][0]['steps'];
        for (let i = 0; i < steps.length; i++) {
            let punto = {};
            punto.latitude = steps[i]['maneuver']['location'][1],
                punto.longitude = steps[i]['maneuver']['location'][0];
            punto.mode = ModoTrayecto.foot;
            trayecto.push(punto);
        }
        return trayecto;
    });
}
exports.armarTrayectoAPie = armarTrayectoAPie;
function armarTrayectoColectivo(linea, posicionInicial, paradaOrigen, posicionFinal, paradaDestino) {
    return __awaiter(this, void 0, void 0, function* () {
        let lineaColectivo = yield lineaColectivoService.obtenerLineaColectivo(linea);
        let trayecto = [];
        let parada;
        let posicionParada;
        let i = 0;
        let seguir = true;
        let punto;
        while (seguir) {
            parada = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[i]);
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
        while (seguir) {
            parada = yield paradaColectivoService.obtenerParadaColectivo(lineaColectivo.paradas[i]);
            posicionParada = yield posicionGPSService.obtenerPosicionGPS(parada.posicion_id);
            if (parada.equals(paradaDestino)) {
                seguir = false;
            }
            else {
                punto = {};
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
    });
}
exports.armarTrayectoColectivo = armarTrayectoColectivo;
//export async function calcularTrayecto(origen: IPosicionGPS, destino: IPosicionGPS): Promise<[string,IParadaColectivo,IParadaColectivo,number]> {
function calcularTrayecto(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = ["", null, null, -1];
        let lineas = yield lineaColectivoService.obtenerLineasColectivo();
        // for (let i: number = 0; i < lineas.length; i++) {
        for (let i = 0; i < 1; i++) {
            //   let lineaColectivo: ILineaColectivo = await lineaColectivoService.obtenerLineaColectivo(lineas[i].linea);
            let lineaColectivo = yield lineaColectivoService.obtenerLineaColectivo("503");
            let resLinea = yield paradasMasCercanas(lineaColectivo, origen, destino);
            //  let calculoOrigen: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, origen);
            //  let calculoDestino: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, destino);
            //  let distanciaCaminada: number = calculoOrigen[1] + calculoDestino[1];
            if (res[3] == -1 || resLinea[2] < res[3]) {
                //res = [lineas[i].linea.valueOf(), resLinea[0], resLinea[1], resLinea[2]];
                res = ["503", resLinea[0], resLinea[1], resLinea[2]];
            }
            //  res = ["503", calculoOrigen[0], calculoDestino[0], distanciaCaminada];
        }
        let posicionParadaOrigen = yield posicionGPSService.obtenerPosicionGPS(res[1].posicion_id);
        let trayectoHaciaParadaOrigen = yield armarTrayectoAPie(origen, posicionParadaOrigen);
        let posicionParadaDestino = yield posicionGPSService.obtenerPosicionGPS(res[2].posicion_id);
        let trayectoHaciaDestino = yield armarTrayectoAPie(posicionParadaDestino, destino);
        let trayectoColectivo = yield armarTrayectoColectivo(res[0], trayectoHaciaParadaOrigen[trayectoHaciaParadaOrigen.length - 1], res[1], trayectoHaciaDestino[0], res[2]);
        return [trayectoHaciaParadaOrigen, trayectoColectivo, trayectoHaciaDestino];
        //return res;
    });
}
exports.calcularTrayecto = calcularTrayecto;
//# sourceMappingURL=procesoTrasladoService.js.map