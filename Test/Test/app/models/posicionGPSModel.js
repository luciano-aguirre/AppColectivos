"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.posicionGPSSchema = new mongoose.Schema({
    latitud: Number,
    longitud: Number
});
//VER CUANDO USAR Number o number
exports.repository = mongoose.model('PosicionGPS', exports.posicionGPSSchema);
//# sourceMappingURL=posicionGPSModel.js.map