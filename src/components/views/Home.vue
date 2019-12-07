<template>
  <section id="home">
    <div class="card mb-3">
      <div class="card-body">
        
        <div class="d-flex bd-highlight">
          <div class="p-2 flex-fill bd-highlight">
            <label>Página: {{ paginator.current_page }} de {{ paginator.last_page }}</label><br>
            <nav aria-label="Page navigation example" v-if="paginator.last_page > 0">
              <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#" v-on:click.prevent="onPaginate('previous', (paginator.current_page))"><i class="fas fa-chevron-left"></i></a></li>
                <li v-for="page in paginationLinks" class="page-item" v-bind:class="{ active: page === paginator.current_page, disabled: page > paginator.last_page }"><a class="page-link" href="#" v-on:click.prevent="onPaginate('per_page', page)">{{ page }}</a></li>
                <li class="page-item" v-bind:class="{ disabled: isDisabled }"><a class="page-link" href="#" v-on:click.prevent="onPaginate('next', (paginator.current_page))"><i class="fas fa-chevron-right"></i></a></li>
              </ul>
            </nav>
          </div>
          <div class="p-2 flex-fill bd-highlight">
            <label>Filtrar por regiones</label><br>
            <select class="form-control" v-model="region">
              <option value="null">Seleccionar</option>
              <option v-if="regiones.length > 0" v-for="(row, index) in regiones" :value="row.region">{{ 'Región no.' + row.region }}</option>
            </select>
          </div>
          <div class="p-2 flex-fill bd-highlight">
            <label>Busqueda por radiobase</label><br>
             <input type="text" class="form-control" placeholder="Ingrese la radiobase a buscar" v-model="search_base">
          </div>
          <div class="p-2 flex-fill bd-highlight">
            <label>De</label><br>
            <input type="date" class="form-control" v-model="input_ini">
          </div>
          <div class="p-2 flex-fill bd-highlight">
            <label>Hasta</label><br>
            <input type="date" class="form-control" v-model="input_fin">
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header bg-white p-0">
        <span class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <td width="5%" class="text-center pt-5"><strong>RADIOBASE</strong></td>
              <td v-if="headerTable.length>0" v-for="head in headerTable" class="p-0 pt-5 pb-5"><div class="rota"><strong>{{ head }}</strong></div></td>
            </tr>
          </thead>
          <thead>
            <tr if="Radiobases.length>0" v-for="radio in Radiobases">
              <td width="5%" class="text-center"><strong>{{ radio.base }}</strong></td>
              <td v-if="headerTable.length>0" v-for="head in headerTable" class="text-center">
                <bodyTable v-bind:radiobase="{fecha: head, base: radio.base}"></bodyTable>
              </td>
            </tr>
          </thead>
        </table>
        </span>
      </div>
    </div>
  </section>
</template>

<script>

import axios from 'axios';

