import Vue from 'vue';
import Vuex from 'vuex';

import nav from './map/nav';
import base from './map/base';
import permission from './map/permission';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    nav,
    base,
    permission
  },
  mutations: {
    setState(state, { module, key, value }) {
      setRespondValByKey(state[module], key, value);
    },
  },
});
