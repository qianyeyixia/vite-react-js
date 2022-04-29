/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-03-23 11:01:26
 * @LastEditTime: 2022-03-23 13:45:49
 */
import React, { memo } from "react";
import {
  equals,
  isEmpty,
  map,
} from "ramda";
import { CloseOutlined } from "@ant-design/icons";


import indexModule from "./index.module.scss";
import classNames from "classnames/bind";
const styles = classNames.bind(indexModule);
function TagsView({ delKeepAlive, keepAliveList }) {
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
          ))}
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
