import {
  equals,
  isEmpty,
  map,
  find,
  findIndex,
  is,
  last,
  mergeRight,
  pick,
  pipe,
  clone
} from "ramda";
import type {NavigateFunction} from "react-router-dom"
import {ReactElement, JSXElementConstructor} from "react"


export interface TagsViewDto {
  key:string
  active:boolean
  title:string
  name:string
  ele?: ReactElement<any,string| JSXElementConstructor<any>> | null,
  hide?: boolean
}

export enum ActionType  {
  del = "DEL",
  add = "ADD",
  update = "UPDATE",
  clear = "CLEAR",
}

interface ActionDel {
  type: ActionType.del
  payload: ActionDelDto
}

interface ActionDelDto {
  key: string
  navigate: NavigateFunction
}

interface ActionClear {
  type: ActionType.clear
  payload: undefined
}

interface ActionTypeAddPayload {
  key: string
  title: string
  name: string
  ele?: ReactElement<any,string| JSXElementConstructor<any>> | null
  selectedKeys: string[]
}

interface ActionAdd {
	type: ActionType.add
	payload: ActionTypeAddPayload
}

interface ActionUp {
  type: ActionType.update
  payload: Partial<TagsViewDto> | TagsViewDto[]
}

export interface ActionUpdateTitlePayload {
  key: string
  title: string
}

export type Action = ActionDel | ActionAdd | ActionClear | ActionUp

/**
 * "If the argument is an array, return true, otherwise return false."
 *
 * The above function is a type guard. It's a function that takes an argument and returns a boolean. If
 * the boolean is true, the argument is of the type specified in the function
 * @param {any} arg - any
 * @returns A function that takes an argument and returns a boolean.
 */
export function isArray(arg: any): arg is Array<any> {
	return is(Array)(arg)
}


/**
 * 删除标签
 * @param {string} key - 标签key
 * @param {NavigateFunction} navigate - 路由函数
 * @param {TagsViewDto[]} keepAliveList - The current keepAliveList
 * @param {ActionDelDto}  keepAliveList: TagsViewDto[]
 * @returns A function that takes a list of tags and an action object and returns a new list of tags.
 */
export function delKeepAlive(keepAliveList: TagsViewDto[], { key, navigate }:ActionDelDto) {
  const index = findIndex((item: TagsViewDto) => equals(item.key, key), keepAliveList)
  console.log("delKeepAlive", key, index);
  if (equals(index, -1)) {
    return keepAliveList
  }
  let pathname = ''
  if (keepAliveList.length > 1) {
    const index = findIndex((item: TagsViewDto) => equals(item.key, key), keepAliveList)
    const data = keepAliveList[index]
    // 如果删除是  当前渲染     需要移动位置
    if (data && data.active) {
      // 如果是最后一个 那么  跳转到上一个
      // if (equals(index, keepAliveList.length - 1)) {
      //   pathname = keepAliveList[index - 1].key
      // } else {
      //   // 跳转到最后一个
      //   pathname = last(keepAliveList)?.key ?? ''
      // }
      pathname = last(keepAliveList)?.key ?? ''
    }
  }
  keepAliveList.splice(index, 1)
  if (!isEmpty(pathname)) {
    navigate({ pathname })
  }
  return keepAliveList.filter((_, k) => !equals(index, k))
}

const mergeMatchRoute = pipe(pick(['key', 'title', 'ele', 'name']), mergeRight({ active: true }))

export function addKeepAlive(state:TagsViewDto[], matchRouteObj:ActionTypeAddPayload) {
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
 * It takes a state and a keepAlive object and returns a new state with the keepAlive object merged
 * into the state
 * @param state - The current state of the keepAlive reducer.
 * @param keepAlive - The keep alive object that you want to update.
 * @returns A new array with the updated keepAlive object.
 */
export const updateKeepAlive = (state:Array<TagsViewDto>, keepAlive: Partial<TagsViewDto>) => {
  return map((item) => (equals(item.key, keepAlive.key) ? mergeRight(item, keepAlive) : item), state)
}

/**
 * It takes a list of tags and a partial tag and returns a new list of tags where the partial tag is
 * merged into the tag with the same key
 * @param {TagsViewDto[]} state - The current state of the store.
 * @param keepAlive - The keepAlive object that is passed in from the component.
 * @returns A function that takes two arguments, state and keepAlive.
 */
export const updateKeepAliveList = (state: Array<TagsViewDto>, keepAlive: Array<TagsViewDto>) => {
	return map((item) => {
		const data = find((res) => equals(res.key, item.key), keepAlive)
		if (data) {
			item = mergeRight(item, data ?? {})
		}
		return item
	}, state)
}


/**
 * It takes a state and an action and returns a new state
 * @param state - The current state of the store.
 * @param {Action} action - The action object that was dispatched.
 */
export const reducer = (state: Array<TagsViewDto>, action: Action):TagsViewDto[] => {
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
