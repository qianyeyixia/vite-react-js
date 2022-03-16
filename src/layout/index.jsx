/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-13 17:46:55
 * @LastEditTime: 2022-03-16 14:02:30
 */
import React, { useState, useEffect } from "react";
import { Route, Link, useLocation, useRoutes } from "react-router-dom";
import { Menu } from "antd";
import { Layout } from "antd";
import routes from "@/router";
const { Header, Content, Sider } = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
const { SubMenu } = Menu;

import Fulllogo from '@/assets/yanwen-full-logo.png';
import logo from '@/assets/logo.png';
import "./index.less";

const BackLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["/list"]);
  const element = useRoutes(routes);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const renderMenu = (menus) => {
    if (menus.length > 0) {
      return menus.map((menu, index) => {
        if(menu.children){
          return (
            <SubMenu
              key={menu.path}
              title={menu.title}
            >
              {renderMenu(menu.children)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={menu.path}>
              <Link to={menu.path}>{menu.title}</Link>
            </Menu.Item>
          );
        }
      });
    }
  };

  const onSelectedKeys = ({ selectedKeys }) => {
    setSelectedKeys(selectedKeys);
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme="light">
          <div className="logo">
            {
              collapsed ? <img src={logo} className="logo-logo" alt="logo" /> : <img className="logo-full" src={Fulllogo} alt="logo" />
            }
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
            <span onClick={() => onCollapse(!collapsed)} style={{cursor: "pointer"}}>
              {collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 20, marginLeft: 20 }} />
              )}
            </span>
          </Header>
          <Content
            style={{ margin: "20px", background: "#fff", padding: "20px" }}
          >
            {element}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default BackLayout;
