import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/Layout'
import blankLayout from '@/layout/blankLayout'
import returnLayout from '@/layout/returnLayout'

Vue.use(Router)

const course = () => import('@/course/index')
const news = () => import('@/news/index')
const newsDetail = () => import('@/news/article')
const my = () => import('@/my/index')
const bookCourse = () => import('@/bookCourse/index')
const cancelCourse = () => import('@/bookCourse/cancelCourse')
const createCourse = () => import('@/createCourse/index')
const feedback = () => import('@/my/feedback')
const chart = () => import('@/chart/index')
const viewCourseStu = () => import('@/viewCourseStu/index')
const register = () => import('@/register/index')
const selRegType = () => import('@/register/selType')
const userInfo = () => import('@/my/userInfo')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/course'
    },
    {
      path: '/course',
      component: Layout,
      name: 'course0',
      meta: { tab: 'index', title: 'index' },
      children: [
        {path: '/course', name: 'course', component: course, meta: { title: 'course' }}
      ]
    },
    {
      path: '/tech',
      component: Layout,
      name: 'tech0',
      meta: { tab: 'tech', title: 'tech' },
      children: [
        {path: '/tech', name: 'tech', component: news, meta: { title: 'tech' }}
      ]
    },
    {
      path: '/newsDetail',
      component: returnLayout,
      name: 'newsDetail0',
      meta: { tab: 'newsDetail0', title: 'newsDetail0' },
      children: [
        {path: '/news/:id', name: 'newsDetail', component: newsDetail, meta: { title: 'newsDetail' }}
      ]
    },
    {
      path: '/my',
      component: Layout,
      name: 'my0',
      meta: { tab: 'my', title: 'my' },
      children: [
        {path: '/my', name: 'my', component: my, meta: { title: 'my' }}
      ]
    },
    {
      path: '/feedback',
      component: returnLayout,
      name: 'feedback0',
      meta: { tab: 'feedback', title: 'feedback' },
      children: [
        {path: '/feedback', name: 'feedback', component: feedback, meta: { title: 'feedback' }}
      ]
    },
    {
      path: '/bookCourse',
      component: returnLayout,
      name: 'bookCourse0',
      meta: { tab: 'bookCourse', title: 'bookCourse' },
      children: [
        {path: '/bookCourse/:type', name: 'bookCourse', component: bookCourse, meta: { title: 'bookCourse' }},
        {path: '/cancelCourse', name: 'cancelCourse', component: cancelCourse, meta: { title: 'cancelCourse' }}
      ]
    },
    {
      path: '/createCourse',
      component: returnLayout,
      name: 'createCourse0',
      meta: { tab: 'bookCourse', title: 'createCourse' },
      children: [
        {path: '/createCourse', name: 'createCourse', component: createCourse, meta: { title: 'createCourse' }}
      ]
    },
    {
      path: '/chart',
      component: returnLayout,
      name: 'chart0',
      meta: { tab: 'chart', title: 'chart' },
      children: [
        {path: '/chart', name: 'chart', component: chart, meta: { title: 'chart' }}
      ]
    },
    {
      path: '/viewCourseStu',
      component: returnLayout,
      name: 'viewCourseStu0',
      meta: { tab: 'viewCourseStu', title: 'viewCourseStu' },
      children: [
        {path: '/viewCourseStu', name: 'viewCourseStu', component: viewCourseStu, meta: { title: 'viewCourseStu' }}
      ]
    },
    {
      path: '/register',
      component: returnLayout,
      name: 'register0',
      meta: { tab: 'register', title: 'register' },
      children: [
        {path: '/register', name: 'register', component: register, meta: { title: 'register' }},
        // {path: '/selRegType', name: 'selRegType', component: selRegType, meta: { title: 'selRegType' }},
        {path: '/userInfo', name: 'userInfo', component: userInfo, meta: { title: 'userInfo' }}
      ]
    },
    {
      path: '/selRegType',
      component: blankLayout,
      name: 'selRegType0',
      meta: { tab: 'selRegType', title: 'selRegType' },
      children: [
        {path: '/selRegType', name: 'selRegType', component: selRegType, meta: { title: 'selRegType' }}
      ]
    }
  ]
})
