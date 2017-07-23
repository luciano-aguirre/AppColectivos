"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("../controllers/posicionGPSController");
function obtenerPosicionesGPS(req, res) {
    controller.obtenerPosicionesGPS(req, res);
}
exports.obtenerPosicionesGPS = obtenerPosicionesGPS;
;
/*
export function cargarPosicionesGPS(req: express.Request, res: express.Response) {
    controller.cargarPosicionesGPS(req, res);
};
*/
function eliminarPosicionesGPS(req, res) {
    controller.eliminarPosicionesGPS(req, res);
}
exports.eliminarPosicionesGPS = eliminarPosicionesGPS;
;
//# sourceMappingURL=posicionGPSRoutes.js.map