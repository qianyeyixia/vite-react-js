import React from "react";
import List from "@/pages/list";
import ListDetails from "@/pages/list/details";
import User from "@/pages/user";
import Home from "@/pages/home";
const routes = [
  {
    path: "/home",
    element: <Home />,
    exact: true,
    title: "首页",
  },
  {
    path: "/list",
    element: <List />,
    exact: true,
    title: "列表",
    children: [
      {
        path: "/list/detail",
        element: <ListDetails />,
        exact: true,
        title: "列表详情",
      },
    ],
  },
  {
    path: "/user",
    element: <User />,
    exact: true,
    title: "用户",
  },
];

export default routes;
