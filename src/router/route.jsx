/*
 * @Author: wangyi
 * @Description: 
 * @Date: 2022-03-15 15:15:19
 * @LastEditTime: 2022-03-15 16:14:44
 */
import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithSubRoutes = (route, index) => {
  return (
    <Route key={`route-${route.path}-${index}`} path={route.path} element={route.element}>
      {
        route.routes && route.routes.length ?
          route.routes.map((item, i) => (
            RouteWithSubRoutes(item,i)
          )) : null
      }
    </Route>
  )
}
export {RouteWithSubRoutes};