// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'

//把fastclick attach到body上,这样body上按钮的点击没有300ms延迟
fastclick.attach(document.body)

//使用懒加载，替代的图片是logo.png
Vue.use(VueLazyLoad,{
  loading:require('common/image/logo.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store,
  router
})
