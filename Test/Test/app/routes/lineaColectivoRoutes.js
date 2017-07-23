"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("../controllers/lineaColectivoController");
function obtenerLineasColectivo(req, res) {
    controller.obtenerLineasColectivo(req, res);
}
exports.obtenerLineasColectivo = obtenerLineasColectivo;
;
function cargarLineaColectivo(req, res) {
    controller.cargarLineasColectivo(req, res);
}
exports.cargarLineaColectivo = cargarLineaColectivo;
;
function eliminarLineasColectivo(req, res) {
    controller.eliminarLineasColectivo(req, res);
}
exports.eliminarLineasColectivo = eliminarLineasColectivo;
;
//# sourceMappingURL=lineaColectivoRoutes.js.map