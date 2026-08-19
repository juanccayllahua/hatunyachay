import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Lugar } from '../models/lugar';

// export interface Lugar {
//   id: number;
//   nombre: string;
//   categoria: string;
//   descripcion: string;
//   lat: number;
//   lng: number;
// } 

@Injectable({
  providedIn: 'root'
})
export class MapaServices {

  
  // Lugar actualmente seleccionado
  private lugarSeleccionado =
    new BehaviorSubject<Lugar | null>(null);

  lugarSeleccionado$ =
    this.lugarSeleccionado.asObservable();


  // Lista de lugares
  private lugares =
    new BehaviorSubject<Lugar[]>([]);

  lugares$ =
    this.lugares.asObservable();


  // Seleccionar un lugar
  seleccionarLugar(lugar: Lugar): void {
    console.log('Lugar seleccionado:', lugar);

    this.lugarSeleccionado.next(lugar);
  }


  // Limpiar selección
  limpiarSeleccion(): void {
    this.lugarSeleccionado.next(null);
  }


  // Obtener todos los lugares
  obtenerLugares(): Lugar[] {
    return this.lugares.value;
  }


  // Agregar un lugar
  agregarLugar(lugar: Lugar): void {
    const lugaresActuales = this.lugares.value;

    this.lugares.next([
      ...lugaresActuales,
      lugar
    ]);
  }


  // Eliminar un lugar
  eliminarLugar(id: number): void {
    const lugaresActuales = this.lugares.value;

    this.lugares.next(
      lugaresActuales.filter(lugar => lugar.id !== id)
    );
  }

  // obtenerLugaresrr(): Observable<Lugar[]> {
  //   return this.lugares.value;

  // }
}
