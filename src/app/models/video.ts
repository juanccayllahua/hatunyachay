export interface Video {
    id: number;
    titulo: string;
    categoria: string;
    miniatura: string;
    archivo: string;   // ruta del .mp4
    duracion: string;
    featured?: boolean;
  }