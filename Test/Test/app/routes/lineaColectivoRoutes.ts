import express = require('express');
import controller = require("../controllers/lineaColectivoController");

export function obtenerLineasColectivo(req: express.Request, res: express.Response) {
    controller.obtenerLineasColectivo(req, res);
};

export function cargarLineaColectivo(req: express.Request, res: express.Response) {
    controller.cargarLineaColectivo(req, res);
};

export function eliminarLineasColectivo(req: express.Request, res: express.Response) {
    controller.eliminarLineasColectivo(req, res);
};