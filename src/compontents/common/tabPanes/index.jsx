import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Alert, Dropdown, Menu } from "antd";

import { getKeyName } from "@/utils/publicFunc";

import { SyncOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/redux-hooks";

import { selectTabs, selectReloadPath, setTabs, setReloadPath } from "@/store/slicers/tabSlice";

import style from "./TabPanes.module.less";

const { TabPane } = Tabs;

const TabPanes = (props) => {
  const dispatch = useAppDispatch();
  const reloadPath = useAppSelector(selectReloadPath);
  const curTab = useAppSelector(selectTabs);
  const [activeKey, setActiveKey] = useState("");
  const [panes, setPanes] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState({});
  const pathRef = useRef("");
  const { defaultActiveKey, panesItem, tabActiveKey } = props;
  const history = useNavigate();
  const { pathname, search } = useLocation();
  const fullPath = pathname + search;

  // 记录当前打开的tab
  const storeTabs = useCallback(
    (ps) => {
      const pathArr = ps.reduce((prev, next) => [...prev, next.path], []);
      dispatch(setTabs(pathArr));
    },
    [dispatch]
  );

  // 从本地存储中恢复已打开的tab列表
  const resetTabs = useCallback(() => {
    const initPanes = curTab.reduce((prev, next) => {
      const { title, tabKey, component: Content } = getKeyName(next);
      return [
        ...prev,
        {
          title,
          key: tabKey,
          content: Content,
          closable: tabKey !== "home",
          path: next,
        },
      ];
    }, []);
    const { tabKey } = getKeyName(pathname);
    setPanes(initPanes);
    setActiveKey(tabKey);
  }, [curTab, pathname]);

  // 初始化页面
  useEffect(() => {
    resetTabs();
  }, [resetTabs]);

  // tab切换
  const onChange = (tabKey) => {
    setActiveKey(tabKey);
  };

  // 移除tab
  const remove = (key) => {
    const delIndex = panes.finIndex((item) => item.key === key);
    panes.splice(delIndex, 1);

    if (key !== activeKey) {
      const nextKey = activeKey;
      setPanes(panes);
      setActiveKey(nextKey);
      storeTabs(panes);
      return;
    }

    // 删除当前tab，地址往前推
    const nextPath = curTab[delIndex - 1];
    const { tabKey } = getKeyName(nextPath);
    // 如果当前tab关闭后，上一个tab无权限，就一起关掉
    if (nextPath !== "/") {
      remove(tabKey);
      history(curTab[delIndex - 2]);
    } else {
      history(nextPath);
    }
    setPanes(panes);
    storeTabs(panes);
  };

  // tab新增删除操作
  const onEdit = (targetKey, action) => action === "remove" && remove(targetKey);

  // tab点击
  const onTabClick = (targetKey) => {
    const { path } = panes.filter((item) => item.key === targetKey)[0];
    history(path);
  };
  // 刷新当前 tab
  const refreshTab = () => {
    setIsReload(true);
    setTimeout(() => {
      setIsReload(false);
    }, 1000);

    dispatch(setReloadPath(pathname + search));
    setTimeout(() => {
      dispatch(setReloadPath("null"));
    }, 500);
  };

  // 关闭其他或关闭所有
  const removeAll = async (isCloseAll) => {
    const { path, key } = selectedPanel;
    history(isCloseAll ? "/" : path);

    const homePanel = [
      {
        title: "首页",
        key: "home",
        content: Home,
        closable: false,
        path: "/",
      },
    ];

    const nowPanes = key !== "home" && !isCloseAll ? [...homePanel, selectedPanel] : homePanel;
    setPanes(nowPanes);
    setActiveKey(isCloseAll ? "home" : key);
    storeTabs(nowPanes);
  };

  useEffect(() => {
    const newPath = pathname + search;

    // 当前的路由和上一次的一样，return
    if (!panesItem.path || panesItem.path === pathRef.current) return;

    // 保存这次的路由地址
    pathRef.current = newPath;

    const index = panes.findIndex((_) => _.key === panesItem.key);
    // 无效的新tab，return
    if (!panesItem.key || (index > -1 && newPath === panes[index].path)) {
      setActiveKey(tabActiveKey);
      return;
    }

    // 新tab已存在，重新覆盖掉（解决带参数地址数据错乱问题）
    if (index > -1) {
      panes[index].path = newPath;
      setPanes(panes);
      setActiveKey(tabActiveKey);
      return;
    }

    // 添加新tab并保存起来
    panes.push(panesItem);
    setPanes(panes);
    setActiveKey(tabActiveKey);
    storeTabs(panes);
  }, [panes, panesItem, pathname, resetTabs, search, storeTabs, tabActiveKey]);

  const isDisabled = () => selectedPanel.key === "home";
  // tab右击菜单
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => refreshTab()} disabled={selectedPanel.path !== fullPath}>
        刷新
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={(e) => {
          e.domEvent.stopPropagation();
          remove(selectedPanel.key);
        }}
        disabled={isDisabled()}
      >
        关闭
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={(e) => {
          e.domEvent.stopPropagation();
          removeAll();
        }}
      >
        关闭其他
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={(e) => {
          e.domEvent.stopPropagation();
          removeAll(true);
        }}
        disabled={isDisabled()}
      >
        全部关闭
      </Menu.Item>
    </Menu>
  );

  // 阻止右键默认事件
  const preventDefault = (e, panel) => {
    e.preventDefault();
    setSelectedPanel(panel);
  };
  return (
    <div>
      <Tabs
        activeKey={activeKey}
        className={style.tabs}
        defaultActiveKey={defaultActiveKey}
        hideAdd
        onChange={onChange}
        onEdit={onEdit}
        onTabClick={onTabClick}
        type="editable-card"
      >
        {panes.map((pane) => (
          <TabPane
            closable={pane.closable}
            key={pane.key}
            tab={
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                trigger={['contextMenu']}
              >
                <span onContextMenu={(e) => preventDefault(e, pane)}>
                  {isReload &&
                    pane.path === fullPath &&
                    pane.path !== '/403' && (
                      <SyncOutlined title="刷新" spin={isReload} />
                    )}
                  {pane.title}
                </span>
              </Dropdown>
            }
          >
            {reloadPath !== pane.path ? (
              <pane.content path={pane.path} />
            ) : (
              <div style={{ height: '100vh' }}>
                <Alert message="刷新中..." type="info" />
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
};

export default TabPanes;
