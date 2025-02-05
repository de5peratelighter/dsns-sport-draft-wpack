import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import i18n from './i18n'

import axios from 'axios';
axios.defaults.baseURL = 'https://pps-prod.ldubgd.edu.ua/api/v1/';
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import Vue2Editor from "vue2-editor";
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
