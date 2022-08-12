import { Message } from 'element-ui'
import axios from 'axios'
import * as cookieUtil from 'common/utils/cookie'
import { convertI18nForJS } from 'common/utils/i18n'

let tipException = true
// 创建axios实例
const service = axios.create({
  withCredentials: true,
  needTipException: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    tipException = config.needTipException
    let headers = config.headers
    if (cookieUtil.getCookie('language')) {
      headers['Accept-Language'] = cookieUtil.getCookie('language')
    } else {
      headers['Accept-Language'] =
        navigator.language.substring(0, 2) === 'zh'
          ? 'zh-CN'
          : navigator.language.substring(0, 2) === 'de'
          ? 'de-DE'
          : navigator.language.substring(0, 2) === 'it'
          ? 'it-IT'
          : 'en-US'
    }
    headers['token'] = cookieUtil.getCookie('mf-seller-token')
    if (process.env.ENV_CONFIG === 'dev' && !headers['token']) {
      // headers['userCode'] = '10091311';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJ1c2VyQ29kZVwiOiBcIjEwMDkxMzExXCIsIFwiYXV0aENvdW50cnlcIjogXCJIS1wifSIsIm5iZiI6MTU5NTg1MDYzNSwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoxNjk1ODUwODE0fQ.o4Y6JdavSgPcgkmBVmTDBe7X4H-X31sxAXFXDZ7_LkisDcBpODulz0vfBUIoSFF6eTlqK_OLQuwRnWNQYWAqb7C9BcWWwfrxMvxX5oq5IlgDM-RCmF0vjFFJL3S-pDUWPHGH23qmy37_uG-V4U0Eug-3lxO8_DzTp16gfHHSvck'

      // headers['userCode'] = '10012516';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJ1c2VyQ29kZVwiOiBcIjEwMDEyNTE2XCIsIFwiYXV0aENvdW50cnlcIjogXCJIS1wifSIsIm5iZiI6MTU5NjQ1NzM2NiwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoxNjk2NDU3NTQ1fQ.DBYaJrvD9ntxnktIAUuEGLX0GWrRTo3zsVV3YfYiXE_eJeR_H_OjVP_RcVmYEtHfEAS1SBSbM9JotDb0v7bpyVui9Sl1nzbjibc2k43XuxU9GMolDlAhZk5o0_rftKr056_6X9f91SqxoN9C7cVvjBA0XLPiWQPLwutmMNVLnAQ'

      headers['userCode'] = '11885514'
      headers['token'] =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiR0JcIixcImNvbnRhaW5lclwiOntcImRlZmF1bHREYXRhQ2VudGVyQ29kZVwiOlwiVUtEQ1wifSxcInVzZXJDb2RlXCI6XCIxMTg4NTUxNFwifSIsIm5iZiI6MTY2MDI3MzM4MywiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoxNjYwMjc1MzYzfQ.zaO7VoPxJJiYP7d44swr7caXYVz6-DmVZqWgK86MiTwpwvze9iBqvKZYvFwrQhx8DUe6eFJ0pw6syzWNHrRphOKXpBMsw8KoGZcMoqlbxGSVk_UOWEOolzofJEcMSNsj2mD92pk9pl5NR1ap-g_YiV9fA8i6pEEKDmL1oizOCwE'

      // headers['userCode'] = '10091616';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiREVcIixcInVzZXJDb2RlXCI6XCIxMDA5MTYxNlwifSIsIm5iZiI6MTU5OTE4ODY0MywiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoyNTk5MTg4ODIyfQ.aJKwjB35bIDDFCp1ivfZ6mWG7ysUZYR8S5fIbfk4zYC2YmK9JLMGCBOFkoEXhjgnHlhlTdM__oJsnBebeGJey3oxgU69LBMMZO9r61QUwJTFddc32V8IMHmDxDrOAFSajFbLxcNWvDOOeKDECX4PuZByHnoukwB5DYXomoR2YrI'
      // headers['userCode'] = '10017416';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiREVcIixcInVzZXJDb2RlXCI6XCIxMDAxNzQxNlwifSIsIm5iZiI6MTYwMDQwOTIxMSwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoyNjAwNDA5MzkwfQ.Nwyjow1M4nEyBJvF54rEXgcV4lm1rDbsLn4_LummQTER-_IZ8qs5pNunDnAvvF82wPDBUhymN8QhoBjd_-5aFmAZs3-F509CpVXfyTXt67VnnL149yGh2dJwuQ9CVrkNWLIrG_9D6dhL2AXa2uKVzUGbQMXR19aAgLJ2XtplrcM'
      // headers['userCode'] = '10068317';
      // headers['userCode'] = '10068517';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiREVcIixcInVzZXJDb2RlXCI6XCIxMDA2ODMxN1wifSIsIm5iZiI6MTYwMDc0MjI0MiwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoyNjAwNzQyNDIxfQ.kiGEA4wM36k-zgnQVDLd_m44df2WckuL_FalLwJs-Vqvx8CdvwKqBdeFh-V7aIoydrY_kET2k1xX7gWEBJ0GVeYsAGHZxI4I90VLyrhDtCJcOh5Lqf1OTAPvGppJmCI1B7rATVfxEkAF2yv2jZqMtIbw3q1I6_vJ7fNXQQYAx3I'
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiSEtcIixcInVzZXJDb2RlXCI6XCIxMDA2ODUxN1wifSIsIm5iZiI6MTYwNTIzNTg1NiwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoyNjA1MjM2MDM1fQ.fx9skjpVI4F3S4skZzf4sZoRSQwXgIhHqGp0dYMzkt3_0K0iS3NmMpGFcZ-j-pB8Cx_UhGvFANDEnujNvPEfkP1T-wK_Pb5465q7sOVe9Bo2Z5vumVhPUcBFatJmIInI-Lm106urnwpo5IlGoOunDaeZvYUGLv6y9WlzqHTqftc'

      //鹏伟授信 问题排查
      // headers['userCode'] = '10029710';
      // headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJPQy1DbGllbnQiLCJzdWIiOiJMb2dpbi1DaGVjayIsImN1c3RvbWVyQ2xhaW0iOiJ7XCJhdXRoQ291bnRyeVwiOlwiREVcIixcInVzZXJDb2RlXCI6XCIxMDAyOTcxMFwifSIsIm5iZiI6MTYwNTQ5NjEwMCwiaXNzIjoiT0MtU2VydmVyIiwiZXhwIjoyNjA1NDk2Mjc5fQ.e7GqqpmddoQxKFF78kSIrZtSUJ28uBGIoId0dJXaMoSOrwhPDesQd6YXJP61uZU5asamJSC-F-EYVy8ZapA_pPexc8TA52xUxkN-OwZbmtG8wqvWHds_S5lVXJTiGdcLJXzfdFEcMOK7urae9JeqRXSCMrvWmjz39Z8GKR-vSJ0'
    }
    config.headers = headers
    if (process.env.ENV_CONFIG !== 'prod') {
      // console.info('config', config)
    }
    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
  }
)

// respone 拦截器
service.interceptors.response.use(
  response => {
    if (process.env.ENV_CONFIG !== 'prod') {
      // console.info('config', response)
    }
    //统一异常处理
    if (response && response.data) {
      const data = response.data
      //未登录则重定向
      if (data.errorCode === '302') {
        //清除session,返回到登录
        window.location.href = data.result
      } else {
        if (tipException) {
          if (!data.success && !data.hasBusinessException) {
            let errorMsg = convertI18nForJS('global.systemBusyMsg')
            // if (data.requestId) {
            //   errorMsg = `${convertI18nForJS('global.systemErrorMsg')}：${data.requestId}`
            // }
            Message({
              message: errorMsg,
              type: 'error',
              duration: 3 * 1000,
              showClose: true
            })
          } else {
            if (!data.success && (data.message || data.errorMsg)) {
              Message({
                message: data.message || data.errorMsg,
                type: 'error',
                duration: 3 * 1000,
                showClose: true
              })
            }
          }
        }
      }
      return Promise.resolve(data)
    }
  },
  error => {
    if (tipException) {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000,
        showClose: true
      })
    }
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
