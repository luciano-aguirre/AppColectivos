"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller = require("../controllers/paradaColectivoController");
function obtenerParadasColectivo(req, res) {
    controller.obtenerParadasColectivo(req, res);
}
exports.obtenerParadasColectivo = obtenerParadasColectivo;
;
/*
export function cargarParadasColectivo(req: express.Request, res: express.Response) {
    controller.cargarParadasColectivo(req, res);
};
*/
function eliminarParadasColectivo(req, res) {
    controller.eliminarParadasColectivo(req, res);
}
exports.eliminarParadasColectivo = eliminarParadasColectivo;
;
//# sourceMappingURL=paradaColectivoRoutes.js.map