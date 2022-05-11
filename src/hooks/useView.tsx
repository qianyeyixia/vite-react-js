
import { createContext, useContext } from 'react'

import { Action } from '@/layout/tagsView/common'

import type {Dispatch, ReactNode} from "react"


interface ViewContext {
  name?:string
  dispatch?: Dispatch<Action>
  mate?:any
}


const ViewContext = createContext<ViewContext>({})
const Provider = ViewContext.Provider
export const useView = () => {
	// const routeContext = React.useContext(RouteContext)
	return useContext(ViewContext)
}

interface Props {
  children: ReactNode | JSX.Element
  value: ViewContext
}

export const ViewProvider = ({ value, children }: Props) => <Provider value={value}>{children}</Provider>
