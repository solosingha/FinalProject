import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '../views/HelloWorld.vue'
import User from '../views/User.vue'
import page1 from '../views/page1.vue'
import page2 from '../views/page2.vue'

import charge from '../views/page3.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld,
    children:[
      {
        path:'/user',
        name:'user',
        component:User
      },
      {
        path:'/page1',
        name:'page1',
        component:page1
      },
      {
        path:'/page2',
        name:'page2',
        component:page2
      },
      {
        path:'/charge',
        name:'charge',
        component:charge
      }
    ]
  },

]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
