import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AiClass from '../pages/AiClass.vue'
import DayData from '../pages/DayData.vue'
import ClassData from '../pages/ClassData.vue'
import TeacherData from '../pages/TeacherData.vue'
import StudentData from '../pages/StudentData.vue'
import NotFound from '../components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
    {
    path: '/aiClass',
    name: 'AiClass',
    component: AiClass
  },
  {
    path: '/dayData',
    name: 'DayData',
    component: DayData
  },
  {
    path: '/classData',
    name: 'ClassData',
    component: ClassData
  },
  {
    path: '/teacherData',
    name: 'TeacherData',
    component: TeacherData
  },
  {
    path: '/studentData',
    name: 'StudentData',
    component: StudentData
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
