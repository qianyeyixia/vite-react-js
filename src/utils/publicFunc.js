/*
 * @Author: wangyi
 * @Description: 
 * @Date: 2022-03-16 17:30:12
 * @LastEditTime: 2022-03-16 17:43:54
 */
import routes from '@/route'
import ErrorPage from '@/pages/public/errorPage'

/**
 * 隐藏手机号码
 * @param {string} phone 手机号
 */
export const hidePhone = (phone) =>
  phone && phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

/**
* 以递归的方式展平react router数组
* @param {object[]} arr 路由数组
* @param {string} child 需要递归的字段名
*/
export const flattenRoutes = (arr) =>
  arr.reduce(
    (prev, item) => {
      if (Array.isArray(item.children)) {
        prev.push(item)
      }
      return prev.concat(
        Array.isArray(item.children) ? flattenRoutes(item.children) : item
      )
    },
    []
  )

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
export const getKeyName = (path = '/403') => {
  const truePath = path.split('?')[0]
  const curRoute = flattenRoutes(routes).filter(
    (item) => item.path.includes(truePath)
  )
  if (!curRoute[0])
    return { title: '暂无权限', tabKey: '403', component: ErrorPage }
  const { name, key, component } = curRoute[0]
  return { title: name, tabKey: key, component }
}

/**
 * 同步执行操作，Currying
 * @param {*} action 要执行的操作
 * @param {function} cb 下一步操作回调
 */
export const asyncAction = (action, cb) => {
  const wait = new Promise((resolve) => {
    resolve(action)
  })
  return (/**
   * first
   */) => {
    wait.then(() => setTimeout(() => cb()))
  }
}


/**
 * 页签关闭操作回调
 * @param {object} history 路由history对象。不能new新实例，不然参数无法传递
 * @param {string} returnUrl 返回地址
 * @param {function} cb 回调操作，可选
 */
export const closeTabAction = (
  history,
  returnUrl = '/',
  cb
) => {
  const { curTab } = store.getState().storeData
  const { href } = window.location
  const pathname = href.split('#')[1]
  // 删除tab
  const tabArr = JSON.parse(JSON.stringify(curTab))
  const delIndex = tabArr.findIndex((item) => item === pathname)
  tabArr.splice(delIndex, 1)

  // 如果要返回的页面被关闭了，再加进去
  if (!tabArr.includes(returnUrl)) {
    tabArr.push(returnUrl)
  }

  // 储存新的tabs数组
  const setTab = store.dispatch({
    type: 'SET_CURTAB',
    payload: tabArr
  })
  // 刷新tab
  const reloadTab = store.dispatch({
    type: 'SET_RELOADPATH',
    payload: returnUrl
  })
  // 停止刷新tab
  const stopReload = setTimeout(() => {
    store.dispatch({
      type: 'SET_RELOADPATH',
      payload: 'null'
    })
  }, 500)

  const action = () => setTab && reloadTab && stopReload

  // 刷新回调
  const callback = () => {
    if (cb && typeof cb === 'function') {
      return cb
    }
    return history.push({
      pathname: returnUrl
    })
  }

  asyncAction(action)(callback)
}

