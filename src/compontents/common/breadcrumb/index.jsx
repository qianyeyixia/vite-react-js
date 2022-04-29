/*
 * @Author: wangyi
 * @Description:
 * @Date: 2022-04-25 15:33:32
 * @LastEditTime: 2022-04-29 11:13:50
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

import { Breadcrumb, Button } from "antd";

import { routes } from "@/router";
const Breadcrumbs = () => {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <Breadcrumb style={{ display: "inline-block" }}>
      {breadcrumbs.map((bc, index) => {
        return (
          <Breadcrumb.Item key={bc.key}>
            <Button
              disabled={(!bc.exact && bc.match.path !== "/") || index === breadcrumbs.length - 1}
              onClick={() => {
                navigate(bc.match.path);
              }}
              style={{ padding: "0" }}
              type="link"
            >
              {bc.name}
            </Button>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
