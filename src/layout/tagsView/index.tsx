
/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-23 11:01:26
 * @LastEditTime: 2022-05-16 10:42:43
 */
import React, { memo } from 'react';
import classNames from 'classnames/bind';
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
console.log(indexModule, 'indexModule');

function TagsView({ delKeepAlive, keepAliveList }: Props) {
  const location = useLocation();
  const onEdit = (targetKey, action) => {
    delKeepAlive(targetKey);
  };
  return (
    <div className={indexModule["tags-view-wrapper"]}>
      <Tabs type="editable-card" hideAdd onEdit={onEdit} tabBarStyle={{ margin: 0 }} activeKey={location.pathname}>
        {map((tag) => (
          <TabPane
            closeIcon={null}
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
