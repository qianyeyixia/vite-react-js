import { ReactNode } from "react";


export interface NestedRoute {
  path: string
  routes?: NestedRoute[]
}

type MenuType = "menu"| "submenu" | "item"

export interface MenuRoute extends NestedRoute {
  name?:string;
  routes?: MenuRoute[] | undefined;
  authority?: string[] | string;
  icon?: string| ReactNode;
  type?: MenuType;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  locale?: string;
  [key: string]: any;
}
