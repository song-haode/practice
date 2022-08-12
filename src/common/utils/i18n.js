//https://github.com/kazupon/vue-i18n/issues/149
// translate utils
import router from 'common/router'

export function convertI18n(key) {
  const hasKey = this.$te(key)
  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    return this.$t(key)
  }
  return key
}

export function convertI18nForJS(key) {
  const hasKey = router.app.$te(key)
  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    return router.app.$t(key)
  }
  return key
}

