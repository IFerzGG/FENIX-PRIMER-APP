import fs from "node:fs/promises"; //Crear archivo 
import path from "node:path"; //Crear ruta
import type {Estudiante} from "../types/estudiante.types.js";

export let listaEstudiantes: Estudiante[] = [];

export const cargarDatos = async() => {
    try{
        const ruta = path.resolve("src/estudiantes.json");
        const texto = await fs.readFile(ruta,"utf-8");
        listaEstudiantes = JSON.parse(texto);
        console.log(`Datos cargados en memoria: ${listaEstudiantes.length} cargados`);
    } catch(error) {
        console.log("No se encontraron estudiantes en la lista");
        listaEstudiantes = [];
    }
}

export const setListaEstudiantes = (nuevaLista:Estudiante[]) => {
    listaEstudiantes = nuevaLista;
}