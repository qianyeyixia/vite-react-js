import { Outlet } from 'react-router-dom';
import { lazy, ComponentType, LazyExoticComponent } from 'react'

import NotFound from '@/components/NotFound'

import Children from '@/router/Children'

export type Component = ComponentType<any> | LazyExoticComponent<any>

export interface RouteConfig {
  path: string
  models?: () => Array<PromiseLike<any>>
  component: Component
  exact?: boolean // 完全匹配 has  routes 必须false
  name: string
  icon?: Component
  noCache?: boolean
  noTags?: boolean
  meta?: { title: string }
  alwaysShow?: boolean // 是否显示在导航栏 true 不显示 默认false
  children?: Array<this>
  notLogin?: boolean // 是否需要登录  默认需要登录 不需要登录设置为true
  redirect?: string // 重定向
}

const routesOther: RouteConfig[] = [
  {
    path: 'home',
    component: lazy(() => import('@/pages/home')),
    meta: { title: '首页' },
    name: 'Home',
  },
  {
    path: 'user',
    component: lazy(() => import('@/pages/user')),
    meta: { title: '用户' },
    name: 'User',
  },
  {
    path: 'list',
    component: Outlet,
    meta: { title: '列表' },
    name: 'List',
    children: [
      {
        path: 'detail',
        component: lazy(() => import('@/pages/list/details')),
        meta: { title: '嵌套路由-列表-详情' },
        name: 'Detail',
      },
    ],
  },
]

export const routes: RouteConfig[] = [
  {
    path: '/404',
    component: NotFound,
    meta: {
      title: '404',
    },
    name: '404',
    notLogin: true,
  },
  {
    path: '/*',
    component: lazy(() => import('@/layout')),
    meta: { title: 'erp' },
    name: 'erp',
    children: routesOther,
  },
]
