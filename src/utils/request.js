import axios from "axios"
import md5 from 'js-md5';
import dayjs from 'dayjs';
import { notification, message } from 'antd';


const errorCode = new Set(['999', '-1', '-2']);

const request = axios.create({
  timeout: 50000,
})

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    const { method, headers= {} } = config;
  },
  err => {

})
