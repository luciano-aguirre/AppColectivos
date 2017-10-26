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
const lineaColectivoModel = require("../models/lineaColectivoModel");
var repositoryLineaColectivo = lineaColectivoModel.repository;
function create(linea, paradas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repositoryLineaColectivo.create({ linea: linea, paradas: paradas, cantidadParadas: paradas.length });
    });
}
exports.create = create;
function getNumerosLinea() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repositoryLineaColectivo.find({}, { linea: 1 }).exec();
    });
}
exports.getNumerosLinea = getNumerosLinea;
function getByLinea(linea) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repositoryLineaColectivo.findOne({ linea: linea }).exec(); /*.populate({
            path: 'paradas',
            model: 'ParadaColectivo',
            populate: {
                path: 'posicion_id',
                model: 'PosicionGPS'
            }
        }).exec();*/
    });
}
exports.getByLinea = getByLinea;
function getByLineaPopulated(linea) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repositoryLineaColectivo.findOne({ linea: linea }).populate({
            path: 'paradas',
            model: 'ParadaColectivo',
            populate: {
                path: 'posicion_id',
                model: 'PosicionGPS'
            }
        }).exec();
    });
}
exports.getByLineaPopulated = getByLineaPopulated;
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        //http://techqa.info/programming/question/32174803/mongoose-two-level-population-using-keystonejs
        return yield repositoryLineaColectivo.find({}).exec(); /*.populate({
            path: 'paradas',
            model: 'ParadaColectivo',
            populate: {
                path: 'posicion_id',
                model: 'PosicionGPS'
            }
        }).exec();*/
    });
}
exports.getAll = getAll;
function deleteAll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield repositoryLineaColectivo.remove({}).exec();
        return true;
    });
}
exports.deleteAll = deleteAll;
//# sourceMappingURL=lineaColectivoRepository.js.map