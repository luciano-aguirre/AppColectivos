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
const posicionGPSModel = require("../models/posicionGPSModel");
var repository = posicionGPSModel.repository;
function create(latitud, longitud) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Si existe una posicion GPS con esa latitud y longitud la devuelve, en caso contrario la crea
            let posicionGPS = yield repository.findOne({ latitud: latitud, longitud: longitud }).exec();
            if (posicionGPS == null) {
                posicionGPS = yield repository.create({ latitud: latitud, longitud: longitud });
            }
            return posicionGPS;
        }
        catch (error) {
            console.log('No se pudo crear una posicion en el repositorio');
            return null;
        }
    });
}
exports.create = create;
function obtenerPosicionGPS(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repository.findById(id).exec();
    });
}
exports.obtenerPosicionGPS = obtenerPosicionGPS;
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let posicionesGPS = yield repository.find({}).exec();
            console.log('Se obtuvieron las posiciones desde el repositorio');
            return posicionesGPS;
        }
        catch (error) {
            console.log('Error al obtener las paradas desde el repositorio');
            return null;
        }
    });
}
exports.getAll = getAll;
function deleteAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield repository.remove({}).exec();
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.deleteAll = deleteAll;
//# sourceMappingURL=posicionGPSRepository.js.map