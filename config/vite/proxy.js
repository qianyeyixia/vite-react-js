/*
 * @Author: wangyi
 * @Description: 
 * @Date: 2022-03-11 16:40:13
 * @LastEditTime: 2022-03-11 17:08:02
 */
import { VITE_PROXY_HTTP } from '../constant';

export function createProxy() {
  const ProxyList= {
    '/api': {
      target: VITE_PROXY_HTTP,
      changeOrigin: true,
      rewrite: (pre) => pre.replace(/^\/api/, ''), // 将 /api 重写为空
    },
  };
  return ProxyList;
}