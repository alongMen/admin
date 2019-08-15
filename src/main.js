import Vue from 'vue';
import App from './App.vue';
import iview from 'iview';
import store from './store/index';
import 'iview/dist/styles/iview.css';
import './assets/common.less';
import router from './router/index';

import collapse from './components/collapse/index';

import { formatBeijingDate } from '@/utils/date-utils';
import { parsePrice } from '@/utils/parsePrice';
import echarts from 'echarts' 
Vue.prototype.$echarts = echarts 




Vue.component(collapse.name, collapse);

Vue.use(iview);
Vue.config.productionTip = false;

Vue.prototype.formatBeijingDate = function(str) {
  return formatBeijingDate(str);
};
Vue.prototype.parsePrice = function(str) {
  return parsePrice(str || 0);
};

Vue.prototype.toPercent = function(num) {
  return parseFloat((num * 100).toFixed(2))
}

Vue.prototype.toDecimal = function(num) {
  return parseFloat((num / 100).toFixed(4))
}

String.prototype.replaceAll = function(s1,s2) { 
  return this.replace(new RegExp(s1,"gm"),s2); 
}

router.beforeEach((to, from, next) => {
	if (!to.matched.some(record => record.meta.noAuth)) {
		if (localStorage.getItem('token')) {
			next();
		} else {
			next('/login');
		}
	} else {
		next();
	}
});




new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {

  },
}).$mount('#app');



