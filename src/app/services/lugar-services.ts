import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lugar } from '../models/lugar';


@Injectable({
  providedIn: 'root'
})

export class LugarServices {

  private http = inject(HttpClient);

  private url = '/data/lugares.json';

  private lugaresSubject =
    new BehaviorSubject<Lugar[]>([]);

  lugares$ = this.lugaresSubject.asObservable();

  constructor() {
    this.cargarLugares();
  }
  cargarDesdeJSON(): void {

    this.http.get<Lugar[]>(this.url)
      .subscribe(lugares => {
  
        this.guardarLocalStorage(lugares);
  
        this.lugaresSubject.next(lugares);
  
      });
  
  }


  cargarLugares(): void {

    const guardados = localStorage.getItem('lugares');
  
    if (!guardados) {
      return;
    }
  
    const lugares: Lugar[] = JSON.parse(guardados);
  
    this.lugaresSubject.next(lugares);
  
  }
  private guardarLocalStorage(lugares: Lugar[]): void {

    localStorage.setItem(
      'lugares',
      JSON.stringify(lugares)
    );

  }

  obtenerLugares(): Observable<Lugar[]> {

    return this.lugares$;

  }

  agregarLugar(lugar: Lugar): void {

    const lugares = this.lugaresSubject.value;

    const nuevosLugares = [
      ...lugares,
      lugar
    ];

    this.lugaresSubject.next(nuevosLugares);

    this.guardarLocalStorage(nuevosLugares);

  }

  actualizarLugar(lugar: Lugar): void {

    const lugares = this.lugaresSubject.value;

    const nuevosLugares = lugares.map(l =>
      l.id === lugar.id
        ? { ...lugar }
        : l
    );

    this.lugaresSubject.next(nuevosLugares);

    this.guardarLocalStorage(nuevosLugares);

  }

  eliminarLugar(id: number): void {

    const lugares = this.lugaresSubject.value;

    const nuevosLugares =
      lugares.filter(l => l.id !== id);

    this.lugaresSubject.next(nuevosLugares);

    this.guardarLocalStorage(nuevosLugares);

  }

  exportarJSON(): void {

    const lugares = this.lugaresSubject.value;
  
    const json = JSON.stringify(lugares, null, 2);
  
    const blob = new Blob(
      [json],
      { type: 'application/json' }
    );
  
    const url = URL.createObjectURL(blob);
  
    const enlace = document.createElement('a');
  
    enlace.href = url;
    enlace.download = 'lugares.json';
  
    enlace.click();
  
    URL.revokeObjectURL(url);
  }

  limpiarLocalStorage(): void {

    localStorage.removeItem('lugares');
  
    this.lugaresSubject.next([]);
  
  }

}