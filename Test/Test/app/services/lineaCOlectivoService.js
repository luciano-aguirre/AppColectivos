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
const request = require("request");
const paradaColectivoService = require("./paradaColectivoService");
const lineaColectivoRepository = require("../repositories/lineaColectivoRepository");
function obtenerLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let lineas = yield lineaColectivoRepository.getAll();
            console.log('Se obtuvieron las lineas de colectivo desde el servicio');
            return lineas;
        }
        catch (error) {
            console.log('Error al obtener las lineas de colectivo desde el servicio');
            return null;
        }
    });
}
exports.obtenerLineasColectivo = obtenerLineasColectivo;
function actualizarLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield eliminarLineasColectivo();
        console.log('Se eliminaron las lineas de colectivo de la BD');
        yield cargarLineasColectivo();
        console.log('Se guardaron las lineas de colectivo en la BD');
    });
}
exports.actualizarLineasColectivo = actualizarLineasColectivo;
function cargarLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        let lineas = ['319', '500', '502', '503', '504', '505', '506', '507', '509', '512', '513', '514', '516', '517', '518', '519', '519 a'];
        lineas.forEach(function (linea) {
            return __awaiter(this, void 0, void 0, function* () {
                yield cargarLineaColectivo(linea);
            });
        });
    });
}
function cargarLineaColectivo(linea) {
    return __awaiter(this, void 0, void 0, function* () {
        request({
            method: 'GET',
            uri: 'http://api.datos.bahiablanca.gob.ar/api/v2/datastreams/PARAD-DE-COLEC/data.json/?auth_key=a049a7553f75ed50c8fab78b1685e7ac83c8d0a4&filter0=column0[==]' + linea
        }, function (error, response, body) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const dataJSON = JSON.parse(body);
                    let paradasJSON = dataJSON['result']['fArray'];
                    let numeroParadas = 0;
                    let posLatitud = 6;
                    let posLongitud = 7;
                    let posSentido = 9;
                    let paradas = [];
                    let nuevaParadaColectivo;
                    while (posLatitud < paradasJSON.length && posLongitud < paradasJSON.length && posSentido < paradasJSON.length) {
                        nuevaParadaColectivo = yield paradaColectivoService.crearParadaColectivo(linea, paradasJSON[posLatitud]['fStr'], paradasJSON[posLongitud]['fStr'], paradasJSON[posSentido]['fStr']);
                        paradas.push(nuevaParadaColectivo._id);
                        ++numeroParadas;
                        posLatitud += 4;
                        posLongitud += 4;
                        posSentido += 4;
                    }
                    yield lineaColectivoRepository.create(linea, paradas);
                    console.log('Se cargaron ' + numeroParadas + ' de la linea ' + linea);
                }
                catch (e) {
                    console.log('Error al cargar las paradas');
                    throw e;
                }
            });
        });
    });
}
function eliminarLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield lineaColectivoRepository.deleteAll();
            yield paradaColectivoService.eliminarParadasColectivos();
            console.log('Se eliminaron las lineas de colectivo del repositorio');
            return true;
        }
        catch (error) {
            console.log('No se pudieron eliminar las lineas de colectivo del repositorio');
            return false;
        }
    });
}
//# sourceMappingURL=lineaCOlectivoService.js.map