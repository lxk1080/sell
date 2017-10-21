// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import routes from './config/routes'; // 路由配置
import 'common/stylus/index.styl';

// Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass: 'active',  // 路由激活时的class
  routes: routes
});

// eslint-disable-next-line no-new
new Vue({
  router: router,
  el: '#app',
  render: (h) => h(App)
});
