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
const posicionGPSService = require("../services/posicionGPSService");
/*
export function obtenerPosicionGPS(req: express.Request, res: express.Response) {

    let posicionGPSID: string = req.params.id;
    let posicionGPS: IPosicionGPS = posicionesGPSRepository.obtenerPosicionGPS(posicionGPSID);

    if (posicionGPS == null) {
        res.send('No se pudo recuperar la posicion especificada');
    } else {
        res.send('Posicion GPS ID: ' + posicionGPS.id + ' (' + posicionGPS.latitud + ',' + posicionGPS.longitud + ')');
    }
}
*/
function obtenerPosicionesGPS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let posicionesGPS = yield posicionGPSService.obtenerPosicionesGPS();
        if (posicionesGPS != null) {
            res.status(200).json(posicionesGPS);
        }
        else {
            res.status(400).send('Posiciones null en el controlador');
        }
    });
}
exports.obtenerPosicionesGPS = obtenerPosicionesGPS;
/*
export async function cargarPosicionesGPS(req: express.Request, res: express.Response) {

    let linea: number = req.params.linea;
    try {
        await posicionGPSService.cargarPosiciones(linea);
        res.status(200).send('Se cargaron las paradas de la linea ' + linea);

    } catch (error) {
        res.status(400).send('Error al cargar las posiciones de la linea ' + linea);
    }
}*/
//https://nodejs.org/api/http.html#http_class_http_incomingmessage
//https://github.com/request/request#requestoptions-callback
//https://github.com/francotripi/Proyecto-Final-IAW-2015-Colectivos/blob/master/Cliente/modules/map.js
function eliminarPosicionesGPS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let resultado = yield posicionGPSService.eliminarPosicionesGPS();
        if (resultado) {
            res.status(200).send('Se borro la BD');
        }
        else {
            res.status(400).send('Eliminar la BD no dio error, dio falso');
        }
    });
}
exports.eliminarPosicionesGPS = eliminarPosicionesGPS;
//# sourceMappingURL=posicionGPSController.js.map