import Express  from "express"; // Importando express desde el paquete
import type { NextFunction, Request, Response } from "express"; // Importando los dos tipos
import { error } from "node:console";
import fs from "node:fs/promises"; //Crear archivo 
import path from "node:path"; //Crear ruta

const app = Express();
const PORT = 3000;
app.use(Express.json()); //Nuestro Middleware

//Middleware para registrar las peticiones que se realizan
app.use((req:Request, res:Response, next:NextFunction) => {
    const timesTamp = new Date().toLocaleTimeString();
    console.log(`[${timesTamp}] ${req.method} / ${req.url}`);
    next();
})

interface Estudiante{
    id:number; 
    nombre:string;
    pais:string;
    edad: number;
    activo:boolean;
    notas:number[];
}

interface crearEstudiante{
    nombre:string;
    pais:string;
    edad: number;
    notas?:number[];
}

interface actualizarEstudiante{
    nombre:string;
    pais:string;
    edad: number;
    activo:boolean;
    notas:number[];
}
let listaEstudiantes: Estudiante[] = [];

const cargarDatos = async() => {
    try{
        const ruta = path.resolve("src/estudiantes.json");
        const texto = await fs.readFile(ruta,"utf-8");
        listaEstudiantes = JSON.parse(texto);
        console.log(listaEstudiantes);
        console.log(`Datos cargados en memoria: ${listaEstudiantes.length} cargados`);
    } catch(error) {
        console.log("No se encontraron estudiantes en la lista");
        listaEstudiantes = [];
    }
}

//Funcion para leer el archivo JSON y convertir en un array estudiantes con async
/*
const obtenerEstudianets = async():Promise<Estudiante[]> =>{
    const ruta = path.resolve("src/ejercicio.json");
    const texto = await fs.readFile(ruta,"utf-8");
    return JSON.parse(texto);
}
*/

//edpoints para traer a todos los estudiantes Creando ruta HTTP
app.get("/estudiantes", (req:Request, res:Response) => {
    res.json(listaEstudiantes);
});

//req.query edpoints para hacer peticion de estudiantes filtrados
interface estudiantesFiltrados{
    nombre?: string;
    pais?: string;
    minEdad?: string;
    activo?: string;
}
app.get("/estudiantes/filtro", (req:Request<{},{},{},estudiantesFiltrados>,res:Response) => {
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
interface idBuscado{
    id:string;
}
app.get("/estudiantes/:id", (req:Request<idBuscado>, res:Response) => {
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
app.get("/", (req:Request, res:Response) => {
    res.send("Servidor listo mi programador");
});

//Crear estudiante
app.post("/estudiantes", (req:Request<{},{},crearEstudiante>, res:Response) =>{
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
app.put("/estudiantes/:id", (req:Request, res:Response) => {
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
app.delete("/estudiantes/:id", (req:Request, res:Response) =>{
    const id = Number(req.params.id);
    const index = listaEstudiantes.findIndex((e) => e.id === id);
    if(index === -1) {
        return res.status(404).json({error: "Estudiante no encontrado"});
    }
    const eliminado = listaEstudiantes[index];
    listaEstudiantes = listaEstudiantes.filter((e) => e.id !==id);
    res.status(200).json(`Estudiante eliminado Exitosamente ${eliminado?.nombre}`);
})

//rutas definidas anidadas
interface notasParams{
    id:string;
    notaIndex:string;
}
app.get("/estudiantes/:id/nota/:notaIndex", (req:Request<notasParams>, res:Response) => {
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

app.listen(PORT, async() => {
    await cargarDatos();
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
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