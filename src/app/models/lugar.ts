export interface Lugar {
    id: number;
    nombre: string;
    categoria: string;
    descripcion: string;
    lat: number;
    lng: number;
    imagen: string;
    audio?: string; 
  }