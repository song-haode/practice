<template>
  <div>
    <div
      :style="{ width: width + 'px' }"
      class="basic-option"
      @click="selectPayType(index, data)"
      v-for="(data, index) in payDelivery"
      :key="index"
    >
      <!--线上充值-->
      <!--    {{index}} {{selectedChannel}}-->
      <img style="width: 100%;height: 100%;" :src="data.icon" />
      <span v-bind:class="{ selected: index === selectedChannel }">
        <i class="el-icon-check"> </i>
      </span>
    </div>
  </div>
</template>

<script>
//引用Lodash
import _ from 'lodash'
export default {
  name: 'my-checkbox',
  data() {
    return {
      payDelivery: [],
      payDelivery2: [],
      selectedChannel: 0,
      showResults: false
    }
  },
  props: {
    value: {
      default: '',
      type: String
    },
    width: {
      default: '150',
      type: String
    },
    url: {
      default: '',
      type: String
    },
    showResult: {
      default: false,
      type: Boolean
    },
    valueKey: {
      default: 'id',
      type: String
    }
  },
  watch: {
    showResult(newVal) {
      if (newVal) {
        this.payDelivery = _.cloneDeep(this.payDelivery2)
      } else {
        this.payDelivery.splice(2, 1)
      }
    },
  },
  // watch: {
  //   value: {
  //     handler(val) {
  //       this.selectedChannel = !val ? 0 : this.findIndexFn(val);
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  // computed:{
  //   selectedChannel:{
  //     get:function(){
  //       return this.selectedChannelTemp
  //     },
  //     set:function(val){
  //
  //     }
  //   }
  // },
  async mounted() {
    await this.loadRechargePlatforms()

    if (!this.value) {
      this.selectedChannel = 0
      //若用户 没有操作选择充值平台 给初始默认值
      this.$emit('input', this.payDelivery[0][this.valueKey])
    } else {
      this.selectedChannel = this.findIndexFn(this.value)
    }
  },
  methods: {
    findIndexFn(val) {
      return this.payDelivery.findIndex(item => {
        return item[this.valueKey] === val
      })
    },
    //选择充渠道
    selectPayType(index, data) {
      //已经选中的 再次点击 取消选中 恢复初始状态
      if (this.selectedChannel === index) {
        this.$emit('input', '')
        this.selectedChannel = -1
        return
      }
      this.$emit('input', data[this.valueKey])
      this.$emit('clear')
      this.selectedChannel = index
    },
    loadRechargePlatforms() {
      return new Promise((resolve, reject) => {
        this.$mergeGet(this.url)
          .then(data => {
            if (data && data.success) {
              let temp = data.result.map(item => {
                item.icon = require(`@/assets/images/${item[this.valueKey]}.jpg`) //icon 待修改
                return item
              })
              resolve(this.payDelivery)
              let temp2 = data.result.filter(item => {
                item.icon = require(`@/assets/images/${item[this.valueKey]}.jpg`)
                if (item.id !== '399250225069301762') {
                  return item
                }
              })
              this.payDelivery2 = temp
              this.payDelivery = temp2
              resolve(this.payDelivery)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.basic-option {
  display: inline-block;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
  margin-right: 20px;
  width: 150px;
  height: 50px;
  .selected {
    position: absolute;
    right: -17px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 1px 1px #ccc;
  }
  [class*=' el-icon-'],
  [class^='el-icon-'] {
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #fff;
    transform: rotate(-45deg);
  }
}
</style>
