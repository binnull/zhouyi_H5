import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import Lantern from 'lantern-ui';
import routes from './route.config.js';
import 'lantern-ui/lib/lantern.css';
import * as vClickOutside from 'v-click-outside-x'

import {Popup, Picker, DatetimePicker} from 'vant';
import 'vant/lib/index.css';

Vue.use(Popup);
Vue.use(Picker);
Vue.use(DatetimePicker);

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(Lantern);
Vue.use(vClickOutside);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routes
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
});
