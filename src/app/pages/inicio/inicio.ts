import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import * as L from 'leaflet';

import { AsyncPipe } from '@angular/common';

import { LugarServices } from '../../services/lugar-services';
import {
  MapaServices 
} from '../../services/mapaServices';
import { Lugar } from '../../models/lugar';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements AfterViewInit {

  private lugarService = inject(LugarServices);

  private mapaService = inject(MapaServices);


  // Lugares para las tarjetas
  lugares$ = this.lugarService.obtenerLugares();


  // Mapa de Leaflet
  private map?: L.Map;


  // Guardamos los marcadores para poder acceder
  // a ellos cuando hacemos click en una tarjeta
  private markers = new Map<number, L.Marker>();


  // Lugar seleccionado
  lugarSeleccionado$ =
    this.mapaService.lugarSeleccionado$;


    @ViewChild('audioPlayer') audioPlayerRef?: ElementRef<HTMLAudioElement>;

    reproduciendoAudio = false;
    progresoAudio = 0;

  constructor(
    private lugarServices: LugarServices
  ) {}


  ngAfterViewInit(): void {

    // --------------------------------
    // CREAR MAPA
    // --------------------------------

    this.map = L.map('map', {
      zoomControl: true
    }).setView(
      [-14.88, -70.59],
      11
    );


    // --------------------------------
    // MAPA BASE
    // --------------------------------

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);


    // --------------------------------
    // ICONO
    // --------------------------------

    const gpsIcon = L.icon({

      iconUrl: 'gps.png',

      iconSize: [38, 38],

      iconAnchor: [19, 38],

      popupAnchor: [0, -38]

    });


    // --------------------------------
    // CARGAR LUGARES
    // --------------------------------

    this.lugarServices.lugares$
      .subscribe(lugares => {

        console.log(
          'Lugares recuperados:',
          lugares
        );


        lugares.forEach(lugar => {

          // Crear marcador
          const marker = L.marker(
            [
              lugar.lat,
              lugar.lng
            ],
            {
              icon: gpsIcon
            }
          );


          marker.bindPopup(`
          <div style="
          
            min-width: 160px;
            padding: 4px;
            font-family: Arial, sans-serif;
          ">
        
            <strong style="
              display: block;
              font-size: 15px;
              margin-bottom: 4px;
              color: white;
            ">
              ${lugar.nombre}
            </strong>
        
            <span style="
              display: block;
              font-size: 12px;
              color: #ccc;
              margin-bottom: 8px;
            ">
              ${lugar.categoria}
            </span>
        
            <a
              href="https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                padding: 5px 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #376e9e;
                color: #fff;
                font-size: 11px;
                text-decoration: none;
              "
            >
              📍 Ver en Google Maps ↗
            </a>
        
          </div>
        `);


          // Añadir al mapa
          marker.addTo(this.map!);


          // Guardar marcador
          this.markers.set(
            lugar.id,
            marker
          );


          // Click en marcador
          marker.on(
            'click',
            () => {

              console.log(
                'Marcador seleccionado:',
                lugar
              );

              this.mapaService.seleccionarLugar(
                lugar
              );

            }
          );

        });

      });

  }


  // ====================================
  // CLICK EN TARJETA
  // ====================================

  seleccionarLugar(lugar: Lugar): void {
    this.resetearAudio();
    console.log(
      'Tarjeta seleccionada:',
      lugar
    );


    // Comprobar que el mapa existe
    if (!this.map) {

      console.warn(
        'El mapa todavía no está inicializado'
      );

      return;
    }


    // --------------------------------
    // CENTRAR MAPA
    // --------------------------------

    this.map.flyTo(
      [
        lugar.lat,
        lugar.lng
      ],
      16,
      {
        animate: true,
        duration: 1.5
      }
    );


    // --------------------------------
    // ABRIR POPUP
    // --------------------------------

    const marker =
      this.markers.get(lugar.id);


    if (marker) {

      // Esperamos un poquito para que
      // el mapa termine de moverse

      setTimeout(() => {

        marker.openPopup();

      }, 800);

    }


    // --------------------------------
    // AVISAR AL SERVICIO
    // --------------------------------

    this.mapaService.seleccionarLugar(
      lugar
    );

  }


  // ====================================
  // CERRAR DETALLE
  // ====================================

  cerrarDetalle(): void {
    this.resetearAudio();
    this.mapaService.limpiarSeleccion();

  }

  // --------------------------------
  // MÉTODOS DE AUDIO
  // --------------------------------

  toggleAudio(_src: string): void {
    const audio = this.audioPlayerRef?.nativeElement;

    if (!audio) return;

    if (this.reproduciendoAudio) {
      audio.pause();
    } else {
      audio.play();
    }

    this.reproduciendoAudio = !this.reproduciendoAudio;
  }

  actualizarProgreso(event: Event): void {
    const audio = event.target as HTMLAudioElement;

    if (audio.duration) {
      this.progresoAudio = (audio.currentTime / audio.duration) * 100;
    }
  }

  finalizarAudio(): void {
    this.reproduciendoAudio = false;
    this.progresoAudio = 0;
  }

  private resetearAudio(): void {
    const audio = this.audioPlayerRef?.nativeElement;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    this.reproduciendoAudio = false;
    this.progresoAudio = 0;
  }

}