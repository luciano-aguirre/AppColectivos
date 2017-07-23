"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.lineaColectivoSchema = new mongoose.Schema({
    linea: String,
    paradas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PosicionGPS' }],
    cantidadParadas: Number
});
exports.repository = mongoose.model('LineaColectivo', exports.lineaColectivoSchema);
//# sourceMappingURL=lineaColectivoModel.js.map