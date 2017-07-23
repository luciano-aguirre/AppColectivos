import express = require('express');
import controller = require("../controllers/paradaColectivoController");

export function obtenerParadasColectivo(req: express.Request, res: express.Response) {
    controller.obtenerParadasColectivo(req, res);
};
/*
export function cargarParadasColectivo(req: express.Request, res: express.Response) {
    controller.cargarParadasColectivo(req, res);
};
*/
export function eliminarParadasColectivo(req: express.Request, res: express.Response) {
    controller.eliminarParadasColectivo(req, res);
};