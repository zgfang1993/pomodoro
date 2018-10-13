import Vue from 'vue';
import axios from 'axios';
import Antd from 'ant-design-vue';
import Dropdown from 'ant-design-vue/lib/dropdown';
import VeHistogram from 'v-charts/lib/histogram.common';
import 'v-charts/lib/style.css';
import 'ant-design-vue/dist/antd.css';

import App from './App';
// import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.component(VeHistogram.name, VeHistogram);
Vue.use(Antd);
Vue.component(Dropdown.name, Dropdown);

new Vue({
  components: { App },
  // router,
  store,
  render: h => h(App),
}).$mount('#app');
