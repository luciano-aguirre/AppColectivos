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
const posicionGPSService = require("./posicionGPSService");
const paradaColectivoRepository = require("../repositories/paradaColectivoRepository");
function crearParadaColectivo(linea, latitud, longitud, sentido) {
    return __awaiter(this, void 0, void 0, function* () {
        let posicionGPS = yield posicionGPSService.crearPosicionGPS(latitud, longitud);
        let parada = yield paradaColectivoRepository.create(linea, posicionGPS, sentido);
        return parada;
    });
}
exports.crearParadaColectivo = crearParadaColectivo;
function obtenerParadaColectivo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield paradaColectivoRepository.obtenerParadaColectivo(id);
    });
}
exports.obtenerParadaColectivo = obtenerParadaColectivo;
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