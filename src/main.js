import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'

import router from './router'
import constants from './utils/constants'


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.blog_constants = constants

import {checkToken} from './api/api'
import {success_code} from './api/api'

router.beforeEach((to, from, next) => {
  //如果是登录，则需要放行
  if (to.path === '/login') {
    checkToken().then(result => {
      if (result.code === success_code) {
        if (result.data.roles === 'role_admin') {
          next({
            path: '/index'
          });
        } else {
          location.href = this.blog_constants.portalBaseUrl;
        }
      } else {
        next();
      }

    });
  } else {
    //否则检查用户角色
    checkToken().then(result => {
      if (result.code === success_code)
      {
        window.localStorage.setItem('avatar', result.data.avatar);
        window.localStorage.setItem('userName', result.data.userName);

        if (result.data.roles === 'role_admin') {
          next();
        } else {
          //location.href = 'https://www.baidu.com/';
        }
      } else {
        next({
          path: '/login'
        })
      }

    });


    //管理员，放行

    //普通用户，跳转到门户
  }
})

Vue.component('leftMenu', leftMenu);
Vue.component('topHeader', topHeader);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
