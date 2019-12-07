import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import jQuery from 'jquery'

window.$ = window.jQuery = jQuery;
window.moment = require('moment');
moment.locale('es');

import 'popper.js';
import 'bootstrap';
import './assets/sass/app.scss'
//import DateRangePicker from '@owumaro/vue-date-range-picker'
//LOCACION DE COMPONENTES GLOBALES
import Home from './components/views/Home.vue'
import BodyTable from './components/views/BodyTable.vue'

//COMPONENTES GLOBALES
Vue.component('home', Home);
Vue.component('bodyTable', BodyTable);
//Vue.use(DateRangePicker)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