export default {
  name: 'home',
  data () {
    return {
      msg: 'home',
      route: window.location.href.substring(window.location.href.length-5, 0)+'3000/',
      //route: 'http://201.103.188.84:3000/', //SERVER ONLINE
      search_base: '',
      regiones: [],
      region: null,
      list: [],
      isDisabled: false,
      paginator: {
        per_page: 1,
        current_page: 1,
        last_page: 0,
        ini_page: 0,
        fin_page: 0,
      },
      Radiobases: [],
      input_ini: moment('2019-08-23').subtract((this.num_days-1), 'days').format('YYYY-MM-DD'),
      input_fin: moment('2019-08-27').format('YYYY-MM-DD'),
    }
  },
  mounted: function() {
     this.onInit();
     this.getRegiones();
     console.log(this.route);
  },
  computed: {
    micomputed: function(){
      return 'La fecha va de ' + this.input_ini + 'hasta ' + this.input_fin;
    },
    paginationLinks: function () { //SIRVE PARA HACER LA PAGINACION DE LOS BOTONES VISUALES
      if(this.paginator.last_page > 0)
      {
        this.list.length = 0;
        let last_page_list = this.paginator.last_page,
        list_in = 5,
        current_page_list = this.paginator.current_page;

        if (current_page_list == last_page_list)
          this.isDisabled = true;
        else
          this.isDisabled = false;

        if(current_page_list >= 1)
          for (var page = current_page_list; page < (current_page_list+list_in); page++)
            this.list.push(page);
      }
      return this.list;
    },
    headerTable() {
      let start = this.input_ini;
      let end = this.input_fin;
      //let range = start + '/' + end;
      let fechas = [];

      // INICIALIZAMOS CON LA ULTIMA FECHA
      fechas.push(start);

      // LE AGREGAMOS LOS DIAS
      let added = this.input_ini;
      let i = 1;
      while(moment(added).format('YYYY-MM-DD') <= moment(end).format('YYYY-MM-DD')){
        added = moment(start).add(i++, 'days').format('YYYY-MM-DD');
        fechas.push(added);
      }

      // LE AGREGAMOS EL DIA ACTUAL
      fechas.push(end);
      //console.log(fechas);

      return fechas;
    }
  },
  watch: {
    input_ini: {
      handler: function (val,oldVal) {
        if (val > this.input_fin)//VALIDAMOS RANGO CORRECTO
          this.input_ini = oldVal;
      }
    },
    input_fin: {
      handler: function (val,oldVal) {
        if (val < this.input_ini)//VALIDAMOS RANGO CORRECTO
          this.input_fin = oldVal;
      }
    },
    region: {
      handler: function (val,oldVal) {
        this.Radiobases.length = 0;
        axios.get(this.route + 'region/'+val)
        .then((response, error) => {
          this.Radiobases = response.data;
        })
        .catch( (error) => {
          console.log(error);
        });
      }
    },
    search_base: {
      handler: function (val,oldVal) {
        if (val === "")
          this.onInit();

        //SI SE BUSCA POR TEXTO SE EJECUTA
        else{
            let route = this.route + "radiobases/search-base/"+ val;

            axios.get(route).then((response, error)  => {

              //console.log(response.data)
              this.Radiobases = response.data;
              //this.searchUsers = this.Usuarios;

            }).catch(e => {
                console.log(e);
            });
        }
      }
    },
  },
  methods: {
    onInit: function(){
      //SE EJECUTA LA PAGINACION AL ENTRAR AL MODULO
      this.Radiobases.length = 0;

      //RUTA PARA OBTENER EL TOTAL DE PAGINAS
      let route = this.route + "total-radiobases";

      axios.get(route).then((response, error)  => {

        //console.log(response.data[0].total_rows)
        let total_registros = response.data[0].total_rows;
        let total_paginas = parseInt(total_registros/this.paginator.per_page);
        this.paginator.last_page = total_paginas;
        //TRAEMOS LOS PRIMEROS REGISTROS DE LA DB
        this.onPaginate('per_page', 1);
        //console.log(this.paginator);


        //this.Usuarios = response.data;
        //this.searchUsers = this.Usuarios.datas;

      }).catch(e => {
          console.log(e);
      });
    },
    //ACCION DE LOS BOTONES DE PAGINACION
    onPaginate: function(exec_action, exec_page) {
      this.Radiobases.length = 0;

      if (exec_action === 'previous')
      {
        let take_pages = this.paginator.per_page;
        let ini = 0;
        let fin = 0;

        if(exec_page > 1)
        {
          --exec_page;
          fin = exec_page * this.paginator.per_page;
          ini = fin - this.paginator.per_page;
        }
        else
        {
          ini = 0;
          fin = take_pages;
        }
        this.paginator.ini_page = ini;
        this.paginator.fin_page = fin;
        this.paginator.current_page = exec_page;
        //console.log([ini,fin]+', current:'+this.paginator.current_page);

      }
      if (exec_action === 'next')
      {
        let take_pages = this.paginator.per_page;
        let ini = 0;
        let fin = 0;

        if(exec_page >= 1 && exec_page <= this.paginator.last_page)
        {
          ++exec_page;
          fin = exec_page * this.paginator.per_page;
          ini = fin - this.paginator.per_page;
        }
        else
        {
          let ini = take_pages;
          let fin = ini + this.paginator.per_page;
          ++exec_page;
        }
        this.paginator.ini_page = ini;
        this.paginator.fin_page = fin;
        this.paginator.current_page = exec_page;
        //console.log([ini,fin]+', current:'+this.paginator.current_page);
      }
      if (exec_action === 'per_page')
      {
        let take_pages = this.paginator.per_page;
        let ini = 0;
        let fin = 0;

        if(exec_page > 1 && exec_page <= this.paginator.last_page)
        {
          ini = (exec_page -1) * this.paginator.per_page;
        }
        this.paginator.ini_page = ini;
        this.paginator.current_page = exec_page;
        //console.log([ini,fin]+', current:'+this.paginator.current_page);
      }

      //RUTA PARA OBTENER EL TOTAL DE PAGINAS
      let route = this.route + "radiobases/"+this.paginator.ini_page+"/paginate/"+this.paginator.per_page;

      axios.get(route).then((response, error)  => {

        //console.log(response.data)
        this.Radiobases = response.data;
        //this.searchUsers = this.Usuarios.datas;

      }).catch(e => {
          console.log(e);
      });
    },
    getRegiones: function(){
      axios.get(this.route + "regiones")
      .then((response, error) => {
        this.regiones = response.data;
      })
      .catch( (error) => {
        console.log(error);
      });
    },
  }
}
</script>

<style>
.rota{
  margin-right: 0;
  margin-left: 0;
  width: 90px;
  -ms-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
</style>
