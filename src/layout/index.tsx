import React, { FunctionComponent, memo, Suspense, useCallback, useRef ,useEffect, useMemo, useReducer, ReactElement, JSXElementConstructor } from 'react'

import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom'

import { equals, filter, isEmpty, isNil, last, map, not, reduce } from 'ramda'
import { BackTop, Layout as ALayout, Menu } from 'antd'

import type { RouteMatch, RouteObject } from 'react-router'
import { ItemType } from 'antd/lib/menu/hooks/useItems'


import TagsView, { Action, ActionType, reducer } from './tagsView/index'

import { Loading } from '@/components/Loading'
import $styles from './tagsView/index.module.less'

import KeepAlive from '@/components/KeepAlive'
import { ViewProvider } from '@/hooks/useView'
import { RouteConfig } from '@/router/configure'
import { useAppSelector } from "@/store/redux-hooks"

const { Sider, Header, Content, Footer } = ALayout

export interface RouteObjectDto extends RouteObject {
  name: string
  meta?: { title: string }
}


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
function getMatchRouteObj(ele: ReactElement<any, string | JSXElementConstructor<any>> | null) {
  if(isNil(ele)) {
    return null
  }
  const matchRoute = getLatchRouteByEle(ele) 
  if(isNil(matchRoute )) {
    return null
  }
  const selectedKeys: string[] = map((res) => {
		return (res.route as RouteObjectDto).name
	}, matchRoute)
	const data = last(matchRoute)?.route as RouteObjectDto
	return {
		key: last(matchRoute)?.pathname ?? '',
		title: data?.meta?.title ?? '',
		name: data?.name ?? '',
		selectedKeys,
	}
}
function mergePtah(path: string, paterPath = '') {
  path = path.startsWith('/') ? path : '/' + path
  return paterPath + path
}
// 渲染导航栏
function renderMenu(data: Array<RouteConfig>, path?: string) {
  return reduce((items, route) => {
    const thisPath = mergePtah(route.path, path)
    const children = filter((route) => not(route.alwaysShow), route.children ?? [])
    if (route.alwaysShow) {
      return
    }
    items.push({
      key: route.name,
      title: route.meta?.title,
      label: (
        <Link to={thisPath} className="a-black">
          {route.meta?.title}
        </Link>
      ),
      children: isNil(children) || isEmpty(children) ? undefined : renderMenu(children, thisPath),
    })
    return items
  }, [] as ItemType[], data)
}

interface Props {
  route: RouteConfig,
  setKeepAliveList: any,
}

function getLatchRouteByEle(
  ele: React.ReactElement<any, string | React.JSXElementConstructor<any>>
): RouteMatch<string>[] | null {
  const data = ele?.props.value
  return isNil(data.outlet) ? (data.matches as RouteMatch<string>[]) : getLatchRouteByEle(data.outlet)
}

const Layout: FunctionComponent<Props> = ({ route , setKeepAliveList}: Props) => {
  const eleRef = useRef<React.ReactElement<any, string | React.JSXElementConstructor<any>> | null>()
  const location = useLocation()
  const navigate = useNavigate()
  const appStore = useAppSelector(state => state.app)

  const [keepAliveList, dispatch] = useReducer(reducer, [])
  // 生成子路由
  const routeObject = useMemo(() => {
    if (route.children) {
      return makeRouteObject(route.children, dispatch)
    }
    return []
  }, [route.children])

  // 匹配 当前路径要渲染的路由
  eleRef.current = useRoutes(routeObject, location)

  // 计算 匹配的路由name
  const matchRouteObj = useMemo(() => {
    if (eleRef.current) {
			return getMatchRouteObj(eleRef.current)
		}
    return null
  }, [routeObject, location])
  // 缓存渲染 & 判断是否404
  useEffect(() => {
    console.log(keepAliveList, 'keepAliveList', matchRouteObj, "matchRouteObj")
    if (matchRouteObj) {
      dispatch({
        type: ActionType.add,
        payload: {
          ...matchRouteObj,
        }
      })
    } else if (!equals(location.pathname, '/')) {
      navigate({
        pathname: '/404',
      })
    }
  }, [location.pathname, matchRouteObj, navigate])
  // 生成删除tag函数
  const delKeepAlive = useCallback(
    (key: string) => {
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
  const items = useMemo(() => {
		return renderMenu(route.children ?? [])
	}, [route.children])
  return (
    <ALayout style={{ minHeight: '100vh' }}>
      <Sider className={$styles.fixed} {...appStore}>
        <div style={{height: 64}}></div>
        <Menu
          theme={appStore.theme}
          selectedKeys={matchRouteObj?.selectedKeys}
          defaultOpenKeys={matchRouteObj?.selectedKeys}
          mode="inline"
          items={items}
        >
        </Menu>
      </Sider>
      <ALayout style={{ marginLeft: "200px"}}>
        <Header>header</Header>
        <Content className={$styles.content}>
          <TagsView delKeepAlive={delKeepAlive} keepAliveList={keepAliveList} />
          <Suspense fallback={<Loading />}>
            <KeepAlive activeName={matchRouteObj?.key} include={map((res) => res.key, keepAliveList)} maxLen={10}>
            {eleRef.current}
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
