/*
 * @Author: wangyi
 * @Description: 
 * @Date: 2022-03-16 11:07:17
 * @LastEditTime: 2022-03-16 11:07:21
 */
const initState = {
  userInfo: {
    userName: '',
    permission: [],
    token: ''
  }, // 用户信息
  collapsed: false, // 菜单收纳状态
  curTab: [], // 当前tab页面
  theme: '', // 网站主题
  reloadPath: 'null' // 需要刷新的tab路径
}

export default initState