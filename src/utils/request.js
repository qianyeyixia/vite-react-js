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
    const { method, headers = {} ,url} = config;
    const cloneData = cloneDeep(config.data);
    const time = dayjs().valueOf().toString();
    let token = `url=/${url}&time=${time}&uuid=OzYWMqj3Xpe1Wxsh`;
    token = md5(token);
    config.headers = {
      ...config.headers,
      token,
      time,
      env: 'transport',
      url,
    }
    return config
  },
  err => {
    return Promise.reject(error);
  })

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  console.log(response)
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default request
