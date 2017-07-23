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
const posicionGPSRepository = require("../repositories/posicionGPSRepository");
/*
export async function cargarPosiciones(linea: number) {
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
                let posicionCreada: IPosicionGPS;
                    
                while (posLatitud < paradas.length && posLongitud < paradas.length) {
                    posicionCreada = await posicionGPSRepository.create(paradas[posLatitud]['fStr'], paradas[posLongitud]['fStr']);
                    ++numeroParadas;
                    if (posicionCreada != null) {
                        console.log('Parada ' + numeroParadas + ' creada');
                    }
                    posLatitud += 4;
                    posLongitud += 4;
                }
                console.log('Se cargaron ' + numeroParadas + ' de la linea ' + linea);
            } catch (e) {
                console.log('Error al cargar las posiciones');
                throw e;
            }
        });
}
*/
function crearPosicionGPS(latitud, longitud) {
    return __awaiter(this, void 0, void 0, function* () {
        let nuevaPosicionGPS = yield posicionGPSRepository.create(latitud, longitud);
        if (nuevaPosicionGPS != null) {
            console.log('Se creo correctamente una posicion');
        }
        else {
            console.log('Error al crear una posicion');
        }
        return nuevaPosicionGPS;
    });
}
exports.crearPosicionGPS = crearPosicionGPS;
function obtenerPosicionesGPS() {
    return __awaiter(this, void 0, void 0, function* () {
        let posicionesGPS = yield posicionGPSRepository.getAll();
        if (posicionesGPS != null) {
            console.log('Se obtuvieron las posiciones desde el servicio');
        }
        else {
            console.log('Posiciones null en el controlador');
        }
        return posicionesGPS;
    });
}
exports.obtenerPosicionesGPS = obtenerPosicionesGPS;
function eliminarPosicionesGPS() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield posicionGPSRepository.deleteAll();
    });
}
exports.eliminarPosicionesGPS = eliminarPosicionesGPS;
//# sourceMappingURL=posicionGPSService.js.map