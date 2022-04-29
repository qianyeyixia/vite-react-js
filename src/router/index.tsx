import React from "react";
import {
  HomeOutlined,
  BankOutlined,
  UserOutlined,
  AuditOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  ApiOutlined
} from '@ant-design/icons';
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
    key: "home",
    icon: <HomeOutlined />
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
    key: "user",
    icon: <UserOutlined />
  },
];

export default routes;
