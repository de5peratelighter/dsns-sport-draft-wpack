import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import i18n from './i18n'

import axios from 'axios';
axios.defaults.baseURL = 'http://ec2-3-70-248-126.eu-central-1.compute.amazonaws.com/api/v1/';
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import Vue2Editor from "vue2-editor";
Vue.use(Vue2Editor);

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
