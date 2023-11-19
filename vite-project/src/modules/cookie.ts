const TokenKey = 'Authorization'
const RefreshTokenKey = 'refresh_token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}
export function getTokenKey() {
  return TokenKey// 获取key
}
export function getRefreshTokenKey() {
  return RefreshTokenKey
}

export function setToken(token: any) {
  localStorage.setItem(TokenKey, JSON.stringify(token))
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshTokenKey)
}

export function setRefreshToken(refreshToken: any) {
  localStorage.setItem(RefreshTokenKey, JSON.stringify(refreshToken))
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(RefreshTokenKey)
}
