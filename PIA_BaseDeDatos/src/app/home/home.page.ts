import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  meses: any[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  categorias: any[] = [
    'Académico', 'Actividad de Formación Integral', 'Becas',
    'Caminata', 'Campamento', 'Campaña',
    'Cátedra', 'Ceremonia', 'Certamen',
    'Certificación', 'Ciclo de pelóculas', 'Clase magistral',
    'Coloquio', 'Concierto', 'Concurso',
    'Conferencia', 'Congreso', 'Conversatorio',
    'Convocatoria', 'Cultural', 'Cumbre',
    'Curso', 'Danza', 'Deportes',
    'Diálogo', 'Diplomado', 'Emprendimiento',
    'Encuentro', 'Espectáculo', 'Espectáculo Danza',
    'Eventos', 'Exposición', 'Feria',
    'Festival', 'Foro', 'Jornada',
    'Masterclass', 'Musical', 'Ópera',
    'Pláticas', 'Premio', 'Presentación',
    'Programa', 'Recorridos', 'Responsabilidad Social',
    'Reunión', 'Seminario', 'Sesión',
    'Sesión informativa', 'Simposio', 'Sorteo',
    'Taller', 'Teatro', 'Torneo', 
    'Transmisión', 'Turismo', 'Webinar'
  ]

  verdadero: boolean = true;
}
