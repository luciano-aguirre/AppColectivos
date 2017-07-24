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
const lineaColectivoService = require("../services/lineaCOlectivoService");
function obtenerLineasColectivo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let lineas = yield lineaColectivoService.obtenerLineasColectivo();
        if (lineas != null) {
            res.status(200).json(lineas);
        }
        else {
            res.status(400).send('Error al obtener las paradas en el controlador');
        }
    });
}
exports.obtenerLineasColectivo = obtenerLineasColectivo;
function actualizarLineasColectivo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield lineaColectivoService.actualizarLineasColectivo();
            res.status(200).send('Se actualizaron las lineas de colectivo en la BD');
        }
        catch (error) {
            res.status(400).send('Error al actualizar las lineas de colectivo de la BD');
            console.log(error);
        }
    });
}
exports.actualizarLineasColectivo = actualizarLineasColectivo;
/*
export async function cargarLineasColectivo(req: express.Request, res: express.Response) {
    
    try {
        await lineaColectivoService.cargarLineasColectivo();
        res.status(200).send('Se cargaron todas las lineas de colectivo');

    } catch (error) {
        res.status(400).send('Error al cargar las lineas de colectivo');
    }
}
*/
/*
export async function eliminarLineasColectivo(req: express.Request, res: express.Response) {

    let resultado: Boolean = await lineaColectivoService.eliminarLineasColectivo();
    if (resultado) {
        res.status(200).send('Se eliminaron las lineas de colectivo de la BD');
    } else {
        res.status(400).send('No se eliminaron las lineas de colectivo de la BD');
    }
}
*/ 
//# sourceMappingURL=lineaColectivoController.js.map