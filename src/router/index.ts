import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../pages/BlogList.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../pages/BlogPost.vue'),
  },
  {
    path: '/shuoshuo',
    name: 'shuoshuo',
    component: () => import('../pages/Shuoshuo.vue'),
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('../pages/Friends.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/About.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
  },
]