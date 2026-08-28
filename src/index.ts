import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express";; // Importando los dos tipos
import fs from "node:fs/promises"; //Crear archivo 
import path from "node:path"; //Crear ruta

const app = Express();
const PORT = 3000;
app.use(Express.json());

app.get("/api/status", (req:Request, res:Response) => {
    res.json({
        status:"Servidor en Linea",
        version:"1.0.0",
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});