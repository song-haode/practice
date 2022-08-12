<template>
  <div class="full-page repayment">
    <div class="subTitle">{{ $t('account.label.paymentOnBills') }}</div>
    <div v-if="show">
      <TipsTool :tipsText="tipsText" class="module-tips"> </TipsTool>
    </div>
    <el-form :model="rechargeOnline" ref="onlineForm" :rules="formRules" label-width="80px" label-position="top">
      <!--充值渠道-->
      <el-row>
        <el-form-item :label="$t('account.label.paymentChannels')" prop="rechargePlatform">
          <my-checkbox
            @clear="clear"
            :valueKey="'rechargePlatform'"
            :url="url"
            :showResult="showResult"
            v-model="rechargeOnline.rechargePlatform"
          ></my-checkbox>
        </el-form-item>
      </el-row>

      <h4 v-if="getKey('Payoneer')">{{ $t('account.label.credit_useOneer') }}</h4>
      <h4 v-if="getKey('PayPal')">{{ $t('account.label.credit_usePal') }}</h4>
      <h4 v-if="getKey('VISA/MasterCard')">{{ '使用VISA/MasterCard支付' }}</h4>
      <br />

      <!--还款金额-->
      <el-row>
        <el-form-item :label="$t('account.label.pay_amount')" prop="amount">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input
                size="small"
                v-model="rechargeOnline.amount"
                @input="changeRadio(rechargeOnline.amount, rechargeOnline.rechargePlatform)"
              >
              </el-input>
            </el-col>
            <el-col :span="1">
              {{ rechargeOnline.currencyWallet }}
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!--充值币种-->
      <el-row v-if="getKey('Payoneer')">
        <el-col :span="10" v-loading="loading">
          <el-form-item :label="$t('account.label.selectPayCurrency')" prop="currency">
            <el-button v-if="oauthStatus === 0" type="primary" @click="AuthorizeFn">
              {{ $t('account.label.AuthorizeBtn') }}</el-button
            >
            <el-radio-group v-if="oauthStatus === 1 && accountBalances.length > 0" v-model="rechargeOnline.currency">
              <el-radio
                @change="changeRadio(item, 'Payoneer')"
                v-for="(item, index) in accountBalances"
                :label="item.currency"
                :key="index"
              >
                {{ item.availableBalance | formatNumber({ decimals: 2 }) }} {{ item.currency }}
              </el-radio>
            </el-radio-group>
            <span v-if="oauthStatus === 1 && accountBalances.length === 0">{{ $t('account.label.nonResult') }}</span>
            <a v-if="oauthStatus === 1" class="cancelAuth" @click="cancelAuth">{{
              $t('account.label.cancelAuthorizeBtn')
            }}</a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="getKey('PayPal')">
        <el-col :span="8">
          <el-form-item :label="$t('account.label.pay_currency')" prop="currency">
            <data-dictionary-selector
              v-model="rechargeOnline.currency"
              :url="
                $root.API.WALLET_WALLET_CURRENCY +
                  '?dictionaryCode=REFUND&&valueCode=' +
                  rechargeOnline.currencyWallet +
                  '&&language=' +
                  this.lang
              "
              :placeholder="$t('global.select')"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 手续费   -->
      <el-row v-if="getKey('VISA/MasterCard')">
        <el-form-item label="手续费" prop="input1">
          <el-row :gutter="8">
            <el-col :span="8">
              <div class="wallet_input_amount">
                {{ rechargeOnline.commissionCharge }}
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!--操作费-->
      <el-row v-if="!getKey('VISA/MasterCard')">
        <el-form-item v-if="showFee" style="color: #ccc">
          <el-row>
            <span>{{ $t('account.label.totalServiceCharge') }}</span
            ><span style="margin-left: 5px">
              {{ rechargeOnline.totalServiceCharge | formatNumber({ decimals: 2 }) }}
              {{ rechargeOnline.currency }}</span
            >
          </el-row>
          <el-row v-if="getKey('Payoneer')">
            <span>
              {{ $t('account.label.credit_payoneerFeeDescription') }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>
      <!--应还金额-->
      <el-row>
        <el-form-item :label="$t('account.label.toPay')" prop="exchangeRate">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="wallet_input_amount">
                {{ rechargeOnline.actualRepaymentAmount | formatNumber({ decimals: 2 }) }}
              </div>
            </el-col>
            <el-col :span="1">
              {{ rechargeOnline.currency }}
            </el-col>
            <!--  <el-col :span="8" v-show="changeRate">
            <span>1{{rechargeOnline.currency}}=</span>
              <span>{{rechargeOnline.rechargeRate}}{{rechargeOnline.currencyWallet}}</span>
            </el-col>-->
          </el-row>
        </el-form-item>
      </el-row>
      <!--备注-->
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('account.label.remarks')" prop="input1">
            <el-input
              :placeholder="$t('account.validate.pleaseInput')"
              v-model="rechargeOnline.remark"
              type="textarea"
              :rows="2"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="width: 40%;margin: 0 auto">
      <el-button v-if="!getKey('VISA/MasterCard')" v-loading="confirm_loading" type="primary" @click="recharge">{{
        $t('account.label.confirm')
      }}</el-button>
      <!-- 输入卡信息-->
      <el-button v-if="getKey('VISA/MasterCard')" size="small" type="primary" @click="information">
        {{ $t('global.button.InputCardInformation') }}
      </el-button>
      <el-button @click="clickClose">{{ $t('account.label.cancel') }}</el-button>
    </div>
    <el-dialog :title="$t('global.button.InputCardInformation')" width="760px" :visible.sync="outerVisible">
      <div slot="footer" class="dialog-footer">
        <splitCard
          payString="global.button.pay"
          :client_secret="clientSecret"
          :intent_id="paymentIntentId"
          :RechargeType="RechargeType"
          :currencyError="currencyWalletError"
          @outerVisibleChange="splitCardCancel"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { floatInputLimit } from '@/common/utils/commons'
import { mapGetters } from 'vuex'
import TipsTool from './yellow-tips-tool'
import { parseTime } from '@/common/utils'
import myCheckbox from './components/my-checkbox'
import splitCard from './components/splitCard'
export default {
  name: 'Repayment',
  components: {
    TipsTool,
    myCheckbox,
    splitCard
  },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('sellerAuth.validate.isMust')))
      } else {
        if (Number(value) > Number(this.$route.query.totalRemanentAmount)) {
          callback(new Error(this.$t('account.label.rangeAmoount')))
        } else {
          callback()
        }
      }
    }
    return {
      url: this.$root.API.RECHARGE_ONLINE_PLATFORMS,
      showFee: false, //5
      rechargeOnline: {
        rechargePlatform: '',
        currency: '',
        currencyWallet: this.$route.query.repaymentCurrency,
        amount: '',
        billNo: this.$route.query.billNo,
        totalServiceCharge: '', // 操作费
        commissionCharge: '', //手续费
        actualRepaymentAmount: '' //应还金额
      },
      //授信还款
      formRules: {
        // 充值渠道
        rechargePlatform: [{ required: true, message: this.$t('account.validate.isMust'), trigger: 'change' }],
        currency: [{ required: true, message: this.$t('account.validate.isMust'), trigger: 'change' }],
        amount: [
          { required: true, message: this.$t('account.validate.isMust'), trigger: 'blur' },
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      show: false,
      tipDate: '',
      tipsText: '',

      //payneer
      //payneer
      oauthStatus: '', //0未授权,1已授权
      accountBalances: [],
      //暂存选中数据
      currencySelected: {},
      loading: true,
      confirm_loading: false, //confirm按钮 loading
      clientSecret: '',
      paymentIntentId: '',
      outerVisible: false,
      showResult: null, //授权结果
      RechargeType: '', //充值类型
      currencyWalletError:'',
    }
  },
  watch: {
    'rechargeOnline.currency': function(val) {
      if (val && this.rechargeOnline.amount) {
        this.queryCommission()
      }
    },
    'rechargeOnline.amount': function(val) {
      this.rechargeOnline.amount = floatInputLimit(val, 2)
      if (this.rechargeOnline.currency && this.rechargeOnline.amount) {
        this.queryCommission()
      } else {
        this.resetCommission()
      }
    }
  },
  mounted() {
    let amount = this.$route.query.totalRemanentAmount + ''
    this.rechargeOnline.amount = this.lang === 'de-DE' ? amount.replace('.', ',') : amount
    this.handleEdit()
    //获取payoneer账号余额
    this.getPayoneerBalance()
    
    this.selectWallet()
  },
  computed: {
    ...mapGetters(['lang'])
  },
  methods: {
     // 选择钱包-是否展示充值渠道
    selectWallet(){
      let urls = this.$root.API.SHOW_AIRWALLEX_REPAYMENT
      this.$mergePost(urls, { currencyCode: this.$route.query.repaymentCurrency })
        .then(res => {
          if (res.success) {
            this.showResult = res.result
            
          }
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    },
    //关闭第三方支付弹窗
    splitCardCancel(val) {
      this.outerVisible = val
    },
    //取消授权
    cancelAuth() {
      this.$confirm('取消授权', this.$t('account.label.MESSAGE'), {
        confirmButtonText: this.$t('account.label.confirm'),
        cancelButtonText: this.$t('account.label.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          this.$mergePost(this.$root.API.WALLET_CANCEL_REDIRECT).then(data => {
            if (data && data.success) {
              this.getPayoneerBalance()
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
              this.loading = false
            }
          })
        })
        .catch(() => {})
    },
    changeRadio(data, type) {
      //充值渠道为payoneer 选择币种时 把对象暂存起来 金额置空
      if (type === 'Payoneer') {
        this.currencySelected = data
      }

      // 手续费
      if (this.rechargeOnline.amount) {
        let amountTemp =
          this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
        this.rechargeOnline.currency = this.$route.query.repaymentCurrency
        let urlesf = this.$root.API.RECHARGE_REPAYMENT_COMMISSION
        this.$mergePost(urlesf, { ...this.rechargeOnline, amount: amountTemp }).then(res => {
          if (res.success) {
            this.rechargeOnline.commissionCharge = res.result.commissionCharge
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }
    },
    //授权
    AuthorizeFn() {
      //state 1现金钱包 2授信手动还款  3 启动自动还款
      this.$mergeGet(this.$root.API.WALLET_GET_REDIRECT + '?state=MANUAL').then(data => {
        if (data && data.result) {
          window.open(data.result)
        }
      })
      // window.open('https://login.sandbox.payoneer.com/api/v2/oauth2/authorize?client_id=y8616ek2gUhYKDiqS7dnTOrHAEjsh2AK&redirect_uri=https://testapi.orangeconnex.com/gemini-inner-face/payoneerRedirect&scope=read%20write%20openid%20personal-details&response_type=code')
      this.$confirm(this.$t('account.label.SysAuth'), this.$t('global.sysHint'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('account.label.authYes'),
        cancelButtonText: this.$t('account.label.authNo')
      })
        .then(() => {
          this.loading = true
          this.getPayoneerBalance()
        })
        .catch()
    },
    // 获取账号余额
    getPayoneerBalance() {
      this.$mergeGet(
        this.$root.API.WALLET_GET_PAYONEER_BALANCE + '?currency=' + this.$route.query.repaymentCurrency
      ).then(data => {
        if (data && data.result) {
          this.oauthStatus = data.result.oauthStatus
          this.accountBalances = data.result.accountBalances
          this.loading = false
        }
      })
    },
    getKey(val) {
      return [val].includes(this.rechargeOnline.rechargePlatform)
    },
    switchDate(shijianchuo, lang) {
      if (lang === 'en-US') {
        // eslint-disable-next-line one-var
        let monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'Decemeber'
          ],
          now = new Date(shijianchuo)
        return monthNames[now.getMonth()] + '.' + now.getDate() + ', ' + now.getFullYear()
      }
      if (lang === 'de-DE') {
        // eslint-disable-next-line one-var
        let monthNames = [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember'
          ],
          now = new Date(shijianchuo)
        return monthNames[now.getMonth()] + '.' + now.getDate() + ', ' + now.getFullYear()
      }
      if (lang === 'zh-CN') {
        return parseTime(shijianchuo, '{y}-{m}-{d}')
      }
    },
    handleEdit() {
      this.$mergeGet(this.$root.API.OFFLINE_REPAYMENT_LATEST)
        .then(data => {
          if (data && data.result) {
            //未有记录
            if (data.result.applyTimes.length === 0) {
              this.show = false
            } else {
              this.show = true //已经
              let temp = data.result.applyTimes
              //回显提示日期
              temp.forEach(item => {
                this.tipDate += this.switchDate(item, this.lang) + ', '
              })

              if (data.result.applyTimes.length === 1) {
                this.tipsText =
                  this.$t('account.transfer.applyTimes1') + ' ' + this.tipDate + this.$t('account.transfer.applyTimes3')
              } else {
                this.tipsText =
                  this.$t('account.transfer.applyTimes2') + ' ' + this.tipDate + this.$t('account.transfer.applyTimes4')
              }
            }
          }
        })
        .catch(error => {
          console.error(error)
        })
    },

    //6充值金额 查询实时手续费
    queryCommission() {
      let amountTemp = this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
      this.$mergePost(this.$root.API.RECHARGE_REPAYMENT_COMMISSION, {
        ...this.rechargeOnline,
        amount: amountTemp
      }).then(data => {
        if (data && data.result) {
          this.showFee = true
          this.commissionCharge = data.result.commissionCharge
          this.rechargeOnline.totalServiceCharge = data.result.totalServiceCharge
          this.rechargeOnline.actualRepaymentAmount = data.result.actualRepaymentAmount
        }
      })
    },
    resetCommission() {
      this.showFee = false
      this.rechargeOnline.totalServiceCharge = ''
      this.rechargeOnline.actualRepaymentAmount = ''
    },
    //输入卡信息按钮
    information() {
      //第三方支付
      this.$refs.onlineForm.validate(valid => {
        if (valid) {
          let amountTemp =
            this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
          let HTTPS = this.$root.API.MASTER_CARD_CONFIRM
          this.$mergePost(HTTPS, { ...this.rechargeOnline, amount: amountTemp }).then(data => {
            if (data.success) {
              const { clientSecret, paymentIntentId } = data.result
              this.paymentIntentId = paymentIntentId
              this.clientSecret = clientSecret
              this.outerVisible = true
              this.currencyWalletError = this.$route.query.repaymentCurrency
              // 充值类型 - 在线支付
              this.RechargeType = 'OnlinePayment'
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
            }
          })
        } else {
          this.$message.success({
            message: this.$t('account.tips.platForm'),
            showClose: true,
            type: 'error'
          })
        }
      })
    },
    //确认充值
    recharge() {
      this.$refs.onlineForm.validate(valid => {
        if (valid) {
          this.confirm_loading = true
          if (this.rechargeOnline.rechargePlatform === 'Payoneer') {
            let amountTemp =
              this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
            if (Number(this.currencySelected.availableBalance) > Number(amountTemp)) {
              this.rechargeOnline.balanceId = this.currencySelected.id
              this.rechargeOnline.availableBalance = this.currencySelected.availableBalance
              this.$mergePost(this.$root.API.RECHARGE_PAYONEER_COMFIRM, {
                ...this.rechargeOnline,
                amount: amountTemp
              }).then(data => {
                if (data && data.success) {
                  let result = data.result
                  if (result.code === 403) {
                    window.location.href = result.url
                  } else {
                    //code===0 失败
                    this.$router.push({
                      path: '/myWallet/PayBillsAccount?message=' + result.message + '&code=' + result.code
                    })
                  }
                  this.confirm_loading = false
                }
              })
            } else {
              //提示余额不足
              this.$message.error(this.$t('account.label.insufficientBalance'))
            }
          }
          if (this.rechargeOnline.rechargePlatform === 'PayPal') {
            let amountTemp =
              this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
            this.$mergePost(this.$root.API.RECHARGE_REPAYMENT_COMFIRM, {
              ...this.rechargeOnline,
              amount: amountTemp
            }).then(data => {
              if (data && data.success) {
                let url = data.result
                window.location.href = url
                this.confirm_loading = false
              }
            })
          }
        }
      })
    },

    clickClose() {
      this.rechargeOnline = {}
      this.$router.push({
        path: './PayBillsAccount'
      })
    },
    clear() {
      this.rechargeOnline.currency = ''
      this.resetCommission()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'account';
</style>
