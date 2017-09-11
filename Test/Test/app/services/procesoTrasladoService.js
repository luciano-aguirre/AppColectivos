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
function calcularTrayecto(origen, destino) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = ["", null, null, -1];
        let lineas = yield lineaColectivoService.obtenerLineasColectivo();
        for (let i = 0; i < lineas.length; i++) {
            let lineaColectivo = yield lineaColectivoService.obtenerLineaColectivo(lineas[i].linea);
            let resLinea = yield paradasMasCercanas(lineaColectivo, origen, destino);
            //  let calculoOrigen: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, origen);
            //  let calculoDestino: [IParadaColectivo, number] = await paradaMasCercana(lineaColectivo, destino);
            //  let distanciaCaminada: number = calculoOrigen[1] + calculoDestino[1];
            if (res[3] == -1 || resLinea[2] < res[3]) {
                res = [lineas[i].linea.valueOf(), resLinea[0], resLinea[1], resLinea[2]];
            }
            //  res = ["503", calculoOrigen[0], calculoDestino[0], distanciaCaminada];
        }
        let posicionParadaOrigen = yield posicionGPSService.obtenerPosicionGPS(res[1].posicion_id);
        let posicionParadaDestino = yield posicionGPSService.obtenerPosicionGPS(res[2].posicion_id);
        return res;
    });
}
exports.calcularTrayecto = calcularTrayecto;
function calcularLimites() {
    return __awaiter(this, void 0, void 0, function* () {
        let limites;
        return limites;
    });
}
exports.calcularLimites = calcularLimites;
//# sourceMappingURL=procesoTrasladoService.js.map