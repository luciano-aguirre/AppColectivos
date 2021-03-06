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
const paradaColectivoService = require("./paradaColectivoService");
const lineaColectivoRepository = require("../repositories/lineaColectivoRepository");
function obtenerNumeroLineas() {
    return __awaiter(this, void 0, void 0, function* () {
        let lineasColectivo = yield lineaColectivoRepository.getNumerosLinea();
        let numerosLinea = [];
        for (let i = 0; i < lineasColectivo.length; i++) {
            numerosLinea.push(lineasColectivo[i].linea);
        }
        return numerosLinea.sort((linea1, linea2) => {
            if (linea1.length < linea2.length) {
                return -1;
            }
            else if (linea1.length > linea2.length) {
                return 1;
            }
            else {
                let nroLinea1 = parseInt(linea1.toString());
                let nroLinea2 = parseInt(linea2.toString());
                return nroLinea1 - nroLinea2;
            }
        });
    });
}
exports.obtenerNumeroLineas = obtenerNumeroLineas;
function obtenerLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield lineaColectivoRepository.getAll();
    });
}
exports.obtenerLineasColectivo = obtenerLineasColectivo;
function obtenerLineaColectivo(linea) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield lineaColectivoRepository.getByLineaPopulated(linea);
    });
}
exports.obtenerLineaColectivo = obtenerLineaColectivo;
function actualizarLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield eliminarLineasColectivo();
        yield cargarLineasColectivo();
    });
}
exports.actualizarLineasColectivo = actualizarLineasColectivo;
function cargarLineasColectivo() {
    return __awaiter(this, void 0, void 0, function* () {
        let lineas = ['500', '502', '503', '504', '505', '506', '507', '509', '512', '513', '514', '516', '517', '518', '519', '519 a'];
        for (let i = 0; i < lineas.length; i++) {
            yield cargarLineaColectivo(lineas[i]);
        }
    });
}
function cargarLineaColectivo(linea) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield req('http://api.datos.bahiablanca.gob.ar/api/v2/datastreams/PARAD-DE-COLEC/data.json/?auth_key=a049a7553f75ed50c8fab78b1685e7ac83c8d0a4&filter0=column0[==]' + linea);
        const dataJSON = yield res.json();
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