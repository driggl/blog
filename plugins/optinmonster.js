import Vue from 'vue'
import Router from 'vue-router'

const router = new Router ({ })

router.beforeEach((to, from, next) => {
  if (window.om82043_) {
    window.om5678_72987.reset()
  }
})

Vue.use(Router)