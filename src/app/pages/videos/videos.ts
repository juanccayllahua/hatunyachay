import { Component } from '@angular/core';
import { Video } from '../../models/video';

@Component({
  selector: 'app-videos',
  imports: [],
  
templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class Videos {

  
  videos: Video[] = [
    {
      id: 1,
      titulo: 'Descubre Ayaviri',
      categoria: 'CULTURA',
      miniatura: 'kolkeparque.jpeg',
      archivo: 'video/reportajealperuayaviri.mp4',
      duracion: '03:42',
      featured: true,
    },
    {
      id: 2,
      titulo: 'Tinajani',
      categoria: 'NATURALEZA',
      miniatura: 'tinajani.png',
      archivo: 'video/tinajani.mp4',
      duracion: '02:18',
    },
    {
      id: 3,
      titulo: 'Kolqueparque',
      categoria: 'NATURALEZA',
      miniatura: 'kolqueparquev1.jpeg',
      archivo: 'video/kolqueparque.mp4',
      duracion: '01:54',
    },
    {
      id: 4,
      titulo: 'Iglesia San Francisco',
      categoria: 'PATRIMONIO',
      miniatura: 'templosanfrancisco.jpeg',
      archivo: 'video/templosanfrancisco.mp4',
      duracion: '03:05',
    },
    {
      id: 5,
      titulo: 'Tradiciones de Ayaviri',
      categoria: 'EVENTOS',
      miniatura: 'kolkeparque.jpeg',
      archivo: 'video/tradiciones.mp4',
      duracion: '02:47',
    },
    {
      id: 6,
      titulo: 'Melgar',
      categoria: 'CULTURA',
      miniatura: 'tinajani.png',
      archivo: 'video/melgar.mp4',
      duracion: '04:12',
    },
  ];

  videoReproduciendoId: number | null = null;

  reproducir(id: number) {
    this.videoReproduciendoId = id;
  }

  detener(id: number) {
    if (this.videoReproduciendoId === id) {
      this.videoReproduciendoId = null;
    }
  }

}
