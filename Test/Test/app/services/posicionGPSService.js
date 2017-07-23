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
function crearPosicionGPS(latitud, longitud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield posicionGPSRepository.create(latitud, longitud);
    });
}
exports.crearPosicionGPS = crearPosicionGPS;
function obtenerPosicionesGPS() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield posicionGPSRepository.getAll();
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