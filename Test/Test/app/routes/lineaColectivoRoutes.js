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
const controller = require("../controllers/lineaColectivoController");
function obtenerLineasColectivo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield controller.obtenerLineasColectivo(req, res);
    });
}
exports.obtenerLineasColectivo = obtenerLineasColectivo;
;
function actualizarLineasColectivo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield controller.actualizarLineasColectivo(req, res);
    });
}
exports.actualizarLineasColectivo = actualizarLineasColectivo;
/*
export function cargarLineaColectivo(req: express.Request, res: express.Response) {
    controller.cargarLineasColectivo(req, res);
};

export function eliminarLineasColectivo(req: express.Request, res: express.Response) {
    controller.eliminarLineasColectivo(req, res);
};
*/ 
//# sourceMappingURL=lineaColectivoRoutes.js.map