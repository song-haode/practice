/**
 * cookie操作工具类
 * @author DINGYONG
 */
import Cookies from 'js-cookie'

/*********** ES6函数使用 import {functionName...} from common/util/cookie  PS:js和vue生命周期中使用都可以 ***********/
/**
 * 获取cookie的js对象
 * @param key 没有传值默认取全部
 */
export function getCookie(key){
  return Cookies.get(key);
}

/**
 * 获取cookie的json对象
 * @param key 没有传值默认取全部
 */
export function getCookieJSON(key){
  return Cookies.getJSON(key);
}

/**
 * 删除指定的cookie
 * @param key 没有传值默认取全部
 * @param path cookie的path
 */
export function removeCookie(key, path){
  if (path) {
    return Cookies.remove(key, { path: path });
  }
  return Cookies.remove(key);
}

/**
 * 设置cookie
 * @param key
 * @param value
 * @param pros  cookie的属性
 */
export function setCookie(key, value, pros){
  if (pros){
    return Cookies.set(key, value, pros)
  } else {
    return Cookies.set(key, value)
  }
}

/*********** vue prototype 使用 this.$functionName   PS:Vue生命周期中使用最便捷***********/
export default{
  install(Vue) {
    Vue.prototype.$getCookie = function (key){
      return Cookies.get(key);
    }
    Vue.prototype.$getCookieJSON = function (key){
      return Cookies.getJSON(key);
    }
    Vue.prototype.$removeCookie = function (key, path){
      if (path) {
        return Cookies.remove(key, { path: path });
      }
      return Cookies.remove(key);
    }
    Vue.prototype.$setCookie = function (key, value, pros){
      if (pros){
        return Cookies.set(key, value, pros)
      } else {
        return Cookies.set(key, value)
      }
    }
  }
}


/*********** ES6 js对象使用 import { usageCookie } from common/utils/cookie  PS:js和vue生命周期中使用都可以 ***********/
export const usageCookie = {
  /**
   * 获取整个cookie的js对象
   */
  getCookie(key){
    return Cookies.get(key);
  },
  /**
   * 获取指定cookie-key的json字符串
   * @param key
   */
  getCookieJSON(key){
    return Cookies.getJSON(key);
  },
  removeCookie(key, path){
    if (path) {
      return Cookies.remove(key, { path: path });
    }
    return Cookies.remove(key);
  },
  /**
   * 设置cookie
   * @param key
   * @param value
   * @param pros  过期时间,数字或JS Date
   */
  setCookie(key, value, pros){
    if (key === undefined || value === undefined) {
      console.error('The key or value of the cookie cannot be empty! ')
      return
    }

    if (pros){
      return Cookies.set(key, value, pros)
    } else {
      return Cookies.set(key, value)
    }
  }
}
