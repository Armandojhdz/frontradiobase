<template>
  <section id="bodyTable">
    <span class="badge" v-bind:class="{'badge-secondary': trafic==0, 'badge-danger': (trafic>0 && trafic<=15), 'badge-orange': (trafic>15 && trafic<=40), 'badge-warning': (trafic>40 && trafic<=90), 'badge-success': (trafic>90)}">
      {{ trafic  }}
    </span>
  </section>
</template>
<script>

import axios from 'axios';

export default {
  name: 'bodyTable',
  props: {
    radiobase: Object,
  },
  data: function () {
    return {
      route: window.location.href.substring(window.location.href.length-5, 0)+'3000/',
      //route: 'http://201.103.188.84:3000/', //SERVER ONLINE
      trafico: [],
    }
  },
  computed: {
    trafic: function () {

      
      let route = this.route + "radiobases/fecha/"+this.radiobase.fecha+"/radiobase/"+this.radiobase.base;

      axios.get(route).then((response, error)  => {

        if (response.data.length > 0)
          this.trafico = response.data[0].trafico;
        else
          this.trafico = 0;

      }).catch(e => {
          console.log(e);
      });

      return this.trafico;
    }
  },
}
</script>
<style>
.badge-orange{
  color: #fff;
  background-color: #dc8235;
}
</style>
