import express = require('express');
import controller = require("../controllers/posicionGPSController");

export function obtenerPosicionesGPS(req: express.Request, res: express.Response) {
    controller.obtenerPosicionesGPS(req, res);
};
/*
export function cargarPosicionesGPS(req: express.Request, res: express.Response) {
    controller.cargarPosicionesGPS(req, res);
};
*/
export function eliminarPosicionesGPS(req: express.Request, res: express.Response) {
    controller.eliminarPosicionesGPS(req, res);
};
