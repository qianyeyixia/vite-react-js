import { clone, equals, find, findIndex, is, isEmpty, last, map, mergeRight } from 'ramda'

/**
 * Is the argument an array?
 * @param arg - The argument to check.
 * @returns A boolean value
 */
export function isArray(arg) {
  return is(Array)(arg)
}

/**
 * Given a list of items, remove the item with the given key from the list and return the list. 
 * If the list is empty, return an empty list
 * @param keepAliveList - The list of all the keep-alive components.
 * @returns The new keepAliveList.
 */
export function delKeepAlive(keepAliveList, { key, navigate }) {
  const index = findIndex((item) => equals(item.key, key), keepAliveList)

  if (equals(index, -1)) {
    return keepAliveList
  }
  let pathname = ''
  if (keepAliveList.length > 1) {
    const index = findIndex((item) => equals(item.key, key), keepAliveList)
    const data = keepAliveList[index]
    // 如果删除是  当前渲染     需要移动位置
    if (data && data.active) {
      // 如果是最后一个 那么  跳转到上一个
      if (equals(index, keepAliveList.length - 1)) {
        pathname = keepAliveList[index - 1].key
      } else {
        // 跳转到最后一个
        pathname = last(keepAliveList)?.key ?? ''
      }
    }
  }
  keepAliveList.splice(index, 1)
  if (!isEmpty(pathname)) {
    navigate({ pathname })
  }
  return clone(keepAliveList)
}


/**
 * Add the matchRouteObj to the state if it's not already in the state
 * @param state - The current state of the route tree.
 * @param matchRouteObj - The matchRouteObj that is being passed in.
 * @returns The new state.
 */
export function addKeepAlive(state, matchRouteObj) {
  if (state.some((item) => equals(item.key, matchRouteObj.key) && item.active)) {
    return state
  }
  let isNew = true
  // 改变选中的值
  const data = map((item) => {
    if (equals(item.key, matchRouteObj.key)) {
      item.active = true
      isNew = false
    } else {
      item.active = false
    }
    return item
  }, state)
  if (isNew) {
    if (data.length >= 10) {
      data.shift()
    }
    data.push(mergeMatchRoute(matchRouteObj))
  }
  return data
}

/**
 * Given a state and a keep alive, return a new state with the keep alive merged in.
 * @param state - The current state of the store.
 * @param keepAlive - The new keep alive object that we want to update.
 * @returns The updated state.
 */
export const updateKeepAlive = (state, keepAlive) => {
  return map((item) => (equals(item.key, keepAlive.key) ? mergeRight(item, keepAlive) : item), state)
}
/**
 * Update the keep alive list with the new keep alive data
 * @param state - The current state of the keep alive list.
 * @param keepAlive - The list of keep alive items.
 * @returns The updated state.
 */
export const updateKeepAliveList = (state, keepAlive) => {
  return map((item) => {
    const data = find((res) => equals(res.key, item.key), keepAlive)
    if (data) {
      item = mergeRight(item, data ?? {})
    }
    return item
  }, state)
}


/**
 * It takes the current state and an action, and returns the new state
 * @param state - The current state of the store.
 * @param action - The action object that was dispatched.
 * @returns A new state object.
 */
export const reducer = (state, action) => {
	switch (action.type) {
		case ActionType.add:
			return addKeepAlive(state, action.payload)
		case ActionType.del:
			return delKeepAlive(state, action.payload)
		case ActionType.clear:
			return []
		case ActionType.update:
			return !isArray(action.payload)
				? updateKeepAlive(state, action.payload)
				: updateKeepAliveList(state, action.payload);
		default:
			return state
	}
}