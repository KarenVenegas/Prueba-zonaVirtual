import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-new-register',
  templateUrl: './modal-new-register.component.html',
  styleUrls: ['./modal-new-register.component.scss']
})
export class ModalNewRegisterComponent {
  form: FormGroup;
  data: any[] = [];

  constructor(private svc: SharedService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      comercio_codigo: ['', Validators.required],
      comercio_nombre: ['', Validators.required],
      comercio_nit: ['', Validators.required],
      comercio_direccion: ['', Validators.required],
      Trans_codigo:['', Validators.required],
      Trans_medio_pago:['', Validators.required],
      Trans_estado:['', Validators.required],
      Trans_total:['', Validators.required],
      Trans_fecha:['', Validators.required],
      Trans_concepto:['', Validators.required],
      usuario_identificacion:['', Validators.required],
      usuario_nombre:['', Validators.required],
      usuario_email:['', [Validators.required, Validators.email]],
    });
  }

  closeModal(){
    this.svc.closeModal();
  }

  send(){
    this.form.value.Trans_codigo = this.form.value.Trans_codigo.toString();
    this.data =  JSON.parse(localStorage.getItem("data") || '');
    
      let found = false;
    
    this.data.forEach(item => {
      if (item.Trans_codigo.toString() === this.form.value.Trans_codigo) {
        // Cambia el valor de la variable encontrado si existe una coincidencia
        found = true;
      }
    });
    
    // Verifica el valor de la variable encontrado
    if (found) {
      this.toastr.error('Error','El código de transacción ya existe, por favor ingrese un código diferente.');  
    } else {
      
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

      this.data.push(this.form.value);
      this.data = this.data.map((user, index) => {
      //Añadir id consecutivo
      user.Id = index + 1;
      // Retornar el objeto modificado
      return user;
    });
      localStorage.setItem('data', JSON.stringify(this.data));
      this.svc.notifyLocalStorageChange('data');
      this.closeModal();  
      this.toastr.success('Guardado','Documento agregado con éxito');  
    }
  }
}
