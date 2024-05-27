import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

interface Evento{
  eventoId: number | null,
  nombre: string,
  descripcion: string,
  ubicacion: string,
  fecha: Date,
  dependenciaId: number,
  precio: number,
  numeroAsiento: number,
  categoriaId: number,
  mes: string,
  dia: number
}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.getEventInfo();
  }

  eventId: number = parseInt(this.route.snapshot.params['id']);

  event: Evento = {
    eventoId: 0,
    nombre: '',
    descripcion: '',
    ubicacion: '',
    fecha: new Date,
    dependenciaId: 0,
    precio: 0,
    numeroAsiento: 0,
    categoriaId: 0,
    mes: '',
    dia: 0
  }

  getEventInfo(){
    this.apiService.getEventInfo(this.eventId).subscribe((data: any) => {
      this.event = data;
      this.cleanDate();
    },
    error => {
      console.error('Error al buscar el evento', error);
    })
  }

  cleanDate() {
    const date = new Date(this.event.fecha);
    this.event.mes = this.getNombreMes(date.getMonth()); // Get the month name
    this.event.dia = date.getDate()+1; // Get the day of the month
    this.year = date.getFullYear(); // Get the year
  }

  isOpen = false;

  setModalOpen(type: boolean){
    this.isOpen = type;
  }

  correoUsuario: string = '';

  registroEvento() {
    this.apiService.createTicket(this.eventId, this.correoUsuario, this.event.precio).subscribe(response => {
      console.log('Ticket creado:', response);
      // Aquí puedes agregar la lógica adicional para manejar la respuesta, como mostrar una notificación al usuario
    }, error => {
      console.error('Error al crear el ticket', error);
      // Aquí puedes agregar la lógica adicional para manejar errores
    });
    this.setModalOpen(false);
  }

  year: number = new Date(this.event.fecha).getFullYear();

  getNombreMes(numeroMes: number): string {
    const meses: string[] = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes];
  }

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

  dependencias: any[] = [
    'Departamento Escolar y de Archivo',
    'Departamento de Becas',
    'Centro de Evaluaciones',
    'Dirección de Servicio Social y Prácticas Profesionales',
    'Tesorería General',
    'Auditoría General',
    'Contraloría General',
    'Dirección de Recursos Humanos y Nóminas',
    'Teatro Universitario',
    'Unidad de Enlace de Transparencia y Acceso a la Información',
    'Dirección de Seguridad y Vigilancia',
    'Dirección de Servicios Generales',
    'Centro de Producción Agropecuaria',
    'Secretaría General',
    'Centro Regional de Fomento Ganadero Vallecillo',
    'Librería Universitaria',
    'Imprenta Universitaria',
    'Dirección General de Informática',
    'Secretaría Académica',
    'Dirección General de Deportes',
    'Centro Universitario de Salud',
    'Biblioteca Universitaria "RAÚL RANGEL FRÍAS"',
    'Dirección de Estudios del Nivel Medio Superior',
    'Centro de Estudios y Certificación de Lenguas Extranjeras',
    'Dirección de Estudios de Licenciatura',
    'Dirección de Futbol Americano Auténticos Tigres',
    'Polideportivo Tigres',
    'Dirección del Centro para el desarrollo de la Industria del Software',
    'Dirección de Orientación Vocacional Educativa',
    'Centro Acuático Olímpico Universitario',
    'Facultad de Ingeniería Mecánica y Eléctrica',
    'Facultad de Trabajo Social y Desarrollo Humano',
    'Facultad de Ciencias Químicas',
    'Facultad de Organización Deportiva',
    'Facultad de Ciencias Físico Matemáticas',
    'Facultad de Arquitectura',
    'Facultad de Enfermería',
    'Facultad de Contaduría Pública y Administración',
    'Facultad de Psicología',
    'Facultad de Derecho y Criminología',
    'Facultad de Ciencias Políticas y Administración Pública',
    'Facultad de Ingeniería Civil',
    'Facultad de Ciencias de la Comunicación',
    'Facultad de Salud Pública y Nutrición',
    'Facultad de Odontología',
    'Facultad de Ciencias Forestales',
    'Facultad de Medicina Veterinaria y Zootecnia',
    'Facultad de Artes Visuales',
    'Subdirección de Estudios de Posgrado (Facultad de Medicina)',
    'Laboratorio de Servicio del Departamento de Química Analítica (Facultad de Medicina)',
    'Serv. de Anatomía Patológica y Citopatología (Facultad de Medicina)',
    'Laboratorio de Servicio de Inmunología (Facultad de Medicina)',
    'Departamento de Microbiología e Inmunología (Facultad de Ciencias Biológicas)',
    'Instituto de Biotecnología (Facultad de Ciencias Biológicas)',
    'Escuela Preparatoria No. 1',
    'Escuela Preparatoria No. 2',
    'Escuela Preparatoria No. 3',
    'Escuela Preparatoria No. 4',
    'Escuela Preparatoria No. 5',
    'Escuela Preparatoria No. 6',
    'Escuela Preparatoria No. 7',
    'Escuela Preparatoria No. 8',
    'Escuela Preparatoria No. 9',
    'Escuela Preparatoria No. 10',
    'Escuela Preparatoria No. 11',
    'Escuela Preparatoria No. 12',
    'Escuela Preparatoria No. 13',
    'Escuela Preparatoria No. 14',
    'Escuela Preparatoria No. 15',
    'Escuela Preparatoria No. 16',
    'Escuela Preparatoria No. 17',
    'Escuela Preparatoria No. 18',
    'Escuela Preparatoria No. 19',
    'Escuela Preparatoria No. 20',
    'Escuela Preparatoria No. 21',
    'Escuela Preparatoria No. 22',
    'Escuela Preparatoria No. 23',
    'Escuela Preparatoria No. 24',
    'Preparatoria No. 25 Dr. Eduardo Aguirre Pequeño',
    'Escuela Industrial y Preparatoria Técnica Álvaro Obregón',
    'Escuela Industrial y Preparatoria Técnica Pablo Livas',
    'Escuela y Preparatoria Técnica Médica',
    'Centro de Investigación y Desarrollo de Educación Bilingüe – CIDEB'
  ]


}
