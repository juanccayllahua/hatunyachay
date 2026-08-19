import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // redirectTo: 'inicio',
    // pathMatch: 'full'
    loadComponent: () =>
      import('./pages/principal/principal').then(m => m.Principal)
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./pages/mapa/mapa').then(m => m.Mapa)
  },{
    path: 'administrar-lugares',
    loadComponent: () =>
      import('./pages/administrar-lugares/administrar-lugares')
        .then(m => m.AdministrarLugares)
  },{
    path: 'videos',
    loadComponent: () =>
      import('./pages/videos/videos')
        .then(m => m.Videos)
  }

];