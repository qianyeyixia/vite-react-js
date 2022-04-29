/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-13 17:46:55
 * @LastEditTime: 2022-03-23 14:21:24
 */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useRoutes, useNavigate } from "react-router-dom";
import { Menu, Layout } from "antd";
import { WaterMark } from "@ant-design/pro-layout";

const { Header, Content, Sider } = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import KeepAlive from '@/components/KeepAlive'


import routes from "@/router";
import { getKeyName } from "@/utils/publicFunc";
import Fulllogo from "@/assets/img/yanwen-full-logo.png";
import logo from "@/assets/img/logo.png";
import "./index.less";


import {renderMenu} from "@/layout/utils"
import { useAppDispatch, useAppSelector } from "@/store/redux-hooks";
import { selectCollapsed, setCollapsed } from "@/store/slicers/appSlice";

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
      <Layout style={{ minHeight: "100vh" }}>
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
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <span onClick={() => onCollapse(!collapsed)} style={{ cursor: "pointer" }}>
              {collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              )}
            </span>
          </Header>
          <WaterMark content="蚂蚁集团">
            <Content
              style={{ margin: "20px", background: "#fff", padding: "20px", minHeight: "90vh" }}
            >
              {element}
            </Content>
          </WaterMark>
        </Layout>
      </Layout>
    </>
  );
};

export default BackLayout;
