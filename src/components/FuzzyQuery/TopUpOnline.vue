<template>
  <div class="full-page online">
    <div class="subTitle">{{ $t('account.label.topUpOnline') }}</div>
    <el-form :model="rechargeOnline" ref="onlineForm" :rules="formRules" label-width="80px" label-position="top">
      <!-- 选择钱包-->
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('account.label.currencyWallet')" prop="currencyWallet">
            <el-tooltip effect="dark" :content="$t('account.label.onLineTool')" placement="right" slot="label">
              <span>
                {{ $t('account.label.currencyWallet') }}
                <icon-fontSvg class="icon-answer" icon-class="answer"> </icon-fontSvg>
              </span>
            </el-tooltip>
            <data-dictionary-selector
              @selectChange="walletChange"
              :url="this.$root.API.ACCOUNT_BALANCE_WALLET"
              v-model="rechargeOnline.currencyWallet"
              value-code="valueCode"
              value-name="valueName"
              @input="checkCalculate"
              :placeholder="this.$t('global.select')"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--      充值渠道-->
      <el-row>
        <el-form-item :label="$t('account.label.rechargePlatform')" prop="rechargePlatform">
          <my-checkbox
            @clear="clear"
            :valueKey="'rechargePlatform'"
            :url="url"
            :showResult="showResult"
            v-model="rechargeOnline.rechargePlatform"
          ></my-checkbox>
        </el-form-item>
      </el-row>

      <h4 v-if="getKey('Payoneer')">{{ $t('account.label.useOneer') }}</h4>
      <h4 v-if="getKey('PayPal')">{{ $t('account.label.usePal') }}</h4>
      <br />
      <!--   payoneer选择付款币种   充值币种-->
      <el-row v-if="getKey('Payoneer')">
        <el-col :span="24" v-loading="loading">
          <el-form-item :label="$t('account.label.selectPayCurrency')" prop="currency">
            <el-button v-if="oauthStatus === 0" type="primary" @click="AuthorizeFn">
              {{ $t('account.label.AuthorizeBtn') }}</el-button
            >
            <el-radio-group v-if="oauthStatus === 1 && accountBalances.length > 0" v-model="rechargeOnline.currency">
              <el-radio
                @change="checkCalculate(item, 'Payoneer')"
                v-for="(item, index) in accountBalances"
                :label="item.currency"
                :key="index"
                >{{ item.availableBalance | formatNumber({ decimals: 2 }) }} {{ item.currency }}</el-radio
              >
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
          <el-form-item :label="$t('account.label.currency')" prop="currency">
            <data-dictionary-selector
              :url="
                $root.API.WALLET_WALLET_CURRENCY +
                  '?dictionaryCode=PAYPAL_CURRENCY&&valueCode=' +
                  rechargeOnline.currencyWallet +
                  '&&language=' +
                  this.lang
              "
              v-model="rechargeOnline.currency"
              :placeholder="$t('global.select')"
              @input="checkCalculate"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--  充值金额-->
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('account.label.amount')" prop="amount">
            <el-input size="small" v-model="rechargeOnline.amount" @input="checkCalculate"> </el-input>
            <span v-if="getKey('Payonner')">{{ rechargeOnline.currencyWallet }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  汇率-->
      <el-row v-if="!getKey('VISA/MasterCard')">
        <el-form-item v-if="showFee" style="color: #ccc">
          <el-row>
            <el-col :span="6">
              <!-- 操作费 -->
              <span>{{ $t('account.label.totalServiceCharge') }}</span
              ><span style="margin-left: 5px">
                {{
                  $bigDecimal(rechargeOnline.commissionCharge)
                    .plus(rechargeOnline.rechargeFeeSwap)
                    .toFixed(2) | formatNumber({ decimals: 2 })
                }}
                {{ rechargeOnline.currency }}
              </span>
            </el-col>
          </el-row>
          <el-row v-if="getKey('Payoneer')">
            <span>
              {{ $t('account.label.payoneerFeeDescription') }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>
      <!-- 手续费   -->
      <el-row v-if="getKey('VISA/MasterCard')">
        <el-form-item label="手续费" prop="input1">
          <el-row :gutter="8">
            <el-col :span="8">
              <div class="wallet_input_amount">
                {{ rechargeOnline.VISAcommissionCharge }}
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!-- 汇率 -->
      <el-row v-if="!getKey('VISA/MasterCard')">
        <el-form-item :label="$t('account.label.exchangeRate')" prop="exchangeRate">
          <el-tooltip effect="dark" :content="amountTips" placement="right" slot="label">
            <span>
              {{ $t('account.label.exchangeRate') }} &nbsp
              <icon-fontSvg icon-class="answer" class="icon-answer"></icon-fontSvg>
            </span>
          </el-tooltip>
          <el-row :gutter="10">
            <el-col :span="3">
              <div class="wallet_input_amount">
                {{ rechargeOnline.balanceRechargeAmount | formatNumber({ decimals: 2 }) }}
              </div>
            </el-col>
            <el-col :span="1">
              {{ rechargeOnline.currency }}
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="1" style="text-align: center">
             <i class="el-icon-back"></i><i class="el-icon-right"></i>
            </el-col>
            <el-col :span="3">
              <div class="wallet_input_amount">{{ rechargeOnline.balanceAmount | formatNumber({ decimals: 2 }) }}</div>
            </el-col>
            <el-col :span="1">
              {{ rechargeOnline.currencyWallet }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-show="changeRate">
              <span>1{{ rechargeOnline.currencyWallet }}=</span>
              <span>{{ rechargeOnline.rechargeRate }} {{ rechargeOnline.currency }}</span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!-- 净入账金额 -->
      <el-row v-if="!getKey('VISA/MasterCard')">
        <el-form-item :label="$t('account.label.balanceRechargeAmount')" prop="input1">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="wallet_input_amount">
                {{ rechargeOnline.balanceRechargeAmount | formatNumber({ decimals: 2 }) }}
              </div>
            </el-col>
            <el-col :span="1">
              {{ rechargeOnline.currency }}
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!-- 净入账金额    -->
      <el-row v-if="getKey('VISA/MasterCard')">
        <el-form-item :label="$t('account.label.balanceRechargeAmount')" prop="input1">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="wallet_input_amount">
                {{ rechargeOnline.balanceRechargeAmount }}
              </div>
            </el-col>
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
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="width: 40%;margin: 0 auto">
      <el-button
        v-if="!getKey('VISA/MasterCard')"
        v-loading="confirm_loading"
        size="small"
        type="primary"
        @click="recharge"
        :disabled="disConfirm"
        >{{ $t('account.label.confirm') }}</el-button
      >
      <!-- 输入卡信息-->
      <el-button v-if="getKey('VISA/MasterCard')" size="small" type="primary" @click="information">
        {{ $t('global.button.InputCardInformation') }}
      </el-button>
      <el-button size="small" @click="clickClose">{{ $t('account.label.cancel') }}</el-button>
      <el-dialog 
      width="760px"  
      :title="$t('global.button.InputCardInformation')" 
      :close-on-click-modal="false" 
      :visible.sync="outerVisible">
        <div slot="footer" class="dialog-footer">
          <splitCard
            payString="global.button.pay"
            :client_secret="clientSecret"
            :intent_id="paymentIntentId"
            :RechargeType="RechargeType"
            :currencyError="currencyError"
            @outerVisibleChange="splitCardCancel"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { floatInputLimit } from '@/common/utils/commons'
// import { mapGetters } from 'vuex'
import myCheckbox from './my-checkbox'
import splitCard from './splitCard'
export default {
  name: 'TopUpOnline',
  components: {
    myCheckbox,
    splitCard
  },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('sellerAuth.validate.isMust')))
      } else {
        if (Number(value) > Number(this.currencySelected.availableBalance)) {
          //EF-6070 还款金额>payoneer余额时 提示 {币种}余额不足
          callback(new Error(this.rechargeOnline.currency + ' ' + this.$t('account.label.insufficientBalance')))
        } else {
          callback()
        }
      }
    }
    return {
      outerVisible: false,
      url: this.$root.API.RECHARGE_ONLINE_PLATFORMS,
      changeRate: false, //7
      amountTips: this.$t('account.label.topUpOnlineamountTips'),
      showFee: false, //5
      payDelivery: [],
      rechargeOnline: {
        currencyWallet: '',
        rechargePlatform: '',
        currency: '',
        amount: '',
        serviceCharge: '',
        rechargeRate: '',
        commissionCharge: '',
        rechargeFeeSwap: '',
        balanceRechargeAmount: '',
        balanceAmount: '',
        VISAcommissionCharge: ''
      },
      //线上充值
      formRules: {
        currencyWallet: [{ required: true, message: this.$t('account.validate.isMust'), trigger: 'change' }],
        // 充值渠道
        rechargePlatform: [{ required: true, message: this.$t('account.validate.isMust'), trigger: 'change' }],
        currency: [{ required: true, message: this.$t('account.validate.isMust'), trigger: 'change' }],
        amount: [
          { required: true, message: this.$t('account.validate.isMust'), trigger: 'blur' },
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      disConfirm: false,
      //payneer
      oauthStatus: '', //0未授权,1已授权
      accountBalances: [
        /* {"currency":"EUR","availableBalance": 200.01,"id":"4366181853177117", "status":"2", "type":"BALANCE"},
            {"currency":"GBP","availableBalance": 200.01,"id":"4366181892172443","status":"2","type":"BALANCE"},
            {"currency":"USD","availableBalance": 200.01,"id":"4366181853177118","status":"2","type":"BALANCE"}*/
      ],

      //暂存选中数据
      currencySelected: {},
      timeout: null,
      loading: true,
      confirm_loading: false, //confirm按钮 loading
      clientSecret: '',
      paymentIntentId: '',
      showResult: false, //显示结果
      RechargeType: '', //充值类型
      currencyError:'' //线上充值-卡失败-需要的币种
    }
  },
  computed: {
    // ...mapGetters(['lang'])
  },
  watch: {
    'rechargeOnline.amount': function(val) {
    //   this.rechargeOnline.amount = floatInputLimit(val, 2)
      //优化 切换币种时实时校验
      this.$refs.onlineForm.validateField('amount')
    },
    'rechargeOnline.balanceRechargeAmount': function(val) {
      if (typeof val === 'number' && val <= 0) {
        this.rechargeOnline.balanceRechargeAmount = '0.00'
      } else {
        this.disConfirm = false
      }
    }
  },
  mounted() {
    //获取payoneer账号余额
    this.getPayoneerBalance()
  },
  methods: {
    //关闭第三方支付弹窗
    splitCardCancel(val) {
      this.outerVisible = val
    },
    //取消授权
    cancelAuth() {
      this.$confirm(this.$t('account.label.cancelConfirm'), this.$t('account.label.MESSAGE'), {
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
    saveObj(data) {
      this.currencySelected = data
    },

    checkCalculate(data, type) {
      //选择钱包-是否展示充值渠道
      if (this.rechargeOnline.currencyWallet) {
        let urlesc = this.$root.API.SHOW_AIR_WALLEX
        this.$mergePost(urlesc, { currencyCode: this.rechargeOnline.currencyWallet })
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
      }
      //选择钱包输入金额-计算手续费
      if (this.rechargeOnline.amount) {
        let amountTemp =
          this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
        let urlesf = this.$root.API.RECHARGE_ONLINE_COMMISSION
        this.$mergePost(urlesf, { ...this.rechargeOnline, amount: amountTemp }).then(res => {
          if (res.success) {
            this.rechargeOnline.VISAcommissionCharge = res.result.commissionCharge
            this.timeout = setTimeout(async () => {
              await this.queryCharge()
            }, 300)
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }
      //充值渠道为payoneer 选择币种时 把对象暂存起来 金额置空
      if (type === 'Payoneer') {
        this.saveObj(data)
        this.rechargeOnline.amount = ''
      }
      clearTimeout(this.timeout)
      if (this.rechargeOnline.currency && this.rechargeOnline.amount && this.rechargeOnline.currencyWallet) {
        this.timeout = setTimeout(async () => {
          await this.queryCharge()
        }, 300)
      } else {
        this.showFee = false
        this.rechargeOnline.commissionCharge = ''
        this.rechargeOnline.rechargeFeeSwap = ''
        this.rechargeOnline.balanceRechargeAmount = ''
        this.rechargeOnline.balanceAmount = ''
      }

      if (this.rechargeOnline.currency && this.rechargeOnline.currencyWallet) {
        this.timeout = setTimeout(async () => {
          await this.queryRealRate()
          this.changeRate = true
        }, 300)
      } else {
        this.rechargeOnline.rechargeRate = ''
        this.changeRate = false
      }

      // if ( this.rechargeOnline.currencyWallet && this.rechargeOnline.currency) {
      //   this.queryRealRate()
      //   this.changeRate = true

      // } else {
      //   this.rechargeOnline.rechargeRate=''
      //   this.changeRate = false
      // }

      // if (this.rechargeOnline.currency && this.rechargeOnline.amount && this.rechargeOnline.currencyWallet){
      //   this.queryCharge() //5
      // } else {
      //   this.showFee = false;
      //   this.rechargeOnline.commissionCharge=''
      //   this.rechargeOnline.rechargeFeeSwap=''
      //   this.rechargeOnline.balanceRechargeAmount=''
      //   this.rechargeOnline.balanceAmount=''
      // }
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
      this.$mergeGet(this.$root.API.WALLET_GET_PAYONEER_BALANCE).then(data => {
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
    walletChange() {
      this.rechargeOnline.currency = ''
    },
    // 7币种 查询实时汇率
    queryRealRate() {
      this.rechargeOnline.sourceCurrency = this.rechargeOnline.currency
      this.rechargeOnline.targetCurrency = this.rechargeOnline.currencyWallet
      this.$mergePost(this.$root.API.RECHARGE_ONLINE_RATE, this.rechargeOnline).then(data => {
        if (data && data.success) {
          this.rechargeOnline.rechargeRate = data.result.buyingRate
        }
      })
    },
    //5Commission Charge充值手续费 SwapCharge 换汇手续费 Net to Your Account充值入账金额
    queryCharge() {
      let amountTemp = this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
      this.$mergePost(this.$root.API.RECHARGE_ONLINE_COMMISSION, { ...this.rechargeOnline, amount: amountTemp }).then(
        data => {
          if (data && data.success) {
            this.showFee = true
            this.rechargeOnline.commissionCharge = data.result.commissionCharge
            this.rechargeOnline.rechargeFeeSwap = data.result.swapCharge
            this.rechargeOnline.balanceRechargeAmount = data.result.balanceRechargeAmount
            this.rechargeOnline.balanceAmount = data.result.balanceAmount
          }
        }
      )
    },
    //确认充值
    recharge() {
      this.$refs.onlineForm.validate(valid => {
        if (valid) {
          if (this.rechargeOnline.balanceRechargeAmount <= 0) {
            this.$message({
              message: this.$t('account.validate.amountZero'),
              type: 'warning'
            })
            this.disConfirm = true
          } else {
            if (this.rechargeOnline.rechargePlatform) {
              this.confirm_loading = true
              //payoneer
              if (this.rechargeOnline.rechargePlatform === 'Payoneer') {
                this.rechargeOnline.balanceId = this.currencySelected.id
                this.rechargeOnline.availableBalance = this.currencySelected.availableBalance
                let amountTemp =
                  this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
                this.$mergePost(this.$root.API.RECHARGE_ONLINE_PAYONEER_CONFIRM, {
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
                        path: '/myWallet/CashWallet?message=' + result.message + '&code=' + result.code
                      })
                    }
                    this.confirm_loading = false
                  }
                })
              } else if (this.rechargeOnline.rechargePlatform === 'PayPal') {
                let amountTemp =
                  this.lang === 'de-DE' ? this.rechargeOnline.amount.replace(',', '.') : this.rechargeOnline.amount
                this.$mergePost(this.$root.API.RECHARGE_ONLINE_CONFIRM, {
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
            } else {
              this.$message.success({
                message: this.$t('account.tips.platForm'),
                showClose: true,
                type: 'error'
              })
            }
          }
        }
      })
    },
    // 输入卡信息按钮
    information() {
      this.$refs.onlineForm.validate(valid => {
        if (valid) {
          //输入卡信息接口
          if (this.rechargeOnline.rechargePlatform === 'VISA/MasterCard') {
            let urls = this.$root.API.MASTERCARD_CONFIRM
            this.$mergePostAndPut(urls, { ...this.rechargeOnline }).then(data => {
              if (data && data.success) {
                const { clientSecret, paymentIntentId } = data.result
                this.paymentIntentId = paymentIntentId
                this.clientSecret = clientSecret
                this.outerVisible = true
                this.currencyError = this.rechargeOnline.currencyWallet
                // 充值类型 - 线上充值
                this.RechargeType = 'OnlineRecharge'
              } else {
                this.$message({
                  message: data.message,
                  type: 'error'
                })
              }
            })
          }
        } else {
          this.$message.success({
            message: this.$t('account.tips.platForm'),
            showClose: true,
            type: 'error'
          })
        }
      })
    },

    clickClose() {
      this.rechargeOnline = {}
      this.$router.push({
        path: './CashWallet'
      })
    },
    clear() {
      this.rechargeOnline.currency = ''
      this.rechargeOnline.amount = ''
      this.checkCalculate()
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'account';
/deep/ .el-dialog__wrapper .el-dialog {
  min-width: auto;
}
</style>
