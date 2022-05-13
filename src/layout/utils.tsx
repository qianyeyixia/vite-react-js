import { isNil } from "ramda"
import { Menu } from "antd"
const { SubMenu } = Menu;

/**
 * It renders the menu.
 * @param menus - The menu data.
 * @returns A menu item.
 */
export const renderMenu = (menus) => {
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


/**
 * It merges the path with the parent path.
 * @param ele - The element that is being rendered.
 * @returns A function that returns a function.
 */
export function getLatchRouteByEle(
  ele
) {
  const data = ele?.props.value
  return isNil(data.outlet) ? data.matches : getLatchRouteByEle(data.outlet)
}

/**
 * Merge a path with a parent path
 * @param path - The path to be merged with the parent path.
 * @param [paterPath] - The path of the parent folder.
 * @returns the concatenated path.
 */
export function mergePtah(path, paterPath = '') {
	path = path.startsWith('/') ? path : '/' + path
	return paterPath + path
}
