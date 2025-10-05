import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import DayData from '../pages/DayData.vue'
import ClassData from '../pages/ClassData.vue'
import TeacherData from '../pages/TeacherData.vue'
import StudentData from '../pages/StudentData.vue'
import AiSystem from '../pages/AiSystem.vue'
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
    path: '/aiSystem',
    name: 'AiSystem',
    component: AiSystem,
    children: [
      {
        path: '',
        name: 'SystemHome',
        component: () => import('../components/AiSystem/SystemHome.vue')
      },
      {
        path: 'teaching-tour',
        name: 'AiTeachingTour',
        component: () => import('../components/AiSystem/AiTeachingTour.vue')
      },
      {
        path: 'history-analysis',
        name: 'AiHisAnalysis',
        component: () => import('../components/AiSystem/AiHisAnalysis.vue')
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('../components/AiSystem/Attendance.vue')
      },
      {
        path: 'behavior-analysis',
        name: 'BehaviorAnalysis',
        component: () => import('../components/AiSystem/BehaviorAnalysis.vue')
      },
      {
        path: 'teach-quality',
        name: 'TeachQuality',
        component: () => import('../components/AiSystem/TeachQuality.vue')
      },
      {
        path: 'portrait-diagnosis',
        name: 'PortraitDiagnosis',
        component: () => import('../components/AiSystem/PortraitDiagnosis.vue')
      },
      {
        path: 'classroom-warning',
        name: 'ClassroomWarning',
        component: () => import('../components/AiSystem/ClassroomWarning.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
