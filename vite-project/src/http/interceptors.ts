// 首先引入axios和上一步封装的cookie方法
import axios, { AxiosInstance } from 'axios'
import {
  setToken,
  getToken,
  getTokenKey,
  getRefreshToken,
  removeToken,
} from '../modules/cookie'
import { baseURL } from '../utils/apiConfig'
export class Interceptors {
  instance: AxiosInstance
  isRefreshing = false
  // 重试队列，每一项将是一个待执行的函数形式
  requests = <any[]>[]
  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 300000,
      withCredentials: true,
    })
    this.init()
  }

  // 初始化拦截器
  init() {
    // 请求接口拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 判断一下是否有cookie 如果有的话则把cookie放入请求头中
        if (getToken()) {
          config.headers[getTokenKey()] = `Bearer ${getToken()}`.replace(/\"/g, '')
          return config
        }
        return config
      },
      (err) => {
        console.error(err)
      },
    )
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      async(error) => {
        console.log('响应拦截器：', error)
        // 响应错误
        if (error.response.status) {
          if (error.response.status === 401) {
            if (error.response.data.message === 'User must be authorized.') {
              if (!this.isRefreshing) {
                this.isRefreshing = true
                return await axios({
                  headers: {
                    Authorization: `Bearer ${getRefreshToken()}`.replace(/\"/g, ''),
                  },
                  url: `${baseURL}/refresh_token`,
                  method: 'put',
                }).then((res) => {
                  const { token } = res.data
                  setToken(token)
                  error.config.headers[getTokenKey()] = `Bearer ${token}`
                  error.config.baseURL = baseURL
                  // 已经刷新了token，将所有队列中的请求进行重试
                  this.requests.forEach(cb => cb(token))
                  this.requests = []
                  return this.instance(error.config)
                })
                  .catch ((res) => {
                    removeToken()
                    window.location.href = '/login'
                  })
                  .finally(() => {
                    this.isRefreshing = false
                  })
              }
              else {
              // 正在刷新token，将返回一个未执行resolve的promise
                return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                  this.requests.push((token) => {
                    error.config.baseURL = baseURL
                    error.config.headers[getTokenKey()] = `Bearer ${token}`
                    resolve(this.instance(error.config))
                  })
                })
              }
            }
            return error.response
          }
          if (error.response.status === 403) {
            if (error.response.data.message === 'Wrong Token') {
              removeToken()
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      },

    )
  }

  // 返回一下
  getInterceptors() {
    return this.instance
  }
}
