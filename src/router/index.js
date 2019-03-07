import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path:'*',
      redirec:'signin'
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta:{requiresAuth:true}
    },
    {
      path:'/signup',
      name : 'Signup',
      component: Signup
    },
    {
      path:'/signin',
      name:'Signin',
      component:Signin
    }

  ]
})

router.beforeEach((to,from,next) =>{
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if(requiresAuth){
    firebase.auth().onAuthStateChanged(function (user) {
      if(user){
        next() //nextはそのtoの画面に移動
      }else{
        next({
          path:'/signin',
          query:{redirect:to.fullpath}
        })
      }

    })
  }else{
    next()
  }
})

export default router
