"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.posicionGPSSchema = new mongoose.Schema({
    latitud: Number,
    longitud: Number
});
//VER CUANDO USAR Number o number
var TipoPunto;
(function (TipoPunto) {
    TipoPunto[TipoPunto["foot"] = 0] = "foot";
    TipoPunto[TipoPunto["bus"] = 1] = "bus";
})(TipoPunto = exports.TipoPunto || (exports.TipoPunto = {}));
;
exports.repository = mongoose.model('PosicionGPS', exports.posicionGPSSchema);
//# sourceMappingURL=posicionGPSModel.js.map