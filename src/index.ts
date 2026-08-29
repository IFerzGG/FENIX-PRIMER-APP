import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express";; // Importando los dos tipos
import fs from "node:fs/promises"; //Crear archivo 
import path from "node:path"; //Crear ruta

const app = Express();
const PORT = 3000;
app.use(Express.json());

interface Estudiante{
    id:number; 
    nombre:string;
    email:string;
    bootcamp: number;
}
interface crearEstudiante{
    nombre:string;
    email:string;
    bootcamp: number;
}
interface actualizarEstudiante{
    nombre:string;
    email:string;
    bootcamp: number;
}
let estudiantes:Estudiante[] = [];

app.get("/api/status", (req:Request, res:Response) => {
    res.json({
        status:"Servidor en Linea",
        version:"1.0.0",
    });
});

app.get("/api/estudiantes", (req:Request,res:Response) => {
    res.json(estudiantes);
});

app.post("/api/estudiantes", (req:Request<{},{},crearEstudiante>, res:Response) => {
    const {nombre, email, bootcamp} = req.body;
    if(!nombre || !email || !bootcamp) {
        return res.status(400).json({error: "Hay algun campo incompleto"});
    }
    const nuevoEstudiante:Estudiante = {
        id: estudiantes.length + 1,
        nombre,
        email,
        bootcamp,
    }
    estudiantes.push(nuevoEstudiante);
    res.status(200).json(nuevoEstudiante);
});

app.put("/api/estudiantes/:id", (req:Request<{id:string},{},actualizarEstudiante>, res:Response) => {
    const id = Number(req.params.id);
    const index = estudiantes.findIndex((e) => e.id == id)
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const {nombre, email, bootcamp}:actualizarEstudiante = req.body;
    estudiantes[index] = {
        id:id,
        nombre: nombre ?? estudiantes[index]?.nombre,
        email: email ?? estudiantes[index]?.email,
        bootcamp: bootcamp ?? estudiantes[index]?.bootcamp
    }
    res.status(200).json(estudiantes[index]);
});

app.delete("/api/estudiantes/:id", (req:Request,res:Response) =>{
    const id = Number(req.params.id);
    const index = estudiantes.findIndex((e) => e.id == id)
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado por ende no se puede eliminar"});
    }
    const eliminado = estudiantes[index];
    estudiantes = estudiantes.filter((e) => e.id !==id );
    res.status(200).json(eliminado);
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});