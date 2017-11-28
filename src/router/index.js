/**
 * Created by lxk on 2017/10/19.
 */
import Vue from 'vue';
import Router from 'vue-router';
import goods from '../components/goods/goods.vue';
import ratings from '../components/ratings/ratings.vue';
import seller from '../components/seller/seller.vue';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',  // 路由激活时的class
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
});
