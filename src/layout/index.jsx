/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-13 17:46:55
 * @LastEditTime: 2022-03-16 16:53:38
 */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useRoutes, useNavigate, Link } from "react-router-dom";
import { Menu, Layout } from "antd";
const { Header, Content, Sider } = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { connect } from 'react-redux'

const { SubMenu } = Menu;
import routes from "@/router";
import * as actions from "@/store/actions"
import Fulllogo from "@/assets/img/yanwen-full-logo.png";
import logo from "@/assets/img/logo.png";
import "./index.less";

const BackLayout = (props) => {
  const location = useLocation();
  const history = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(["/list"]);
  const pathRef = useRef("")
  const [panesItem, setPanesItem] = useState({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const element = useRoutes(routes);
  const onCollapse = (collapsed) => {
    setStoreData('SET_COLLAPSED', collapsed)
  };
  const {
    storeData: { collapsed, userInfo },
    setStoreData
  } = props


  useEffect(() => {
    setStoreData('SET_COLLAPSED', document.body.clientWidth <= 1366)
    setSelectedKeys([location.pathname]);
    console.log(location, history)
  }, [location.pathname, location.search, setStoreData, history]);

  const renderMenu = (menus) => {
    if (menus.length > 0) {
      return menus.map((menu, index) => {
        if (menu.children) {
          return (
            <SubMenu key={menu.path} title={menu.title}>
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
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          theme="light"
        >
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
            <span
              onClick={() => onCollapse(!collapsed)}
              style={{ cursor: "pointer" }}
            >
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

export default connect((state) => state, actions)(BackLayout);
