import { Component, OnInit } from '@angular/core';

import { IDepartamentos } from '../../interfaces/idepartamentos';
import { IMunicipios } from '../../interfaces/imunicipios';
import { IClientes } from '../../interfaces/iclientes';
import { ICotizaciones } from '../../interfaces/icotizaciones';
import { IModelos } from '../../interfaces/imodelos';

import { ModalService } from '../../services/modal-service.service';
import { RestServiceService } from '../../services/rest-service.service';

import * as jquery from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent implements OnInit {

  Departamentos: Array<IDepartamentos>;
  Municipios: Array<IMunicipios>;
  Modelos: Array<IModelos>;
  Cliente: IClientes;
  Cotizacion: ICotizaciones;
  Otros: {
    politica: boolean,
    dep_codigo: number
  };

  error = {
    cli_nombrecompleto: { error: false, mensaje: '' },
    cli_celular: { error: false, mensaje: '' },
    cli_correo: { error: false, mensaje: '' },
    api_modelo: { error: false, mensaje: '' },
    dep_codigo: { error: false, mensaje: '' },
    mun_codigo: { error: false, mensaje: '' },
    politica: { error: false, mensaje: '' }
  };

  constructor(private rest: RestServiceService, private modal: ModalService, private router: Router) {
    this.Departamentos = [];
    this.Municipios = [];
    this.Modelos = [];
    this.Cliente = {
      cli_codigo: 0,
      cli_nombrecompleto: "",
      cli_celular: "",
      cli_correo: ""
    };
    this.Cotizacion = {
      cot_codigo: 0,
      cot_estado: 0,
      cot_fecha: "",
      cli_codigo: 0,
      mun_codigo: 0,
      api_modelo: ""
    };
    this.Otros = {
      politica: false,
      dep_codigo: 0
    };
  }

  ngOnInit() {
    this.listDepartamentos();
    this.listModelos();
  }

  listModelos() {
    this.modal.showLoading('Cargando Información');
    this.rest.get('api/apimodelos/list').then((res) => {
      this.Modelos = res;
      this.modal.hideLoading();
    }).catch(err => {
      this.modal.hideLoading();
    });
  }
  listDepartamentos() {
    this.modal.showLoading('Cargando Información');
    this.rest.get('api/departamentos/list').then((res) => {
      this.Departamentos = res;
      this.modal.hideLoading();
    }).catch(err => {
      this.modal.hideLoading();
    });
  }
  listMunicipios(dep_codigo: number) {
    this.modal.showLoading('Cargando Municipios');
    this.rest.get('api/municipios/listby?codigo=' + dep_codigo).then((res) => {
      this.Municipios = res;
      this.modal.hideLoading();
    }).catch(err => {
      this.modal.hideLoading();
    });
  }

  onChangeDepartamentos(cbxDepartamento: any) {
    this.listMunicipios(cbxDepartamento.target.value);
  }

  politica() {
    $("#myModal").modal("show");
  }

  validar(): number {

    this.error = {
      cli_nombrecompleto: { error: false, mensaje: '' },
      cli_celular: { error: false, mensaje: '' },
      cli_correo: { error: false, mensaje: '' },
      api_modelo: { error: false, mensaje: '' },
      dep_codigo: { error: false, mensaje: '' },
      mun_codigo: { error: false, mensaje: '' },
      politica: { error: false, mensaje: '' }
    };

    let error = 0;

    if (this.Cliente.cli_nombrecompleto.trim() == '') {
      this.error.cli_nombrecompleto.error = true;
      this.error.cli_nombrecompleto.mensaje = "Debe ingresar el campo 'Nombre Completo'";
      error++;
    }
    if (this.Cliente.cli_nombrecompleto.length > 180) {
      this.error.cli_nombrecompleto.error = true;
      this.error.cli_nombrecompleto.mensaje = "El valor del campo 'Nombre Completo' no debe superar los 180 carácteres";
      error++;
    }

    if (this.Cliente.cli_correo.trim() == '') {
      this.error.cli_correo.error = true;
      this.error.cli_correo.mensaje = "Debe ingresar el campo 'Correo'";
      error++;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.Cliente.cli_correo.trim())) {
      this.error.cli_correo.error = true;
      this.error.cli_correo.mensaje = "El campo 'Correo' debe ser un correo electronico válido ejemplo 'info@dominio.com' ";
      error++;
    }
    if (this.Cliente.cli_correo.length > 45) {
      this.error.cli_correo.error = true;
      this.error.cli_correo.mensaje = "El valor del campo 'Correo' no debe superar los 45 carácteres";
      error++;
    }

    if (this.Cliente.cli_celular.trim() == '') {
      this.error.cli_celular.error = true;
      this.error.cli_celular.mensaje = "Debe ingresar el campo 'Celular'";
      error++;
    }
    if (this.Cliente.cli_celular.length > 10) {
      this.error.cli_celular.error = true;
      this.error.cli_celular.mensaje = "El valor del campo 'Celular' no debe superar los 10 carácteres";
      error++;
    }

    if (this.Otros.dep_codigo == 0) {
      this.error.dep_codigo.error = true;
      this.error.dep_codigo.mensaje = "Debe ingresar el campo 'Departamento'";
      error++;
    }

    if (this.Cotizacion.mun_codigo == 0) {
      this.error.mun_codigo.error = true;
      this.error.mun_codigo.mensaje = "Debe ingresar el campo 'Municipio'";
      error++;
    }

    if (this.Cotizacion.api_modelo.trim() == '') {
      this.error.api_modelo.error = true;
      this.error.api_modelo.mensaje = "Debe ingresar el campo 'Modelo'";
      error++;
    }

    if (this.Otros.politica == false) {
      this.error.politica.error = true;
      this.error.politica.mensaje = "Debe aceptar términos y condiciones.";
      error++;
    }

    return error;
  }

  enviar() {
    if (this.validar() == 0) {
      this.modal.showLoading('Validando usuario');
      this.rest.post('api/clientes', this.Cliente).then(res1 => {
        this.Cotizacion.cli_codigo = res1;
        this.modal.changeLoadingText('Almacenando cotizacion');
        this.rest.post('api/cotizaciones', this.Cotizacion).then(res2 => {
          this.Cotizacion.cot_codigo = res2;
          this.modal.changeLoadingText('Enviando correo electronico');
          this.rest.post('api/cotizaciones/sendmail', { codigo: this.Cotizacion.cot_codigo }).then(res3 => {
            this.modal.showAlert("Cotizacion enviada satisfactoriamente", 2);
            this.clear();
            this.modal.hideLoading();
          }).catch(err => {
            this.modal.hideLoading();
          });
        }).catch(err => {
          this.modal.hideLoading();
        });
      }).catch(err => {
        this.modal.hideLoading();
      });
    } else {
      this.modal.showAlert("Se han presentado errores al validar los campos, por favor reviselos e intentelo de nuevo", 3);
    }
  }

  clear(){
    this.Cliente = {
      cli_codigo: 0,
      cli_nombrecompleto: "",
      cli_celular: "",
      cli_correo: ""
    };
    this.Cotizacion = {
      cot_codigo: 0,
      cot_estado: 0,
      cot_fecha: "",
      cli_codigo: 0,
      mun_codigo: 0,
      api_modelo: ""
    };
    this.Otros = {
      politica: false,
      dep_codigo: 0
    };
  }








}
