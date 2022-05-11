/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-13 17:46:55
 * @LastEditTime: 2022-05-11 14:54:44
 */
import React, { useState, useEffect, useRef, FunctionComponent, memo, Suspense,useCallback,useMemo,useReducer } from "react";
import { BackTop, Layout as ALayout, Menu } from "antd";

import { Link, useLocation, useNavigate, useRoutes } from "react-router-dom";
import {equals, isNil, last, map} from "ramda"


const { Header, Content, Sider } = ALayout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";


import type { RouteMatch, RouteObject } from 'react-router'


import KeepAlive from '@/components/KeepAlive'

import routes from "@/router";
import { getKeyName } from "@/utils/publicFunc";
import TagsView, { Action, ActionType, reducer } from './tagsView'

import Fulllogo from "@/assets/img/yanwen-full-logo.png";
import logo from "@/assets/img/logo.png";
import "./index.less";
import $styles from './tagsView/index.module.scss'


import {renderMenu} from "@/layout/utils"
import { useAppDispatch, useAppSelector } from "@/store/redux-hooks";
import { selectCollapsed, setCollapsed } from "@/store/slicers/appSlice";
import WaterMark from "@/components/WaterMark";

const BackLayout = () => {
  const collapsed = useAppSelector(selectCollapsed);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const history = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(["/list"]);
  const pathRef = useRef("");
  const [panesItem, setPanesItem] = useState({
    title: "",
    content: null,
    key: "",
    closable: false,
    path: "",
  });
  const element = useRoutes(routes);
  const onCollapse = (new_collapsed) => {
    dispatch(setCollapsed(new_collapsed));
  };

  useEffect(() => {
    dispatch(setCollapsed(document.body.clientWidth <= 1366));
    const { tabKey, title, component: Content } = getKeyName(location.pathname);
    if (location.pathname === pathRef.current) {
      setSelectedKeys([tabKey]);
      return;
    }
    const newPath = location.search ? location.pathname + location.search : location.pathname
    pathRef.current = newPath
    setSelectedKeys([tabKey])
    console.log(location, history);
  }, [location.pathname, location.search, history]);


  const onSelectedKeys = ({ selectedKeys }) => {
    setSelectedKeys(selectedKeys);
  };

  return (
    <>
      <ALayout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme="light">
          <div className="logo">
            {collapsed ? (
              <img src={logo} className="logo-logo" alt="logo" />
            ) : (
              <img className="logo-full" src={Fulllogo} alt="logo" />
            )}
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["/"]}
            selectedKeys={selectedKeys}
            onSelect={onSelectedKeys}
          >
            {renderMenu(routes)}
          </Menu>
        </Sider>
        <ALayout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <span onClick={() => onCollapse(!collapsed)} style={{ cursor: "pointer" }}>
              {collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              )}
            </span>
          </Header>
          <WaterMark content="燕文-运输系统">
            <Content
              style={{ margin: "20px", background: "#fff", padding: "20px", minHeight: "90vh" }}
            >
              {element}
            </Content>
          </WaterMark>
        </ALayout>
      </ALayout>
    </>
  );
};

export default BackLayout;
