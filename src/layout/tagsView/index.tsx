
/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-23 11:01:26
 * @LastEditTime: 2022-05-17 11:02:54
 */
import React from 'react';
import classNames from 'classnames';
import { Tabs } from "antd"
import indexModule from "./index.module.less";
import { Link, useLocation } from 'react-router-dom';
import {
  map,
} from "ramda";
import { TagsViewDto } from "./common"

import { Action, ActionType, reducer } from "./common"

const { TabPane } = Tabs;

interface Props {
  delKeepAlive: (key: string) => void
  keepAliveList: TagsViewDto[]
}

function TagsView({ delKeepAlive, keepAliveList }: Props) {
  const location = useLocation();
  const onEdit = (targetKey, action) => {
    console.log(targetKey, action);
    if(action === "remove") {
      delKeepAlive(targetKey);
    }
  };
  return (
    <div className={indexModule["tags-view-wrapper"]}>
      <Tabs type={
        keepAliveList.length > 1 ? "editable-card" : "card"
      } hideAdd onEdit={onEdit} tabBarStyle={{ margin: 0 }} activeKey={location.pathname}>
        {map((tag) => (
          <TabPane
            tab={
              <Link
                to={tag.key}
                color="#fff"
                key={tag.key}
              >
                {tag.title}
              </Link>
            }
            key={tag.key}

          />
        ), keepAliveList)}
      </Tabs>
    </div>
  );
}

export { ActionType, reducer };
export type { Action };

export default TagsView
