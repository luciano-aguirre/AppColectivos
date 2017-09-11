import express = require('express');
import controller = require("../controllers/lineaColectivoController");

export async function obtenerLineasColectivo(req: express.Request, res: express.Response) {
    await controller.obtenerLineasColectivo(req, res);
};

export async function actualizarLineasColectivo(req: express.Request, res: express.Response) {
    await controller.actualizarLineasColectivo(req, res);
}

export async function obtenerLineaColectivo(req: express.Request, res: express.Response) {
    await controller.obtenerLineaColectivo(req, res);
}

/*
export function cargarLineaColectivo(req: express.Request, res: express.Response) {
    controller.cargarLineasColectivo(req, res);
};

export function eliminarLineasColectivo(req: express.Request, res: express.Response) {
    controller.eliminarLineasColectivo(req, res);
};
*/