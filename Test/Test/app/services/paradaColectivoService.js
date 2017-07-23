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
//import bodyParser = require('body-parser');
//import request = require('request');
const posicionGPSService = require("./posicionGPSService");
const paradaColectivoRepository = require("../repositories/paradaColectivoRepository");
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
function crearParadaColectivo(linea, latitud, longitud, sentido) {
    return __awaiter(this, void 0, void 0, function* () {
        let posicionGPS = yield posicionGPSService.crearPosicionGPS(latitud, longitud);
        let parada = yield paradaColectivoRepository.create(linea, posicionGPS, sentido);
        return parada;
    });
}
exports.crearParadaColectivo = crearParadaColectivo;
function obtenerParadasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let paradas = yield paradaColectivoRepository.getAll();
            console.log('Se obtuvieron las posiciones desde el servicio');
            return paradas;
        }
        catch (error) {
            console.log('Error al obtener las paradas desde el servicio');
            return null;
        }
    });
}
exports.obtenerParadasColectivo = obtenerParadasColectivo;
function eliminarParadasColectivos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield paradaColectivoRepository.deleteAll();
            yield posicionGPSService.eliminarPosicionesGPS();
            console.log('Se eliminaron las paradas de colectivo del repositorio');
            return true;
        }
        catch (error) {
            console.log('No se pudieron eliminar las paradas de colectivo del repositorio');
            return false;
        }
    });
}
exports.eliminarParadasColectivos = eliminarParadasColectivos;
//# sourceMappingURL=paradaColectivoService.js.map