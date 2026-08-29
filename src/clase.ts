//import { error } from "node:console";
//import fs from "node:fs/promises"; //Crear archivo 
//import path from "node:path"; //Crear ruta
import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express"; // Importando los dos tipos
import { cargarDatos } from "./data/estudiante.data.js";
import estudiantesRouter from "./routes/estudiantes.routes.js"

const app = Express();
const PORT = 3000;
app.use(Express.json()); //Nuestro Middleware

//Middleware para registrar las peticiones que se realizan
app.use((req:Request, res:Response, next:NextFunction) => {
    const timesTamp = new Date().toLocaleTimeString();
    console.log(`[${timesTamp}] ${req.method} / ${req.url}`);
    next();
})

//Jalamos todas las rutas edpoits
app.use("/estudiantes", estudiantesRouter);

app.listen(PORT, async() => {
    await cargarDatos();
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

//Funcion para leer el archivo JSON y convertir en un array estudiantes con async
/*
const obtenerEstudianets = async():Promise<Estudiante[]> =>{
    const ruta = path.resolve("src/ejercicio.json");
    const texto = await fs.readFile(ruta,"utf-8");
    return JSON.parse(texto);
}
*/

/*
let alumno:Estudiante[] = [
    {
    id: 1,
    nombre:"Kevin",
    pais:"Bolivia",
    edad: 23,
    activo: true,
    notas: [80, 90, 75],
    },
];

//Creamos un archivo Saludo.txt y mostramos un estudiante
const crearArchivo = async () => {
    const ruta = path.resolve("src/saludo.txt");
    let contenido = ``;
    alumno.forEach((alumno:Estudiante) => {
        contenido = contenido + `
        ${alumno.id} El estudiante ${alumno.nombre} es del pais ${alumno.pais}
        `;
    });
    await fs.writeFile(ruta,contenido,"utf8");
}

//Creando un JSON ejercicio.json que contiene un objeto alumno
const crearJason = async () => {
    const ruta = path.resolve("src/ejercicio.json");
    const contenidoJason = JSON.stringify(alumno,null,2);
    await fs.writeFile(ruta,contenidoJason,"utf8");
}

//Traen los datos de un JSON (estudiantes.json)y lo convierte en un array y envia a texto
const leerDatos = async () => {
    const ruta = path.resolve("src/estudiantes.json");
    const ruta2 = path.resolve("src/filtroEstudiante.txt");
    const texto = await fs.readFile(ruta,"utf8");
    const estudiantesRecuperados: Estudiante[] = JSON.parse(texto);
    const filtro = estudiantesRecuperados.filter((alumno:Estudiante) => {
        return alumno.activo == true && alumno.edad >= 20
    });
    console.log(filtro);
    let contenido = ``;
    filtro.forEach((alumno:Estudiante) => {
        contenido = contenido + `
        ${alumno.id} El estudiante ${alumno.nombre} es del pais ${alumno.pais}
        `;
    });
    await fs.writeFile(ruta2,contenido,"utf8")
}

crearArchivo();
crearJason();
leerDatos();
*/