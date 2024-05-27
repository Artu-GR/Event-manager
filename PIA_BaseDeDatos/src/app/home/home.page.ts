import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { NuevoeventoService } from '../nuevoevento.service';
import { IonSelect } from '@ionic/angular';

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

interface Usuario{
  nombre: string,
  primerApellido: string,
  segundoApellido: string,
  correo: string,
  rolId: number,
  dependenciaId: number,
  afiliacion: string,
  metodoPagoId: number | null,
  contrasenia: string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  eventos: Evento[] = [];

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  isModalOpen2 = false;

  setOpen2(isOpen: boolean) {
    this.isModalOpen2 = isOpen;
  }

  isModalOpen3 = false;

  setOpen3(isOpen: boolean) {
    this.isModalOpen3 = isOpen;
  }

  evento: Evento = {
    eventoId: null,
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

  username: string = '';
  pass: string = '';
  passC: string = '';

  participante: Usuario = {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    rolId: 0,
    dependenciaId: 0,
    afiliacion: '',
    metodoPagoId: null,
    contrasenia: ''
  }

  userLogged: Usuario = {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    rolId: 0,
    dependenciaId: 0,
    afiliacion: '',
    metodoPagoId: null,
    contrasenia: ''
  }

  setSignUpForm(status: boolean){
    this.login = !status;
  }

  login: boolean = true;

  createUser(){

    if(this.passC != this.participante.contrasenia){
      console.log("Las contrasenas no coinciden");
      return;
    }

    this.apiService.createUser(this.participante).subscribe(
      response => {
        console.log('Participante registrado exitosamente', response);
      },
      error => {
        console.error('Error al registrar participante', error);
      }
    );
    this.setOpen3(false);
  }

  changeModal(state: number){
    if(state === 1){
      this.setOpen2(false);
      this.setOpen3(true);
    }
    if(state === 2){
      this.setOpen3(false);
      this.setOpen2(true);
    }
    
  }

  logIn() {
    if (this.username && this.pass) {
      this.apiService.getUserInfo(this.username).subscribe((data: any) => {
        if (data.contrasenia === this.pass) {
          this.sesionIniciada = true;
          this.setOpen2(false);
          this.userLogged = data;
        } else {
          console.log('Contraseña incorrecta');
        }
      }, error => {
        console.error('Error al iniciar sesión', error);
      });
    }
  }
  

  addEvent() {
    this.eventoService.crearEvento(this.evento).subscribe(
      response => {
        console.log('Evento creado exitosamente', response);
      },
      error => {
        console.error('Error al crear evento', error);
      }
    );
    this.setOpen(false);
    this.getEvents();
  }

  MONTH: string = '';
  CATEGORY: number = 0;
  QUERY: string = '';
  filtered: boolean = false;
  
  filterResults() {
    this.eventos = this.eventos.filter(evento => {
      // Filter by month
      const mesAbreviadoLowerCase = evento.mes.toLowerCase();
      const mesCompletoLowerCase = this.MONTH.toLowerCase();
      const matchesMonth = !this.MONTH || this.mesesAbreviados[mesAbreviadoLowerCase] === mesCompletoLowerCase;
      // Filter by category
      const matchesCategory = !this.CATEGORY || evento.categoriaId === this.CATEGORY;
      // Filter by query
      const matchesQuery = !this.QUERY || evento.nombre.toLowerCase().includes(this.QUERY.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(this.QUERY.toLowerCase());
      // Return true if all conditions are met
      return matchesMonth && matchesCategory && matchesQuery;
    });
    this.filtered = true;
  }

  constructor(private eventoService: NuevoeventoService, private apiService: ApiService) {}

  ngOnInit() {
    this.getEvents();
  }

  @ViewChild('select1') select1!: IonSelect;
  @ViewChild('select2') select2!: IonSelect;

  getEvents(){
    this.apiService.getData().subscribe(response => {
      this.eventos = response.map((evento: Evento) => ({
        ...evento,
        mes: this.getNombreMes(new Date(evento.fecha).getMonth()), // Obtener el nombre del mes
        dia: new Date(evento.fecha).getDate()+1 // Obtener el día
      }));
    });
    console.log(this.eventos);
    if(this.filtered){
      this.QUERY = '';
      this.filtered = false;
      this.resetIonSelector(this.select1);
      this.resetIonSelector(this.select2);
    }
  }

  resetIonSelector(selctor: IonSelect){
    selctor.value = null;
  }

  getNombreMes(numeroMes: number): string {
    const meses: string[] = [
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];
    return meses[numeroMes];
  }

  sesionIniciada: boolean = false;

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

  roles: any[] = [
    'Administrador general',
    'Administrador dependencia',
    'Invitado cliente',
    'Invitado',
    'Operador'
  ]

  afiliaciones: any[] = [
    'Maestro', 'Alumno', 'Externo'
  ]

  CreateEventPermit: any[] = [6, 7]

  mesesAbreviados: {[key: string]: string} = {
    'ene': 'enero',
    'feb': 'febrero',
    'mar': 'marzo',
    'abr': 'abril',
    'may': 'mayo',
    'jun': 'junio',
    'jul': 'julio',
    'ago': 'agosto',
    'sep': 'septiembre',
    'oct': 'octubre',
    'nov': 'noviembre',
    'dic': 'diciembre'
  };

}
