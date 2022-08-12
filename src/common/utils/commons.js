import * as cookieUtil from 'common/utils/cookie'
import BigNumber from 'bignumber.js';

export function getQueryString(name) {
  let href = window.location.href;
  if (href.indexOf('?') !== -1) {
    let r = href.substr(href.indexOf('?') + 1).split('&');
    if (r.length > 0) {
      for (let i in r) {
        let s = r[i];
        let arr = s.split('=');
        if (arr.length === 2 && arr[0] === name) {
          return arr[1];
        }
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function trim(str) {
  if (str) {
    str = str.replace(/(^\s*)|(\s*$)/g, '');
  }
  return str;
}

export function getCookie(name) {
  let arr;
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg)))
    return unescape(arr[2]);
  else
    return null;
}

export function setCookie(name, value, days) {
  let domain = document.domain.split('.').slice(-2).join('.')
  if (!days) {
    days = 30;
  }
  let exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=' + domain;
}

export function importAll({r, type = 'object',isUpperCase = false}={}) {
  const modules = type === 'object' ? {} : [];
  r.keys().forEach(key => {
    let moduleKey = key.replace(/(\.\/|\.js)/g, '');
    modules[isUpperCase?moduleKey.toUpperCase():moduleKey] = r(key).default;
  });
  return modules;
}

/**
 * 输入框限制小数的输入规则，可限制指定的输入长度(小数点前后总长度)、指定小数点后的位数
 * @param {*} value 绑定值
 * @param {*} pointAfterDigit 小数点后几位，默认1位，可忽略
 */
export function floatInputLimit(value,pointAfterDigit=1,lang=cookieUtil.getCookie('language')) {
  let isDE=lang==='de-DE';
  let pattern=isDE?'\\.|,':'\\.';
  value=value+'';
  if (value.startsWith('.') || value.startsWith(',')) {
    value = value.substr(1);
  }
  value = value.replace(new RegExp(`[^\\d|${pattern}]`,'g'), "");    //清除"数字"和"."以外的字符
  let firstCommonIndex = value.indexOf(',');
  let firstDotIndex = value.indexOf('.');
  let firstSeperatorIndex = firstCommonIndex > 0 && firstDotIndex > 0
  ? Math.min(firstCommonIndex, firstDotIndex) : Math.max(firstCommonIndex, firstDotIndex);
  let seperatorChar;
  if(firstSeperatorIndex >= 0) {
    seperatorChar = value.charAt(firstSeperatorIndex)
    value = value.substr(0, firstSeperatorIndex) + seperatorChar +
      value.substr(firstSeperatorIndex + 1).replace(new RegExp(pattern, 'g'), '');
  }
  value = firstSeperatorIndex > 0 ? value.split(seperatorChar)[0].substring(0, 8)
  + seperatorChar
  + value.split(seperatorChar)[1].substr(0, pointAfterDigit) : value.substring(0, 8);
  value = value.replace(new RegExp(`^0*(0${seperatorChar}|[1-9])`), "$1");

   return value;
}


  /**
   *
   * @param {*} param0
   *
   *
    nStr=0,         //格式化数值
    decimals=2,     //小数后几位
    decimal='.',    //小数分隔符
    separator=',',  //千分位分隔符
    useGrouping=true//是否分组
    lang            //语言类型，用于区分德语环境下千分位为'.'   小数点分隔符为','
    */
  export function  formatNumber({
    nStr=0,
    decimals=2,
    decimal='.',
    separator=',',
    useGrouping=true,
    lang=''
  }={}) {
      let noChangeNstr=nStr;
      if(typeof nStr!=='number'){
        nStr=parseFloat(nStr);
        if(isNaN(nStr)){
          return noChangeNstr;
        }
      }

      if(lang==='de-DE'){
        decimal=',';
        separator='.'
      }
      nStr = new BigNumber(nStr).toFixed(decimals);
      nStr += '';
      var x, x1, x2, rgx;
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? decimal + x[1] : '';
      rgx = /(\d+)(\d{3})/;
      if (useGrouping) {
          while (rgx.test(x1)) {
              x1 = x1.replace(rgx, '$1' + separator + '$2');
          }
      }
      return   x1 + x2  ;
  }
