import path from "path";
import dayjs from "dayjs";

import { defineConfig, UserConfig, ConfigEnv } from "vite";
import antOverride from "./theme.config";

console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), antOverride);

import { PORT, VITE_DROP_CONSOLE } from './config/constant';
import { createProxy } from "./config/vite/proxy";

import pkg from "./package.json";
import { createVitePlugins } from "./config/vite";
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === "build";
  return {
    base: "/",
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            'root-entry-name': 'default'
          }
        },
      },
    },
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        { find: /^~/, replacement: '' },
      ],
    },
    server: {
      host: true,
      port: PORT, // 开发环境启动的端口
      proxy: createProxy(),
    },
    define: {
      // 设置应用信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    plugins: createVitePlugins(mode, isBuild),
  };
});
