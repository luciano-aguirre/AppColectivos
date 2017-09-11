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
const procesoTrasladoService = require("../services/procesoTrasladoService");
function calcularTrayecto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let origen = req.body.origen;
        let destino = req.body.destino;
        let trayecto = yield procesoTrasladoService.calcularTrayecto(origen, destino);
        if (trayecto[3] == -1) {
            res.status(404).send('Error al calcular el trayecto');
        }
        else {
            res.status(200).send('El usuario debe caminar en total ' + trayecto[3] + ' metros usando la linea de colectivo ' + trayecto[0]);
        }
    });
}
exports.calcularTrayecto = calcularTrayecto;
//# sourceMappingURL=procesoTrasladoController.js.map