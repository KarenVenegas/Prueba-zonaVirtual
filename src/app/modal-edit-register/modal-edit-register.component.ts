import { Component, Inject, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-edit-register',
  templateUrl: './modal-edit-register.component.html',
  styleUrls: ['./modal-edit-register.component.scss']
})
export class ModalEditRegisterComponent implements OnInit {
  form: any;
  users: any[] = [];

  constructor(private svc: SharedService, 
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  private toastr: ToastrService) {

    // Crea el formulario y establece las validaciones si es necesario
    this.form = this.formBuilder.group({
      Id:[data.usuario.Id],
      Trans_codigo: [data.usuario.Trans_codigo, Validators.required],
      Trans_medio_pago: [data.usuario.Trans_medio_pago, [Validators.required, this.validateMedioPago]],
      Trans_estado: [data.usuario.Trans_estado, Validators.required],
      Trans_total: [data.usuario.Trans_total, Validators.required],
      Trans_fecha: [null, Validators.required],
      Trans_concepto: [data.usuario.Trans_concepto, Validators.required],
      comercio_codigo: [data.usuario.comercio_codigo, Validators.required],
      comercio_nombre: [data.usuario.comercio_nombre, Validators.required],
      comercio_nit: [data.usuario.comercio_nit, Validators.required],
      comercio_direccion: [data.usuario.comercio_direccion, Validators.required],
      usuario_identificacion: [data.usuario.usuario_identificacion, Validators.required],
      usuario_nombre: [data.usuario.usuario_nombre, Validators.required],
      usuario_email: [data.usuario.usuario_email, Validators.email],
    });
    
  }
  
  ngOnInit(): void {
    this.form.patchValue({
      Trans_fecha: this.changeStringtodate(this.data.usuario.Trans_fecha)
      
    });
  }
  //Convertir string a fecha date-timelocal 
  changeStringtodate(fechaString: string): string {
    if (!fechaString) {
      return "";  // o cualquier valor predeterminado que desees
    }

    // Dividir la cadena en partes para construir el objeto Date
    const partesFechaHora = fechaString.split(/[\s/:]+/);

    // Crear el objeto Date con las partes obtenidas
    const fecha = new Date(
      parseInt(partesFechaHora[2], 10),
      parseInt(partesFechaHora[1], 10) - 1,
      parseInt(partesFechaHora[0], 10),
      parseInt(partesFechaHora[3], 10) + (partesFechaHora[6] === 'p.m.' ? 12 : 0),
      parseInt(partesFechaHora[4], 10),
      parseInt(partesFechaHora[5], 10)
    );

    // Formatea la fecha en el formato datetime-local
    const año = fecha.getFullYear();
    const mes = (`0${fecha.getMonth() + 1}`).slice(-2);
    const dia = (`0${fecha.getDate()}`).slice(-2);
    const horas = (`0${fecha.getHours()}`).slice(-2);
    const minutos = (`0${fecha.getMinutes()}`).slice(-2);

    return `${año}-${mes}-${dia}T${horas}:${minutos}`;
  }
  

  validateMedioPago(control: { value: any; }) {
    const selectedValue = control.value;
    return selectedValue !== 0 ? null : { invalidMedioPago: true };
  }

  closeModal(){
    this.svc.closeModal();
  }
  
  send(){
    this.form.value.Trans_codigo = this.form.value.Trans_codigo.toString();
    this.users =  JSON.parse(localStorage.getItem("data") || '');

    if(this.form.value.Trans_codigo.toString() !== this.data.usuario.Trans_codigo){

      const usersTemp = this.users.filter(usuario => usuario.Id !== this.data.usuario.Id);
      
       let found = false;
    
    usersTemp.forEach(item => {
      if (item.Trans_codigo === this.form.value.Trans_codigo) {
                // Cambia el valor de la variable encontrado si existe una coincidencia
        found = true;
      }
    });

    if(found){
      this.toastr.error('Error','El código de transacción ya existe, por favor ingrese un código diferente.');  
    } else{
        this.update();
    }
    }else{
      this.update();
    }



   

  }
  update(){
    if(this.form.value.Trans_fecha !== this.data.usuario.Trans_fecha ){
      // Crear un objeto Date
      const fecha = new Date(this.form.value.Trans_fecha);

      // Obtener los componentes de la   fecha y hora
      const dia = fecha.getDate();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Añadir cero inicial si es necesario
      const anio = fecha.getFullYear();
      let horas = fecha.getHours();
      const minutos = String(fecha.getMinutes()).padStart(2, '0'); // Añadir cero inicial si es necesario
      const segundos = String(fecha.getSeconds()).padStart(2, '0'); // Añadir cero inicial si es necesario
      const periodo = horas >= 12 ? 'p.m.' : 'a.m.';

      // Formatear la cadena de fecha en el nuevo formato
      this.form.value.Trans_fecha = `${dia}/${mes}/${anio} ${horas % 12 || 12}:${minutos}:${segundos} ${periodo}`.toString();
    }

    const updatedData = this.form.value;
    const userIdToUpdate = updatedData.Id;
  
    // Encuentra el índice del objeto en el arreglo que tiene el mismo ID
    const indexToUpdate = this.users.findIndex(user => user.Id === userIdToUpdate);
  
    // Si se encuentra el índice, actualiza los datos
    if (indexToUpdate !== -1) {
      this.users[indexToUpdate] = { ...this.users[indexToUpdate], ...updatedData };
      localStorage.setItem('data', JSON.stringify(this.users));
      this.svc.notifyLocalStorageChange('data');
      this.closeModal();
      this.toastr.success('Guardado','Documento actualizado con éxito');  
    } else {
      console.error('No se encontró el ID en el arreglo.');
    }
  }

}
