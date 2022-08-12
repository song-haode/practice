import moment from 'moment-timezone'
import { usageCookie } from './cookie'
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

// 根据当前语言类型渲染日期格式
const renderTimeFormat = (dateType) => {
  const setTimeLocale = usageCookie.getCookie('language').substring(0,2) === 'zh' ? 'zh-cn' : usageCookie.getCookie('language').substring(0,2)
  moment.locale(setTimeLocale)
  if (setTimeLocale !== 'zh-cn' ) {
    return dateType === 'date' ? 'll' : 'MMMM Do YYYY, H:mm:ss'
  } else {
    return dateType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD H:mm:ss'
  }
}

export const dateUtil = {
  /**
   * 日期格式化 国际化
   * @param date 日期
   * @param format 格式
   * @param dateType 格式类型 (只在format没有设置的情况下使用默认format才起作用)
   * @returns {string}
   */
  dateFormat(date, format, dateType) {
    if (!format) {
      format = renderTimeFormat(dateType)
    }
    if (date) {
      return moment(date).format(format);
    }
  },
  /**
   * 日期格式化 时区  国际化
   * @param date 日期
   * @param country 国家二字码 (必传)
   * @param format 格式
   * @returns {string}
   */
  dateFormatTimeZone(date, country, format) {
    if (country) {
      const timeZoneRegion = moment.tz.zonesForCountry(country)
      if (!format) {
        format = renderTimeFormat()
      }
      if (date) {
        return moment(date).tz(timeZoneRegion[0]).format(format);
      }
    }
  },
  formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  }
};

const dictionaryUtil = {
  /**
   * 根据数据字典 code 从数据字典中获取 值信息
   * @param dictionaryCode 数据字典编码
   * 后台数据字典 报文
   *  [{"details": [
          {
            "dictionaryCode": "approve_status",
            "language": "zh-CN",
            "systemCode": "HULK",
            "valueCode": "2",
            "valueName": "审批不通过",
            "valueSequence": 2
          }],
        "dictionaryCode": "approve_status",
        "dictionaryName": "审批结果",
        "remark": "审批结果",
        "systemCode": "HULK"
      }]
   */
  getDictionaryDetails (_this, dictionaryCode) {
    let data = _this.$store.state.dictionary.dictionaryCacheStore;
    if (!dictionaryCode){
      return {};
    }
    let dictionaryObj = data.filter(dic => (''+dictionaryCode) === (dic.dictionaryCode + ''));
    return dictionaryObj.length > 0 ? dictionaryObj[0] : {}
  },
  /**
   * 根据数据字典 数据字典key  返回数据字典显示值
   * @param dictionary [数据字典]
   * @param code [key]
   */
  getDictionaryValueByCode(dictionary, code){
    let value = '';
    if (dictionary && code){
      dictionary.forEach( dic => {
        if (dic.value === code) {
          value = dic.label;
        }
      })
    }
    return value;
  },
  /**
   * 获取数据字典值
   * @param _this
   * @param dictionaryCode 父级编码
   * @param code 子集编码
   */
  getValueByDictionary(_this,dictionaryCode,code){
    return  this.getDictionaryValueByCode(this.getDictionaryDetails(_this,dictionaryCode).de,code+'');
  },
  /**
   *
   * @param treeData 树
   * @param dictionaryCode 数据字典key
   */
  getTreeInt_l(_this,treeData,dictionaryCode){
    if (!treeData) {
      return
    }
    let dictionary = this.getDictionaryDetails(_this,dictionaryCode);
    treeData.forEach( c =>{
      if (c.children && c.children.length>0){
        c.label = this.getTreeInt_l(_this,c.children,dictionaryCode)
      }
      c.label = this.getDictionaryValueByCode(dictionary,c.id)
    });
    return treeData;
  }
};

const httpUtil = {
  get:function (_this,url,successFunction, errorFunction) {
    _this.$get(url).then(data => {
      if (data){
        if (data.success){
          successFunction(data);
        } else {
          if (!data.hasBusinessException) {
            _this.$Message.success({
              content: data.message,
              closable: true
            });
          } else {
            _this.$Message.error({
              content: data.message,
              closable: true
            })
          }
          if (errorFunction !== null) {
            errorFunction(data);
          }
        }
      }
    }).catch(e => {
      console.error(e);
      errorFunction()
    })
  },
  post:function(_this,url,reqMethod, param , successFunction, errorFunction,timeout) {
    _this.$mergePostAndPut(url, param, reqMethod,timeout).then(data => {
      if (data) {
        if (data.success){
          successFunction(data);
        } else {
          if (!data.hasBusinessException) {
            _this.$Message.success({
              content: data.message,
              closable: true
            });
          } else {
            _this.$Message.error({
              content: data.message,
              closable: true
            })
          }
          if (errorFunction !== null) {
            errorFunction(data);
          }
        }
      }
    }).catch(e=> {
      console.error(e)
      errorFunction()
    })
  },
};

const strUtil = {
  trim (str){
    if (str) {
      str = str.replace(/(^\s*)|(\s*$)/g, '');
    }
    return str;
  }
}


export const utilCollection = {
  dateUtil,
  httpUtil,
  dictionaryUtil,
  strUtil
};


export default utilCollection

