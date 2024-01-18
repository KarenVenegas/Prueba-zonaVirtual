import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'prueba-zona-virtual';
  users: any[] = [];
  usersFiltered: any[] = []; 
  expandida: any = null;
  buscarTermino: string = '';
  order: boolean = false;
  orderNombre: boolean = false;
  orderTelefono : boolean = false;
  orderCorreo : boolean = false;
  orderEstado : boolean = false;
  activeButton: string | null = null;
  
  constructor(private svc: SharedService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el localStorage
    this.svc.localStorageChange$.subscribe((key) => {
      if (key === 'data') {
        // El valor de 'data' en el localStorage ha cambiado, realizar acciones necesarias
        console.log('cambio en la data ');
        
        this.getData();
      }
    });

    // Llamar a getData al inicio del componente
    this.getData();
  }

  getData(): void {

    const localStorageData = localStorage.getItem('data');

    if (localStorageData) {
      // Si hay datos en el localStorage, cargarlos
      this.users = JSON.parse(localStorageData);
      
    } else {
      // Si no hay datos en el localStorage, cargarlos desde el servicio
      // (Simulando los datos ya que el API no tiene una respuesta estable)
      this.users = this.svc.data.map((user: { Id: any; }, index: number) => {
        // Añadir id consecutivo
        user.Id = index + 1;
        // Retornar el objeto modificado
        return user;
      });
  
      // Guardar los datos en el localStorage
      localStorage.setItem('data', JSON.stringify(this.users));
    }
  
    this.usersFiltered = [...this.users];
  }

  //Abrir modal 
  openNew():void{
    this.svc.openModalNew();
  }

  //Editar modal
  openEdit(usuario:any):void{
    this.svc.openModalEdit(usuario);
  }

  //descripcion metodo de pago
  getPayDescription(codigo: number): string {
    switch (codigo) {
      case 32: return 'Tarjeta de crédito';
      case 29: return 'PSE';
      case 41: return 'Gana';
      case 42: return 'Caja';
      default: return 'No reportado'; 
    }
  }

  //descripcion estado 
  getStateDescription(codigo: number): string {
    switch (codigo) {
      case 1: return 'Aprobada';
      case 1000: return 'Rechazada';
      case 999: return 'Pendiente';
      default: return ''; 
    }
  }

  // Asignacion clase estado 
  getStateClass(codigo: number): string {
    switch (codigo) {
      case 1: return 'aprobado';
      case 1000: return 'rechazado';
      case 999: return 'pendiente';
      default: return ''; 
    }
  }

  //click detalles
  toggleDetails(usuario: any): void {
    if (this.expandida === usuario) {
      this.expandida = null;
    } else {
      this.expandida = usuario;
    }
  }

  //ver detalles
  seeDetails(usuario: any): boolean {
    return this.expandida === usuario;
  }

  //ordenar 
  sort(field: string) {
    this.activeButton = field;
    this.order = !this.order;
    if (field === 'usuario_nombre') {
      this.orderNombre = !this.orderNombre;
    } else if (field === 'usuario_identificacion') {
      this.orderTelefono = !this.orderTelefono;
    }else if (field === 'Trans_fecha') {
      this.orderCorreo = !this.orderCorreo;
    }
    
    this.usersFiltered.sort((a, b) => {
      // Obtiene el primer nombre y convierte a minúsculas
      const valueA = a[field].toLowerCase().split(' ')[0]; 
      const valueB = b[field].toLowerCase().split(' ')[0];
      if (valueA > valueB) {
        return this.order ? 1 : -1; 
      } else if (valueA < valueB) {
        return this.order ? -1 : 1; 
      } else {
        return 0;
      }
    });
  }

  sortDirection: 'asc' | 'desc' = 'asc';

  // Método para cambiar la dirección de ordenación y organizar la lista por estado
  sortListByState(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.orderEstado = !this.orderEstado;
    this.activeButton = 'estado';
    this.usersFiltered.sort((a, b) => {
      const stateA = a.Trans_estado;
      const stateB = b.Trans_estado;

      let result: number;

      if (stateA < stateB) {
        result = -1;
      } else if (stateA > stateB) {
        result = 1;
      } else {
        result = 0;
      }

      return this.sortDirection === 'asc' ? result : -result;
    });
  }
 
  //limpiar fitros 
  resetFilters() {
    this.activeButton = null;
    this.order = false;
    this.orderNombre = false;
    this.orderTelefono = false;
    this.orderCorreo = false;
    this.orderEstado = false;
    this.usersFiltered = JSON.parse(localStorage.getItem("data") || '');
  }

  //Filtrar
  applyFilter(event: Event | null): void {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.buscarTermino = filterValue.trim().toLowerCase();
    }
    if (!this.buscarTermino) {
      this.usersFiltered = [...this.users]; 
    } else {
      this.usersFiltered = this.users.filter((usuario: any) =>
        this.matchUserByParam(usuario, this.buscarTermino)
      );
    }
  }
  //Filtrar por cualquier parametro
  matchUserByParam(usuario: any, searchTerm: string): boolean {
    
    const camposFiltrables = ['usuario_nombre','usuario_identificacion', 'usuario_email'];
    for (const campo of camposFiltrables) {
      if (usuario[campo]?.toString().toLowerCase().includes(searchTerm)) {
        return true;
      }
    }
    return false;
  }
}
