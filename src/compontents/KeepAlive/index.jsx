/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-22 17:49:45
 * @LastEditTime: 2022-04-29 11:29:31
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { equals, isNil, map, filter, not } from 'ramda'

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useUpdate } from '@/hooks/useUpdate'

function KeepAlive({ activeName, children, exclude, include, isAsyncInclude, maxLen = 10 }) {
  const containerRef = useRef(null)
  const components = useRef([])
  const [asyncInclude] = useState(isAsyncInclude)
  const update = useUpdate()
  useLayoutEffect(() => {
    if (isNil(activeName)) {
      return
    }
    // 缓存超过上限的
    if (components.current.length >= maxLen) {
      components.current = components.current.slice(1)
    }
    // 添加
    const component = components.current.find((res) => equals(res.name, activeName))
    if (isNil(component)) {
      components.current = [
        ...components.current,
        {
          name: activeName,
          ele: children,
        },
      ]
      if (not(asyncInclude)) {
        update()
      }
    }
    return () => {
      if (isNil(exclude) && isNil(include)) {
        return
      }
      components.current = filter(({ name }) => {
        if (exclude && exclude.includes(name)) {
          return false
        }
        if (include) {
          return include.includes(name)
        }
        return true
      }, components.current)
    }
  }, [children, activeName, exclude, maxLen, include, update, asyncInclude])

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
        components.current
      )}
    </>
  )
}

export default memo(KeepAlive)

function Component({ active, children, name, renderDiv }) {
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
