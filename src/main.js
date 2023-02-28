import { createApp } from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import moment from 'moment/moment';

import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import VueSweetalert2 from 'vue-sweetalert2';

import router from './router';
import App from './App.vue';

import './assets/all.scss';
import 'sweetalert2/dist/sweetalert2.min.css';

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});

setLocale('zh_TW');

const app = createApp(App);

app.config.globalProperties.$moment = moment;
app.use(VueAxios, axios);
app.use(router);
app.use(LoadingPlugin);
app.use(VueSweetalert2);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');
