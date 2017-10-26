export interface ICamino {
    puntaje: Number,
    distanciaCamino: Number,
    tiempoEstimadoCamino: Number,
    trayectos: ITrayecto[]
}

export interface ITrayecto {
    distanciaTrayecto: Number,
    tiempoEstimadoTrayecto: Number,
    modo: String,
    detalle: String,
    coordenadas: IPuntoTrayecto[]
}

export interface IPuntoTrayecto {
    latitude: Number,
    longitude: Number
}