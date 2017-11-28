// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router/index'; // 路由配置
import 'common/stylus/index.styl';

Vue.use(VueResource);

// eslint-disable-next-line no-new
new Vue({
  router: router,
  el: '#app',
  render: (h) => h(App)
});
