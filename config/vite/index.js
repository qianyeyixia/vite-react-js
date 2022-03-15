/*
 * @Author: wangyi
 * @Description: 
 * @Date: 2022-03-11 15:42:14
 * @LastEditTime: 2022-03-15 15:53:39
 */
import legacy from '@vitejs/plugin-legacy';
import viteReact from "@vitejs/plugin-react";
import viteCompression from 'vite-plugin-compression';
import {
  VITE_APP_COMPRESS_GZIP,
  VITE_APP_COMPRESS_GZIP_DELETE_FILE,
  VITE_APP_LEGACY,
} from '../constant';
import configStyleImportPlugin from "./plugins/styleImport"

export function createVitePlugins(viteEnv, isBuild) {
  const vitePlugins = [
    viteReact(),
  ];

  // @vitejs/plugin-legacy
  VITE_APP_LEGACY && isBuild && vitePlugins.push(legacy());

    // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin(viteEnv));

  if (isBuild) {
    // rollup-plugin-gzip
    VITE_APP_COMPRESS_GZIP &&
      vitePlugins.push(
        viteCompression({ deleteOriginFile: VITE_APP_COMPRESS_GZIP_DELETE_FILE }),
      );
  }
  return vitePlugins
}