import axios from 'axios'
import {
  setToken,
  getToken,
  getTokenKey,
  getRefreshToken,
  removeToken,
} from '../modules/cookie'
import {baseURL} from '../utils/apiConfig'
/** **** 创建axios实例 ******/
// 本地切换1/2
const service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 5000000, // 请求超时时间
  withCredentials: true,
})

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${getToken()}`.replace(/\"/g, '')
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = <any[]>[]
service.interceptors.response.use(
  (response) => {
    return response
  },
  async(error) => {
    console.log("error")
    console.log(error)
    if (error.response.status) {
      if (error.response.status === 401) {
        if (error.response.data.message === 'User must be authorized.') {
          if (!isRefreshing) {
            isRefreshing = true
            return await axios({
              headers: {
                Authorization: `Bearer ${getRefreshToken()}`.replace(/\"/g, ''),
              },
              url: `${baseURL}/refresh_token`,
              method: 'put',
            }).then((res) => {
              console.log('已刷新token')
              const { token } = res.data
              setToken(token)
              error.config.headers[getTokenKey()] = `Bearer ${token}`
              error.config.baseURL = baseURL
              // 已经刷新了token，将所有队列中的请求进行重试
              requests.forEach(cb => cb(token))
              requests = []
              return service(error.config)
            })
              .catch ((res) => {
                removeToken()
                window.location.href = '/login'
              })
              .finally(() => {
                isRefreshing = false
              })
          }
          else {
          // 正在刷新token，将返回一个未执行resolve的promise
            return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
              requests.push((token) => {
                error.config.baseURL = baseURL
                error.config.headers[getTokenKey()] = `Bearer ${token}`
                resolve(service(error.config))
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
export default service
