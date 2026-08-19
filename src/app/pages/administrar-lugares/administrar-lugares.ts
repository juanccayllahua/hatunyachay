import { Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lugar } from '../../models/lugar';
import { LugarServices } from '../../services/lugar-services';
import { AsyncPipe } from '@angular/common';
import * as L from 'leaflet';


@Component({
  selector: 'app-administrar-lugares',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './administrar-lugares.html',
  styleUrl: './administrar-lugares.css',
})
export class AdministrarLugares {

  private lugarService = inject(LugarServices);
  private ngZone = inject(NgZone);

  private adminMap?: L.Map;
  private marcador?: L.Marker;

  lugares$ = this.lugarService.obtenerLugares();

  mostrarFormulario = false;
  editando = false;
  lugarActual: Lugar = this.nuevoLugar();


  cantidad: number = 0



  nuevoLugar(): Lugar {

    return {
      id: 0,
      nombre: '',
      categoria: '',
      descripcion: '',
      lat: 0,
      lng: 0,
      imagen: ''
    };

  }

  private inicializarMapa(): void {

    setTimeout(() => {

      if (this.adminMap) {
        this.adminMap.remove();
      }

      this.adminMap = L.map('admin-map')
        .setView(
          [
            this.lugarActual.lat || -14.88,
            this.lugarActual.lng || -70.59
          ],
          14
        );

      L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(this.adminMap);

      this.adminMap.on('click', (evento: L.LeafletMouseEvent) => {

        console.log('📍 Click en el mapa:', {
          lat: evento.latlng.lat,
          lng: evento.latlng.lng
        });

        this.ngZone.run(() => {
          this.lugarActual.lat = evento.latlng.lat;
          this.lugarActual.lng = evento.latlng.lng;

          this.colocarMarcador(
            evento.latlng.lat,
            evento.latlng.lng
          );
        });

      });

      if (
        this.lugarActual.lat !== 0 &&
        this.lugarActual.lng !== 0
      ) {

        this.colocarMarcador(
          this.lugarActual.lat,
          this.lugarActual.lng
        );

      }

    }, 0);
  }

  private colocarMarcador(lat: number, lng: number): void {

    if (!this.adminMap) {
      return;
    }

    if (this.marcador) {
      this.marcador.remove();
    }

    const iconoAzul = L.icon({
      iconUrl: 'gps.png',
      iconSize: [32, 32],      // ancho x alto del icono en px
      iconAnchor: [16, 32],    // punto del icono que corresponde a la coordenada (normalmente la punta inferior)
      popupAnchor: [0, -32]    // si usas popups, desde dónde salen
    });

    this.marcador = L.marker([lat, lng], {
      draggable: true,
      icon: iconoAzul
    }).addTo(this.adminMap);

    this.marcador.on('dragend', () => {

      const posicion = this.marcador!.getLatLng();

      console.log('🖱️ Marcador soltado en:', {
        lat: posicion.lat,
        lng: posicion.lng
      });

      this.ngZone.run(() => {
        this.lugarActual.lat = posicion.lat;
        this.lugarActual.lng = posicion.lng;
      });

    });

  }
  nuevo(): void {

    this.editando = false;

    this.lugarActual = this.nuevoLugar();

    this.mostrarFormulario = true;
    this.inicializarMapa();

  }


  editar(lugar: Lugar): void {

    this.editando = true;

    this.lugarActual = {
      ...lugar
    };

    this.mostrarFormulario = true;
    this.inicializarMapa();


  }


  guardar(): void {

    if (!this.lugarActual.nombre.trim()) {
      return;
    }


    // EDITAR
    if (this.editando) {

      this.lugarService.actualizarLugar(
        this.lugarActual
      );

    }


    // CREAR
    else {

      const nuevo: Lugar = {
        ...this.lugarActual,
        id: Date.now()
      };

      this.lugarService.agregarLugar(nuevo);

    }

    this.cancelar();

  }


  eliminar(lugar: Lugar): void {

    const confirmar = confirm(
      `¿Eliminar "${lugar.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.lugarService.eliminarLugar(
      lugar.id
    );

  }


  cancelar(): void {

    this.mostrarFormulario = false;

    this.lugarActual = this.nuevoLugar();

  }

  exportarJSON(): void {
    this.lugarService.exportarJSON();
  }
  cargarDesdeJSON(): void {

    const confirmar = confirm(
      'Los datos actuales serán reemplazados por los datos del archivo JSON. ¿Continuar?'
    );

    if (!confirmar) {
      return;
    }

    this.lugarService.cargarDesdeJSON();

  }
  limpiarLocalStorage(): void {

    const confirmar = confirm(
      '¿Seguro que quieres eliminar todos los datos guardados?'
    );

    if (!confirmar) {
      return;
    }

    this.lugarService.limpiarLocalStorage();

  }
}
