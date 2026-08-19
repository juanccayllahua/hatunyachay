import { Component, OnInit, inject } from '@angular/core';
// import { 
// } from '@angular/router';
import { MapaServices   } from '../../services/mapaServices'; 
import { LugarServices } from '../../services/lugar-services';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})


export class Sidebar  {

  private lugarService = inject(LugarServices);

  lugarSeleccionado$;
  // private lugarService = inject(LugarServices);
  lugares$ = this.lugarService.obtenerLugares();


  constructor(

    private mapaService: MapaServices
  ) {

    // this.lugares$ = this.mapaService.lugares$;

    this.lugarSeleccionado$ =
      this.mapaService.lugarSeleccionado$;

  }

  cerrarDetalle(): void {
    this.mapaService.limpiarSeleccion();
  }
}