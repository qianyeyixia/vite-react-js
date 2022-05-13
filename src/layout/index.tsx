import React, { FunctionComponent, memo, Suspense, useCallback, useEffect, useMemo, useReducer } from 'react'

import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom'

import { equals, isNil, last, map } from 'ramda'
import { BackTop, Layout as ALayout, Menu } from 'antd'

import type { RouteMatch, RouteObject } from 'react-router'
import type { MenuProps } from "antd"

import TagsView, { Action, ActionType, reducer } from './tagsView/index'

import { Loading } from '@/components/Loading'
import $styles from './tagsView/index.module.less'

import KeepAlive from '@/components/KeepAlive'
import { ViewProvider } from '@/hooks/useView'
import { RouteConfig } from '@/router/configure'
import { useAppDispatch, useAppSelector } from "@/store/redux-hooks"

const { Sider, Header, Content, Footer } = ALayout

export interface RouteObjectDto extends RouteObject {
  name: string
  meta?: { title: string }
}

type MenuItem = Required<MenuProps>['items'][number];



function makeRouteObject(routes: RouteConfig[], dispatch: React.Dispatch<Action>): RouteObjectDto[] {
  return map((route) => {
    return {
      path: route.path,
      name: route.name,
      meta: route.meta,
      element: (
        <ViewProvider value={{ name: route.name }}>
          <route.component name={route.name} dispatch={dispatch} />
        </ViewProvider>
      ),
      children: isNil(route.children) ? [] : makeRouteObject(route.children, dispatch),
    }
  }, routes)
}
function mergePtah(path: string, paterPath = '') {
  path = path.startsWith('/') ? path : '/' + path
  return paterPath + path
}
// 渲染导航栏
function renderMenu(data: Array<RouteConfig>, path?: string): MenuItem[] {
  return map((route) => {
    const Icon = route.icon
    const thisPath = mergePtah(route.path, path)
    console.log(route, 53)
    return route.alwaysShow ? null : isNil(route.children) ? {
      key: thisPath,
      icon: Icon ? <Icon /> : null,
      label: <Link to={thisPath}>
        {route.meta.title}
      </Link>,
    } as MenuItem : {
      key: thisPath,
      icon: Icon ? <Icon /> : null,
      label: route.meta.title,
      children: isNil(route.children) ? [] : renderMenu(route.children, thisPath),
    } as MenuItem
  }, data) as MenuItem[]
}

interface Props {
  route: RouteConfig
}

function getLatchRouteByEle(
  ele: React.ReactElement<any, string | React.JSXElementConstructor<any>>
): RouteMatch<string>[] | null {
  const data = ele?.props.value
  return isNil(data.outlet) ? (data.matches as RouteMatch<string>[]) : getLatchRouteByEle(data.outlet)
}

const Layout: FunctionComponent<Props> = ({ route }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [keepAliveList, dispatch] = useReducer(reducer, [])
  const appStore = useAppSelector(state => state.app)
  console.log(appStore, 'appStore')
  // 生成子路由
  const routeObject = useMemo(() => {
    if (route.children) {
      console.log('route.children', route.children);
      return makeRouteObject(route.children, dispatch)
    }
    return []
  }, [route.children])
  console.log('routeObject', routeObject);

  // 匹配 当前路径要渲染的路由
  const ele = useRoutes(routeObject)
  console.log('ele', ele);

  // 计算 匹配的路由name
  const matchRouteObj = useMemo(() => {
    if (isNil(ele)) {
      return null
    }
    const matchRoute = getLatchRouteByEle(ele)
    if (isNil(matchRoute)) {
      return null
    }
    console.log('matchRoute', matchRoute);
    const selectedKeys: string[] = map((res) => {
      console.log('res', res, 108, res.route.name);
      return res.pathname
    }, matchRoute)
    const data = last(matchRoute)?.route as RouteObjectDto
    return {
      key: last(matchRoute)?.pathname ?? '',
      title: data?.meta?.title ?? '',
      name: data?.name ?? '',
      selectedKeys,
    }
  }, [ele])
  // 缓存渲染 & 判断是否404
  useEffect(() => {
    if (matchRouteObj) {
      dispatch({
        type: ActionType.add,
        payload: {
          ...matchRouteObj,
        },
      })
    } else if (!equals(location.pathname, '/')) {
      navigate({
        pathname: '/404',
      })
    }
  }, [matchRouteObj, location, navigate])
  // 生成删除tag函数
  const delKeepAlive = useCallback(
    (key: string) => {
      console.log('delKeepAlive', key, 138);
      dispatch({
        type: ActionType.del,
        payload: {
          key,
          navigate,
        },
      })
    },
    [navigate]
  )
  const include = useMemo(() => {
    return map((res) => res.key, keepAliveList)
  }, [keepAliveList])
  console.log('include', include)

  return (
    <ALayout style={{ minHeight: '100vh' }}>
      <Sider className={$styles.fixed} {...appStore}>
        <div style={{height: 64}}></div>
        <Menu
          theme={appStore.theme}
          selectedKeys={matchRouteObj?.selectedKeys}
          defaultOpenKeys={matchRouteObj?.selectedKeys}
          mode="inline"
          items={renderMenu(route.children ?? [])}
        >
        </Menu>
      </Sider>
      <ALayout style={{ marginLeft: "200px"}}>
        <Header>header</Header>
        <Content className={$styles.content}>
          <TagsView delKeepAlive={delKeepAlive} keepAliveList={keepAliveList} />
          <Suspense fallback={<Loading />}>
            <KeepAlive activeName={matchRouteObj?.key} include={include} maxLen={10} isAsyncInclude>
              {ele}
            </KeepAlive>
          </Suspense>
        </Content>
        <Footer>footer</Footer>
        <BackTop />
      </ALayout>
    </ALayout>
  )
}
export default memo(Layout)
