
/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-23 11:01:26
 * @LastEditTime: 2022-05-11 10:07:23
 */
import React, { memo } from 'react';
import classNames from 'classnames/bind';
import indexModule from './index.module.scss';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  equals,
  isEmpty,
  map,
} from "ramda";
import {TagsViewDto} from "./common"

interface Props {
  delKeepAlive: (key:string) => void
  keepAliveList: TagsViewDto[]
}

const styles = classNames.bind(indexModule);
function TagsView({ delKeepAlive, keepAliveList }:Props) {
  return (
    <>
      <div
        className={indexModule.tagsViewContainer}
        style={{ background: "#fff", paddingLeft: "16px" }}
      >
        <div className={indexModule.tagsViewWrapper}>
          {map((tag) => (
            <Link
              to={tag.key}
              className={styles({
                tagsViewItem: true,
                select: tag.active || equals(keepAliveList.length, 1),
              })}
              color="#fff"
              key={tag.key}
            >
              {tag.title}
              {keepAliveList.length > 1 && (
                <CloseOutlined
                  className={indexModule.closeIcon}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    delKeepAlive(tag.key);
                  }}
                />
              )}
            </Link>
          ), keepAliveList)}
        </div>
      </div>
      <div
        className={styles({
          tagsHeight: !isEmpty(keepAliveList),
        })}
      />
    </>
  );
}

export default memo(TagsView)
