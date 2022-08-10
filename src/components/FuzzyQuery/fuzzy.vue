<template>
  <div class="wrapper">
    <van-nav-bar title="党员组织关系转入" />
    <van-form @submit="onSubmit">
      <van-cell-group>
        <div class="label"><span class="require">*</span>转入党支部</div>
        <div class="van-search-wrapper">
          <van-search
            v-model="newParty"
            placeholder="请输入搜索关键词"
            @input="partySearch"
          />
          <ul class="van-search-list" v-if="showNewPartyList">
            <li
              class="van-search-item"
              v-for="item in newPartyList"
              :key="item.orgId"
              @click="selectNewParty(item)"
              v-html="item.orgFullName"
            ></li>
          </ul>
        </div>

        <div class="label"><span class="require">*</span>介绍信</div>
        <van-uploader>
          <div class="upload-box"><i class="icon-upload"></i>上传文件</div>
        </van-uploader>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="danger" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newParty: '',
      newPartyList: [],
      showNewPartyList: false,
    }
  },
  methods: {
    debounce(fn, delay) {
      let t = null
      return function () {
        if (t !== null) {
          clearTimeout(t)
        }
        t = setTimeout(() => {
          fn()
        }, delay)
      }
    },
    partySearch() {
      this.debounce(this.newPartySearch(), 1000)
    },
    async newPartySearch() {
      // 防抖操作
      let { data } = await this.$http.get(
        '/party/h5/transfer/in/getPartyOrgData',
        {
          params: {
            orgFullName: this.newParty,
          },
        }
      )
      if (data.code === 200) {
        this.newPartyList = data.data
        if (this.newPartyList && this.newPartyList.length > 0) {
          this.showNewPartyList = true
          // 高亮搜索词
          this.newPartyList.map((item) => {
            item.orgFullName = this.brightKeyword(item.orgFullName)
          })
        } else {
          this.showNewPartyList = false
        }
      }
    },
    brightKeyword(val) {
      const keyword = this.newParty
      if (val.indexOf(keyword) > -1) {
        // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
        return val.replace(keyword, `<span class="red">${keyword}</span>`)
      } else {
        return val
      }
    },
    deleteBrightKeyword(val) {
      const keyword = this.newParty
      if (val.indexOf(keyword) > -1) {
        // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
        return val.replace(`<span class="red">${keyword}</span>`, keyword)
      } else {
        return val
      }
    },
    selectNewParty(item) {
      this.newParty = this.deleteBrightKeyword(item.orgFullName)
      this.showNewPartyList = false
    },
    onSubmit(values) {
      console.log('submit', values)
    },
  },
}
</script>

<style lang="scss">
.label {
  line-height: 0.8rem;
  color: #646566;
  font-size: 14px;
  padding: 0 0.3rem;
  .require {
    color: #f00;
    margin-right: 0.12rem;
  }
}
.upload-box {
  width: 6.86rem;
  height: 0.9rem;
  border: 1px dashed #f0443c;
  margin-left: 0.3rem;
  border-radius: 0.1rem;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon-upload {
    display: inline-block;
    width: 0.26rem;
    height: 0.26rem;
    background: url(../assets/img/icon-upload.png) no-repeat left top;
    background-size: 100% 100%;
    margin-right: 0.16rem;
  }
}
.red {
  color: #da2a2a;
}
</style>
