export const getWebSiteAgreementUrls = (param, vm, lang) => {
  if (param) {
    const URLS = {
      terms: {
        'zh-CN': vm.$root.API.TERMS_AND_CONDITIONS_CN_URL,
        'en-US': vm.$root.API.TERMS_AND_CONDITIONS_EN_URL,
        'de-DE': vm.$root.API.TERMS_AND_CONDITIONS_DE_URL,
        'it-IT': vm.$root.API.TERMS_AND_CONDITIONS_IT_URL
      },
      privacy: {
        'zh-CN': vm.$root.API.PRIVACY_AND_POLICY_CN_URL,
        'en-US': vm.$root.API.PRIVACY_AND_POLICY_EN_URL,
        'de-DE': vm.$root.API.PRIVACY_AND_POLICY_DE_URL,
        'it-IT': vm.$root.API.PRIVACY_AND_POLICY_IT_URL
      },
      general: {
        'zh-CN': vm.$root.API.GENERAL_AND_TERMS_CN_URL,
        'en-US': vm.$root.API.GENERAL_AND_TERMS_EN_URL,
        'de-DE': vm.$root.API.GENERAL_AND_TERMS_DE_URL,
        'it-IT': vm.$root.API.GENERAL_AND_TERMS_IT_URL
      },
      cookies: {
        'zh-CN': [vm.$root.API.COOKIES_POLICY_STEP1_CN_URL, vm.$root.API.COOKIES_POLICY_STEP2_CN_URL, vm.$root.API.COOKIES_POLICY_STEP3_CN_URL, vm.$root.API.COOKIES_POLICY_STEP4_CN_URL],
        'en-US': [vm.$root.API.COOKIES_POLICY_STEP1_EN_URL, vm.$root.API.COOKIES_POLICY_STEP2_EN_URL, vm.$root.API.COOKIES_POLICY_STEP3_EN_URL, vm.$root.API.COOKIES_POLICY_STEP4_EN_URL],
        'de-DE': [vm.$root.API.COOKIES_POLICY_STEP1_DE_URL, vm.$root.API.COOKIES_POLICY_STEP2_DE_URL, vm.$root.API.COOKIES_POLICY_STEP3_DE_URL, vm.$root.API.COOKIES_POLICY_STEP4_DE_URL],
        'it-IT': [vm.$root.API.COOKIES_POLICY_STEP1_IT_URL, vm.$root.API.COOKIES_POLICY_STEP2_IT_URL, vm.$root.API.COOKIES_POLICY_STEP3_IT_URL, vm.$root.API.COOKIES_POLICY_STEP4_IT_URL],
      }
    }
    if (lang) {
      return URLS[param][lang]
    }
    return URLS[param][vm.$getCookie('language')]
  }
}
