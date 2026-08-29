import {Router} from "express";
import type { NextFunction, Request, Response } from "express"; // Importando los dos tipos

import {
    listaEstudiantes,
    setListaEstudiantes,
    cargarDatos
} from "../data/estudiante.data.js";

import type { Estudiante,
    crearEstudiante,
    actualizarEstudiante,
    estudiantesFiltrados,
    idBuscado,
    notasParams 
} from "../types/estudiante.types.js";

const router = Router();

router.get("/estudiantes", (req:Request, res:Response) => {
    res.json(listaEstudiantes);
});

//req.query edpoints para hacer peticion de estudiantes filtrados
router.get("/estudiantes/filtro", (req:Request<{},{},{},estudiantesFiltrados>,res:Response) => {
    const {nombre, pais, minEdad, activo} = req.query;
    let resultado = [...listaEstudiantes];
    //Filtros
    if(pais) {
        resultado = resultado.filter((e) => e.pais.toLowerCase() === pais.toLowerCase());
    }
    if(nombre) {
        resultado = resultado.filter((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
    }
    if(minEdad) {
        const edadNumerica = Number(minEdad);
        if(!isNaN(edadNumerica)) {
            resultado = resultado.filter((e) => e.edad >= edadNumerica);
        }
        else {
            return res.json({error: "el edad minima debe de ser un numero"});
        }
    }
    if(activo) {
        if(activo.toLowerCase() === "true" || activo.toLowerCase() === "false") {
            const esActivo = activo.toLowerCase() === "true";
            resultado = resultado.filter((e) => e.activo === esActivo)
        }
        else{
            return res.json({error: "el estado activo debe ser true o false"})
        }
    }
    //mostrar resultado
    return res.json({
        total: resultado.length,
        datos: resultado,
    })
});

//edpoints para traer a todos los estudiantes por su id Creando ruta HTTP
router.get("/estudiantes/:id", (req:Request<idBuscado>, res:Response) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({error:"El parametro id debe ser un numero valido"})
    }

    const estudiante = listaEstudiantes.find((estudiante) => estudiante.id === id);
    if(!estudiante){
        return res.status(404).json({mensaje:"estudiante no encontrado"});
    }
    res.json(estudiante);
});

//Creando ruta HTTP
router.get("/", (req:Request, res:Response) => {
    res.send("Servidor listo mi programador");
});

//Crear estudiante
router.post("/estudiantes", (req:Request<{},{},crearEstudiante>, res:Response) =>{
    const {nombre,pais,edad,notas} = req.body;
    if(!nombre || !pais || !edad) {
        return res.status(400).json({error: "Faltan datos que son obligatorios"});
    }
    const nuevoEstudiante:Estudiante = {
        id: listaEstudiantes.length > 0 ?listaEstudiantes.length + 1 : 1,
        nombre,
        pais,
        edad,
        activo: true,
        notas: notas?? [],
    };
    listaEstudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);

});

//Actualizamos estudiante
router.put("/estudiantes/:id", (req:Request, res:Response) => {
    const id = Number(req.params.id);
    const index = listaEstudiantes.findIndex((e) => e.id === id);
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const {nombre,pais,edad,activo,notas}:actualizarEstudiante = req.body;

    listaEstudiantes[index] = {
        id:id,
        nombre:nombre ?? listaEstudiantes[index]?.nombre,
        pais:pais ?? listaEstudiantes[index]?.pais,
        edad:edad ?? listaEstudiantes[index]?.edad,
        activo:activo ?? listaEstudiantes[index]?.activo,
        notas:notas ?? listaEstudiantes[index]?.notas,
    };
    res.status(200).json(listaEstudiantes[index])
});

//Borramos estudiante
router.delete("/estudiantes/:id", (req:Request, res:Response) =>{
    const id = Number(req.params.id);
    const index = listaEstudiantes.findIndex((e) => e.id === id);
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const eliminado = listaEstudiantes[index];
    let listaNueva = listaEstudiantes.filter((e) => e.id !==id);
    setListaEstudiantes(listaNueva);
    res.status(200).json(`Estudiante eliminado Exitosamente ${eliminado?.nombre}`);
})

//rutas definidas anidadas
router.get("/estudiantes/:id/nota/:notaIndex", (req:Request<notasParams>, res:Response) => {
    const id = Number(req.params.id);
    const index = Number(req.params.notaIndex);
    if(isNaN(id)) {
        return res.status(400).json({error:"El parametro id debe ser un numero valido"})
    }

    const estudiante = listaEstudiantes.find((estudiante) => estudiante.id === id);
    if(!estudiante){
        return res.status(404).json({mensaje:"estudiante no encontrado"});
    }
    if(index < 0 || index >= estudiante.notas.length){
        return res.status(400).json({error:"nota no valida"});
    }
    res.json({estudiante:estudiante.nombre, notaindice:index, calificacion:estudiante.notas[index]});
});

export default router;