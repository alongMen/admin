import Router from 'vue-router';

import Vue from 'vue';
import system from './map/system';
import game from './map/game';
import user from './map/user';
import finance from './map/finance';
import operation from './map/operation';
import sheet from './map/sheet';
Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      // redirect: { name: 'site-manage'},
      component: () => import('@/views/index.vue'),
      children: [system, game, user, finance, operation,sheet],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      meta:{noAuth:true},
      children: [],
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component:()=> import('../views/unauthorized/index.vue'),
      meta:{noAuth:true},
      children: [],
    }
  ],
});
