export interface Estudiante{
    id:number; 
    nombre:string;
    pais:string;
    edad: number;
    activo:boolean;
    notas:number[];
}

export interface crearEstudiante{
    nombre:string;
    pais:string;
    edad: number;
    notas?:number[];
}

export interface actualizarEstudiante{
    nombre:string;
    pais:string;
    edad: number;
    activo:boolean;
    notas:number[];
}
export interface estudiantesFiltrados{
    nombre?: string;
    pais?: string;
    minEdad?: string;
    activo?: string;
}
export interface notasParams{
    id:string;
    notaIndex:string;
}
export interface idBuscado{
    id:string;
}