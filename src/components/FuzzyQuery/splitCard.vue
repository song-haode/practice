<template>
  <div>
    <!-- <h2>Split Card element integration</h2> -->
    <!-- Styling example below: show loading state when element is not ready -->
    <p id="loading">
      Loading...
    </p>
    <p id="error" style="display:none" />
    <div id="card-container" :style="{ display: 'none' }">
      <div class="field-container">
        <div style="text-align: left;">
          <!-- Card number card -->
          {{ $t('global.button.card') }}
        </div>
        <div id="cardNumber" />
        <p id="cardNumber-error" :style="{ color: 'red' }" />
      </div>
      <div class="field">
        <div style="width: 200px;">
          <div class="field-label">
            <!-- Expiry -->
            <!-- 有效日期 -->
            {{ $t('global.button.Expiration') }}
            <span class="span">{{ $t('global.button.Expirations') }}</span>
          </div>
          <div id="expiry" />
          <p id="expiry-error" :style="{ color: 'red' }" />
        </div>
        <div style="width: 200px;">
          <div class="field-label">
            <!-- Cvc -->
            <!-- 安全码 -->
            {{ $t('global.button.cvv') }}
            <span class="span">{{ $t('global.button.cvvs') }}</span>
          </div>
          <div id="cvc" />
          <p id="cvc-error" :style="{ color: 'red' }" />
        </div>
      </div>
      <!-- STEP #3b: Add a submit button to trigger the payment request -->
      <el-button
        type="primary"
        id="confirm"
        v-loading.fullscreen.lock="fullscreenLoading"
        :disabled="disabled"
        @click="triggerConfirm(1)"
      >
        <!-- Confirm -->
        {{ $t(payString) }}
      </el-button>
      <el-button @click="outerVisible">{{ $t('account.label.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
// STEP #1: Import airwallex-payment-elements package
import {
  createElement,
  confirmPaymentIntent,
  loadAirwallex,
  getElement,
  createPaymentConsent
} from 'airwallex-payment-elements'
import { convertI18nForJS } from 'common/utils/i18n'

let vm = null
// Enter your Payment Intent secret keys here
// More on getting these secrets: https://www.airwallex.com/docs/api#/Payment_Acceptance/Payment_Intents/Intro
const intent_id = 'replace-with-your-intent-id'
const client_secret = 'replace-with-your-client-secret'

const init = () => {
  // STEP #2: Initialize Airwallex on mount with the appropriate production environment and other configurations
  loadAirwallex({
    env: 'demo', // Can choose other production environments, 'staging | 'demo' | 'prod'
    origin: window.location.origin, // Setup your event target to receive the browser events message
    fonts: [
      // Customizes the font for the payment elements
      {
        src: 'https://checkout.airwallex.com/fonts/CircularXXWeb/CircularXXWeb-Regular.woff2',
        family: 'AxLLCircular',
        weight: 400
      }
    ]
    // For more detailed documentation at https://github.com/airwallex/airwallex-payment-demo/tree/master/docs#loadAirwallex
  }).then(() => {
    // STEP #4: Create and mount the individual card elements
    const cardNumEle = createElement('cardNumber')
    const cvcEle = createElement('cvc')
    const expiryEle = createElement('expiry')

    // STEP #5: Mount split card elements
    cardNumEle.mount('cardNumber') // This 'cardNumber' id MUST MATCH the id on your cardNumber empty container created in Step 3
    cvcEle.mount('cvc') // Same as above
    expiryEle.mount('expiry') // Same as above
  })
}

// Set up local variable to check all elements are mounted
const elementsReady = {
  cardNumber: false,
  expiry: false,
  cvc: false
}

// STEP #7: Add an event handler to ensure the element is mounted
const onReady = event => {
  const { type } = event.detail
  if (elementsReady.hasOwnProperty(type)) {
    elementsReady[type] = true // Set element ready state
  }

  if (!Object.values(elementsReady).includes(false)) {
    document.getElementById('loading').style.display = 'none' // Example: hide loading state when element is mounted
    document.getElementById('card-container').style.display = 'block' // Example: show element when mounted
  }
}

// Set up local variable to validate element inputs
const elementsCompleted = {
  cardNumber: false,
  expiry: false,
  cvc: false
}

// STEP #8: Add an event listener to listen to the changes in each of the input fields
const onChange = event => {
  const { type, complete } = event.detail
  if (elementsCompleted.hasOwnProperty(type)) {
    elementsCompleted[type] = complete // Set element completion state  disabled
  }

  // Check if all elements are completed, and set submit button disabled state
  const allElementsCompleted = !Object.values(elementsCompleted).includes(false)
  // document.getElementById('confirm').disabled = !allElementsCompleted

  vm.disabled = !allElementsCompleted
}

// STEP #9: Add an event listener to handle events when there is an error
const onError = event => {
  /*
    ... Handle event on error
  */
  const { error } = event.detail
  document.getElementById('error').style.display = 'block' // Example: show error block
  document.getElementById('error').innerHTML = error.message // Example: set error message
}

// STEP #10: Add an event listener to get input focus status
const onFocus = event => {
  const { type } = event.detail
  const element = document.getElementById(`${type}-error`)
  if (element) {
    element.innerHTML = '' // Example: clear input error message
  }
  // Customize your input focus style by listen onFocus event
}

// STEP #11: Add an event listener to show input error message when finish typing
const onBlur = event => {
  const { error, type } = event.detail
  const element = document.getElementById(`${type}-error`)
  if (element && error) {
    // 中文 zh-CN
    if (vm.lang === 'zh-CN') {
      element.innerHTML = error.message || JSON.stringify(error) // Example: set input error message
    }
    // en-US
    if (vm.lang === 'en-US') {
      if (type === 'cardNumber') {
        if (error.code === 'required') {
          let requiredUS = convertI18nForJS('global.requiredUS') //卡号必填
          element.innerHTML = requiredUS
        }
        if (error.code === 'invalid') {
          let invalidUS = convertI18nForJS('global.invalidUS') //卡号无效
          element.innerHTML = invalidUS
        }
      }
      if (type === 'expiry') {
        if (error.code === 'required') {
          let expiredExpirationUS = convertI18nForJS('global.expiredExpirationUS') //有效期必填 全用
          element.innerHTML = expiredExpirationUS
        }
        if (error.code === 'expired') {
          let requiredExpirationUS = convertI18nForJS('global.requiredExpirationUS') //有效期不得过期 全用
          element.innerHTML = requiredExpirationUS
        }
        if (error.code === 'invalid') {
          let invalidExpirationUS = convertI18nForJS('global.invalidExpirationUS') //有效期不完整 全用
          element.innerHTML = invalidExpirationUS
        }
      }
      if (type === 'cvc') {
        if (error.code === 'required') {
          let CVVrequired = convertI18nForJS('global.cvvrequiredUS') // 安全码必填
          element.innerHTML = CVVrequired
        }
        if (error.code === 'invalid') {
          let cvvinvalid = convertI18nForJS('global.cvvinvalidUS') // 安全码不完整
          element.innerHTML = cvvinvalid
        }
      }
    }
    // it-IT
    if (vm.lang === 'it-IT') {
      if (type === 'cardNumber') {
        if (error.code === 'required') {
          let requiredIT = convertI18nForJS('global.requiredIT') //卡号必填
          element.innerHTML = requiredIT
        }
        if (error.code === 'invalid') {
          let invalidIT = convertI18nForJS('global.invalidIT') //卡号无效
          element.innerHTML = invalidIT
        }
      }
      if (type === 'expiry') {
        if (error.code === 'expired') {
          let expiredExpirationIT = convertI18nForJS('global.expiredExpirationIT') //有效期不得过期 全用
          element.innerHTML = expiredExpirationIT
        }
        if (error.code === 'required') {
          let requiredExpirationIT = convertI18nForJS('global.requiredExpirationIT') //有效期必填 全用
          element.innerHTML = requiredExpirationIT
        }
        if (error.code === 'invalid') {
          let invalidExpirationIT = convertI18nForJS('global.invalidExpirationIT') //有效期不完整 全用
          element.innerHTML = invalidExpirationIT
        }
      }
      if (type === 'cvc') {
        if (error.code === 'required') {
          let cvvrequiredIT = convertI18nForJS('global.cvvrequiredIT') // 安全码必填
          element.innerHTML = cvvrequiredIT
        }
        if (error.code === 'invalid') {
          let cvvinvalidIT = convertI18nForJS('global.cvvinvalidIT') // 安全码不完整
          element.innerHTML = cvvinvalidIT
        }
      }
    }
    // de-DE
    if (vm.lang === 'de-DE') {
      if (type === 'cardNumber') {
        if (error.code === 'required') {
          let requiredDE = convertI18nForJS('global.requiredDE') //卡号必填
          element.innerHTML = requiredDE
        }
        if (error.code === 'invalid') {
          let invalidDE = convertI18nForJS('global.invalidDE') //卡号无效
          element.innerHTML = invalidDE
        }
      }
      if (type === 'expiry') {
        if (error.code === 'expired') {
          let expiredExpirationDE = convertI18nForJS('global.expiredExpirationDE') //有效期不得过期 全用
          element.innerHTML = expiredExpirationDE
        }
        if (error.code === 'required') {
          let requiredExpirationDE = convertI18nForJS('global.requiredExpirationDE') //有效期必填 全用
          element.innerHTML = requiredExpirationDE
        }
        if (error.code === 'invalid') {
          let invalidExpirationDE = convertI18nForJS('global.invalidExpirationDE') //有效期不完整 全用
          element.innerHTML = invalidExpirationDE
        }
      }
      if (type === 'cvc') {
        if (error.code === 'required') {
          let cvvrequiredDE = convertI18nForJS('global.cvvrequiredDE') // 安全码必填
          element.innerHTML = cvvrequiredDE
        }
        if (error.code === 'invalid') {
          let cvvinvalidDE = convertI18nForJS('global.cvvinvalidDE') // 安全码不完整
          element.innerHTML = cvvinvalidDE
        }
      }
    }
  }
}
// STEP #6a: Add a button handler to trigger the payment request
const triggerConfirm = async e => {
  let _vm = vm
  const cardNumElement = getElement('cardNumber')
  if (vm.payString === 'global.button.confirmBinding') {
    // 绑卡逻辑
    createPaymentConsent({
      element: cardNumElement, // Only need to submit CardNumber element
      // intent_id: vm.intent_id,
      customer_id: vm.customerId,
      client_secret: vm.client_secret,
      currency: vm.currencyAir,
      next_triggered_by: 'merchant'
    })
      // STEP #6b: Listen to the request response
      .then(response => {
        /**
         * ... Handle event on success
         */
        // window.alert(`Confirm success with ${JSON.stringify(response)}`)
        vm.$emit('airwallexaddCard', response.payment_consent_id)
      })
      // STEP #6c: Listen to errors
      .catch(error => {
        /**
         * ... Handle event on error
         */
        document.getElementById('error').style.display = 'block' // Example: show error block
        document.getElementById('error').innerHTML = error.message // Example: set error message
        
      })
  } else if (vm.payString === 'global.button.pay') {
    confirmPaymentIntent({
      element: cardNumElement, // Only need to submit CardNumber element
      id: vm.intent_id,
      client_secret: vm.client_secret,
      // Add other payment confirmation details, see docs here: https://github.com/airwallex/airwallex-payment-demo/tree/master/docs
      payment_method_options: {
        card: {
          auto_capture: true
        }
      }
    })
      // STEP #6b: Listen to the request response
      .then(response => {
        /**
         * ... Handle event on success
         */
        // window.alert(`Confirm success with ${JSON.stringify(response)}`)
        _vm.fullscreenLoading = true
        if (response.status === 'SUCCEEDED') {
          vm.currency = response.currency
          vm.paymentIntentId = response.id
          // 线上充值
          if (vm.RechargeType === 'OnlineRecharge') {
            _vm.masterPaymentConfirm()
          }
          // 在线支付
          if (vm.RechargeType === 'OnlinePayment') {
            _vm.masterCard()
          }
        }
      })
      // STEP #6c: Listen to errors
      .catch(error => {
        /**
         * ... Handle event on error
         */
        document.getElementById('error').style.display = 'block' // Example: show error block
        document.getElementById('error').innerHTML = error.message // Example: set error message
          // 线上充值
          if (vm.RechargeType === 'OnlineRecharge') {
            _vm.masterPaymentConfirmError()
          }
          // 在线支付
          if (vm.RechargeType === 'OnlinePayment') {
            _vm.masterCardError()
          }
        
      })
  }
  //判断点击支付按钮关闭弹框
  if (e === 1) {
    vm.outerVisible()
  }
}

import { mapGetters } from 'vuex'
export default {
  props: {
    client_secret: {
      type: String,
      default: client_secret
    },
    intent_id: {
      type: String,
      default: intent_id
    },
    payString: {
      type: String,
      default: ''
    },
    customerId: {
      type: String,
      default: ''
    },
    currencyAir: {
      type: String,
      default: ''
    },
    // 充值类型
    RechargeType: {
      type: String,
      default: ''
    },
    //线上充值-卡失败-需要的币种
    currencyError:{
      type: String,
      default: ''
    }
  },
  name: 'CardEle',
  data() {
    return {
      triggerConfirm,
      disabled: true,
      currency: '',
      paymentIntentId: '',
      fullscreenLoading: false
    }
  },
  computed: {
    ...mapGetters(['lang'])
  },
  created() {
    vm = this
  },
  mounted() {
    init()
    window.addEventListener('onReady', onReady)
    window.addEventListener('onChange', onChange)
    window.addEventListener('onError', onError)
    window.addEventListener('onFocus', onFocus)
    window.addEventListener('onBlur', onBlur)
  },
  methods: {
    outerVisible() {
      this.$emit('outerVisibleChange', false)
    },
    // 线上充值-第三方支付校验完成后的回调接口
    masterPaymentConfirm() {
      this.fullscreenLoading = true
      let http = this.$root.API.MASTER_PAY_MENT_CONFIRM
      let params = {
        currency: this.currency,
        paymentIntentId: this.paymentIntentId
      }
      this.$mergePost(http, params).then(res => {
        if (res.success) {
          if (res.result) {
            this.$router.push({
              path: '/myWallet/OnlineVISAMaster'
            })
            this.fullscreenLoading = false
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 失败状态-在线支付
    masterPaymentConfirmError() {
      this.fullscreenLoading = true
      let http = this.$root.API.MASTER_PAY_MENT_CONFIRM
      let params = {
        currency: this.currencyError,
        paymentIntentId: this.intent_id
      }
      this.$mergePost(http, params).then(res => {
        if (res.success&& !res.result) {
          this.$router.push({
              path: '/myWallet/CashWallet',
              query: {
                code: res.result,
                message: res.message
              }
            })
            this.fullscreenLoading = false
          
        }
      })
    },
    // 在线支付-第三方支付校验完成后的回调接口
    masterCard() {
      this.fullscreenLoading = true
      let http = this.$root.API.MASTER_CARD_SUCCESS
      let params = {
        currency: this.currency,
        paymentIntentId: this.paymentIntentId
      }
      this.$mergePost(http, params).then(res => {
        if (res.success) {
          if (res.result) {
            this.$router.push({
              path: '/myWallet/OnlineVISAMaster'
            })
            this.fullscreenLoading = false
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 失败状态-在线支付
    masterCardError() {
      this.fullscreenLoading = true
      let http = this.$root.API.MASTER_CARD_SUCCESS
      let params = {
        currency: this.currencyError,
        paymentIntentId: this.intent_id
      }
      this.$mergePost(http, params).then(res => {
        if (res.success&& !res.result) {
          this.$router.push({
              path: '/myWallet/PayBillsAccount',
              query: {
                code: res.result,
                message: res.message
              }
            })
            this.fullscreenLoading = false
          
        }
      })
    }
  },
  beforeDestroy() {
    // Be sure to clean up event listeners when component unmounts
    window.removeEventListener('onReady', onReady)
    window.removeEventListener('onChange', onChange)
    window.removeEventListener('onError', onError)
    window.removeEventListener('onFocus', onFocus)
    window.removeEventListener('onBlur', onBlur)
  }
}
</script>

<style lang="less">
.field-container {
  margin: 25px auto;
  width: 500px;
}
.field {
  width: 500px;
  margin: 0 auto;
  margin-bottom: 80px;
  display: flex;
  justify-content: space-between;
  .field-label {
    width: 200px;
    font-size: 13px;
    text-align: left;
  }
}
.span {
  font-size: 10px;
  color: #c0c0c0;
}
#cvc-error,
#expiry-error,
#cardNumber-error {
  text-align: left;
}

/* Custom styling for the inputs */
#cardNumber,
#cvc,
#expiry {
  border: 1px solid;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 8px;
  height: 35px;
}
</style>
