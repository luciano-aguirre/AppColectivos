"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.paradaColectivoSchema = new mongoose.Schema({
    linea: Number,
    posicion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PosicionGPS' },
    sentido: String
});
exports.repository = mongoose.model('ParadaColectivo', exports.paradaColectivoSchema);
//# sourceMappingURL=paradaColectivoModel.js.map