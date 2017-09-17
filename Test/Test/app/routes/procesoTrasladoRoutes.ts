import express = require('express');
import controller = require("../controllers/procesoTrasladoController");

export async function calcularTrayecto(req: express.Request, res: express.Response) {
    await controller.calcularTrayecto(req, res);
};

export function conexionServidor(req: express.Request, res: express.Response) {
    controller.conexionServer(req, res);
}