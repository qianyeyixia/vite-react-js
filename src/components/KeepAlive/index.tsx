/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-22 17:49:45
 * @LastEditTime: 2022-05-17 10:59:02
 */

import ReactDOM from 'react-dom'

import { equals, isNil, map, filter, not } from 'ramda'

import React, { memo, useEffect, useRef, useState, ReactNode, RefObject } from "react"

import { useUpdate } from '@/hooks/useUpdate'

export interface ComponentReactElement {
  children?: ReactNode | ReactNode[]
}



interface Props extends ComponentReactElement {
  activeName?: string
  include?: Array<string>
  exclude?: Array<string>
  maxLen?: number
}



export function KeepAlive({ activeName, children, exclude, include, maxLen = 10 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cacheComponents, setCacheComponents] = useState<Array<{ name: string; ele?: React.ReactNode }>>([])
  const update = useUpdate()
  useEffect(() => {
    if (isNil(activeName)) {
      return
    }
    setCacheComponents((components) => {
      // 缓存超过上限的
      if (components.length >= maxLen) {
        components = components.slice(1)
      }
      // 添加
      const component = components.find((res) => equals(res.name, activeName))
      if (isNil(component)) {
        components = [
          ...components,
          {
            name: activeName,
            ele: children,
          },
        ]
      }
      return isNil(exclude) && isNil(include)
        ? components
        : filter(({ name }) => {
          if (exclude && exclude.includes(name)) {
            return false
          }
          if (include) {
            return include.includes(name)
          }
          return true
        }, components)
    })
}, [children, activeName, exclude, maxLen, include])

return (
  <>
    <div ref={containerRef} className='keep-alive' />
    {map(
      ({ name, ele }) => (
        <Component
          active={equals(name, activeName)}
          renderDiv={containerRef}
          name={name}
          key={name}
        >
          {ele}
        </Component>
      ),
      cacheComponents
    )}
  </>
)
}

export default memo(KeepAlive)

interface ComponentProps extends ComponentReactElement {
  active: boolean
	name: string
	renderDiv: RefObject<HTMLDivElement>
}

function Component({ active, children, name, renderDiv }: ComponentProps) {
  const [targetElement] = useState(() => document.createElement('div'))
  const activatedRef = useRef(false)
  activatedRef.current = activatedRef.current || active
  useEffect(() => {
    if (active) {
      renderDiv.current?.appendChild(targetElement)
    } else {
      try {
        renderDiv.current?.removeChild(targetElement)
      } catch (e) {
        console.log(e)
      }
    }
  }, [active, name, renderDiv, targetElement])
  useEffect(() => {
    targetElement.setAttribute('id', name)
  }, [name, targetElement])
  return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>
}

export const KeepAliveComponent = memo(Component)
