<!--
@author Dy
@createDate 2017/9/11 15:40
@description 数据通用表格
-->
<template>
  <div class="generalGrid">
    <div>
      <el-table
        style="border-top: 1px solid #ebeef5;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5"
        v-loading.body="loading"
        :element-loading-text="$t('global.table.loadingText')"
        ref="currentGrid"
        :height="height"
        width="100%"
        :data="list"
        :border="border"
        fit
        :stripe="stripe"
        highlight-current-row
        :show-summary="isSummary"
        :summary-method="summaryMethod"
        empty-text=" "
        @selection-change="handleSelectionChange"
        @row-click="rowChecked"
        @cell-click="handleCellClick"
        @cell-dblclick="editable"
        @row-dblclick="handleRowHandle"
      >
        <el-table-column type="selection" v-if="showCheckBox" min-width="35" width="35" fixed />
        <el-table-column type="index" :label="$t('global.table.index')" v-if="showIndex" min-width="65" width="65">
          <template slot-scope="scope">
            {{ scope.$index + addIndex }}
          </template>
        </el-table-column>
        <el-table-column type="expand" v-if="isSupportExpand">
          <template slot-scope="props">
            <component :is="renderComponent" :dataModel="props.row" ref="expandComponent" />
          </template>
        </el-table-column>
        <template v-for="column in columnInit">
          <el-table-column
            v-if="column.type === 'html5' || column.type === 'img' || column.type === 'a-link'"
            show-overflow-tooltip
            resizable
            :prop="column.key"
            :label="column.title"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align"
            :sortable="column.sortable"
            :formatter="column.render"
            :sort-method="column.sortMethod"
            :key="column.key"
          >
            <template slot-scope="scope">
              <div v-if="column.type === 'html5'">
                <span v-if="column.render" v-html="scope.column.formatter(scope.row, scope.column)" />
              </div>
              <div v-else-if="column.type === 'img'">
                <img :src="scope.row[column.key]" style="width: 60px;height: 60px;" />
              </div>
              <div v-if="column.type === 'a-link'">
                <span
                  v-if="column.render"
                  v-html="scope.column.formatter(scope.row, scope.column)"
                  v-trh-click="scope"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="column.type === 'btn-opr' && column.groups"
            show-overflow-tooltip
            resizable
            :prop="column.key"
            :label="column.title"
            :width="column.width"
            :min-width="column.minWidth"
            :sortable="column.sortable"
            :formatter="column.render"
            :fixed="column.fixed"
            :key="column.key"
            :header-align="column.headerAlign"
          >
            <template slot-scope="scope">
              <el-button
                v-for="btn in column.groups"
                :key="btn.id"
                type="text"
                primary
                :icon="btn.icon"
                size="small"
                v-if="btnHide(scope.row, btn.btnHideFun)"
                @click="rowButtonClick(btn.id, scope.row, scope.$index)"
              >
                <span style="color: #2e6da4;text-decoration:underline;margin-right:10px;cursor:pointer;">
                  {{ btn.conditionText ? btn.conditionText(scope.row) : btn.text }}
                </span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="column.type === 'template'"
            show-overflow-tooltip
            resizable
            :prop="column.key"
            :label="column.title"
            :width="column.width"
            :min-width="column.minWidth"
            :sortable="column.sortable"
            :formatter="column.render"
            :key="column.key"
          >
            <template slot-scope="scope">
              <component
                :is="renderTemplate(column.templateUrl)"
                :dataModel="scope.row"
                :column="column"
                ref="renderTemplateRef"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="column.type !== 'hide'"
            show-overflow-tooltip
            resizable
            :prop="column.key"
            :label="column.title"
            :fixed="column.fix"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align"
            :sortable="column.sortable"
            :formatter="column.render"
            :sort-method="column.sortMethod"
            :key="column.key"
          >
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="pagination-tool" align="left" v-if="showPaging">
      <div class="row">
        <div class="col-lg-8">
          <Pagination
            v-if="showPaging"
            @pageChange="handlerCurrentPage"
            @sizeChange="handlerPageSize"
            :page="{
              currentPage: page,
              recordsTotal: total,
              pageSize: limit
            }"
            :small="true"
            :page-sizes="customizePageSize.length === 0 ? applicationStore.tablePaginationSize : customizePageSize"
          >
          </Pagination>
        </div>
        <div class="col-lg-4" v-if="showPageInfo">
          <p v-if="total > 0" align="right" style="padding: 5px 0;">{{ showTotal }}</p>
          <p v-else align="right" style="padding: 5px 0;">{{ $t('global.table.emptyText') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/common/components/pagination'
import fetch from 'common/utils/fetch'
import * as utils from 'common/utils'

export default {
  name: 'GeneralTable',
  components: {
    Pagination
  },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: false
    },
    tableColumns: {
      type: Array,
      default: []
    },
    showPagingTool: {
      type: Boolean,
      default: true
    },
    isShowIndex: {
      type: Boolean,
      default: true
    },
    isShowCheckBox: {
      type: Boolean,
      default: true
    },
    isSupportExpand: {
      type: Boolean,
      default: false
    },
    componentUrl: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '444'
    },
    isSummary: {
      type: Boolean,
      default: false
    },
    summaryFun: {
      type: Function
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    usagePost: {
      type: Boolean,
      default: false
    },
    isShowPageInfo: {
      type: Boolean,
      default: true
    },
    customizePageSize: {
      type: Array,
      default: function() {
        return []
      }
    },
    timeout: {
      type: [String, Number],
      default: 50000
    },
    tipText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      loadingText: this.tipText ? this.tipText : this.$t('global.table.loadingText'),
      fetchUrl: '',
      listQuery: {},
      selections: [],
      checkRow: false,
      addIndex: 1,
      list: [],
      total: 0,
      page: 1,
      limit: 20
    }
  },
  computed: {
    showTotal() {
      const tem = this.$t('global.table.showTotal')
      return utils.stringFormat(tem, this.addIndex, this.limit * this.page, this.total)
    },
    showIndex() {
      return this.isShowIndex
    },
    showCheckBox() {
      return this.isShowCheckBox
    },
    showPaging() {
      return this.showPagingTool
    },
    showPageInfo() {
      return this.isShowPageInfo
    },
    renderTemplate() {
      return function(url) {
        return () => import('@/' + url + '.vue')
      }
    },
    renderComponent() {
      if (this.isSupportExpand && this.componentUrl) {
        return () => import('@/' + this.componentUrl + '.vue')
      }
    },
    columnInit() {
      //列初始化
      if (this.tableColumns) {
        return this.tableColumns.map(item => {
          let column = {}
          column.title = item.titleFunc ? item.titleFunc() : item.title //列名
          column.key = item.key //表格对于字段
          column.fix = item.fixed //表格固定显示（left right）
          if (item.sortable) {
            //表格可筛选
            column.sortable = item.sortable
          } else {
            column.sortable = false
          }
          if (item.render) {
            //是否有重写函数
            column.render = item.render
          }
          if (item.minWidth) {
            //最小宽度
            column.minWidth = item.minWidth
          }
          if (item.width) {
            //设置宽度
            column.width = item.width
          }
          if (item.align) {
            //设置对齐属性
            column.align = item.align
          } else {
            column.align = 'left'
          }
          if (item.fixed) {
            //设置固定属性
            column.fixed = item.fixed
          }
          if (item.type) {
            //自定义类型
            column.type = item.type
          }
          if (item.groups) {
            //操作列是否有 按钮
            column.groups = item.groups
          }
          if (item.sortMethod) {
            //是否有排序方法
            column.sortMethod = item.sortMethod
          }
          if (item.templateUrl) {
            column.templateUrl = item.templateUrl
          }
          return column
        })
      }
    }
  },
  methods: {
    editable(row, column, cell, event) {
      if (this.isEdit) {
        let that = this
        that.$editable(event, function() {
          that.$emit('editCallback', row, column, cell)
        })
      }
    },
    clear() {
      if (this.showPaging) {
        this.page = 1
        this.listQuery.page = this.page
        this.listQuery.limit = this.limit
      }
      this.total = 0
      this.list = []
      if (this.page === 1) {
        this.addIndex = 1
      }
      this.loading = false
      this.selections = []
    },
    gridDataInit(url, query) {
      //查询初始化事件
      this.fetchUrl = url
      this.listQuery = { ...query }
      //没有分页的就不需要
      if (this.showPaging) {
        this.page = 1
        this.listQuery.page = this.page
        this.listQuery.limit = this.limit
      }
      return this.loadData()
    },
    loadData() {
      //数据加载方法
      if (this.fetchUrl && this.listQuery) {
        if (this.page > 10000) {
          this.loadingText = this.$t('global.table.loadingTextLargeData')
        } else {
          this.loadingText = this.tipText === undefined ? this.$t('global.table.loadingText') : this.tipText
        }
        this.loading = true
        this.$store.dispatch('setButtonStatus', { searchBtnDisabled: true, timeout: this.timeout })
        if (this.usagePost) {
          return fetch({
            url: this.fetchUrl,
            method: 'post',
            data: this.listQuery,
            timeout: this.timeout
          })
            .then(res => {
              this.handlerResult(res)
            })
            .catch(e => {
              this.loading = false
              this.$store.state.app.searchBtn.searchBtnDisabled = false
              console.error(e)
            })
        } else {
          return fetch({
            url: this.fetchUrl,
            method: 'get',
            params: this.listQuery,
            timeout: this.timeout
          })
            .then(res => {
              this.handlerResult(res)
            })
            .catch(e => {
              this.loading = false
              this.$store.state.app.searchBtn.searchBtnDisabled = false
              console.error(e)
            })
        }
      }
    },
    handlerResult(res) {
      if (res && res.result && !res.hasBusinessException) {
        //如果是分页的,就需要去读取后端返回的total,
        //若不分页那只需要list结果就行
        if (this.showPaging) {
          this.total = res.result.total
          this.list = res.result.list
        } else {
          this.list = res.result.list
        }
      } else {
        this.total = 0
        this.list = []
      }
      if (this.page === 1) {
        this.addIndex = 1
      }
      this.loading = false
      this.$store.state.app.searchBtn.searchBtnDisabled = false
      this.selections = []
      return { tableInstance: this.$data }
    },
    handlerCurrentPage(page) {
      //下一页,跳转页查询
      this.page = page
      console.log('page.........', page)
      this.listQuery.page = this.page
      this.listQuery.limit = this.limit
      this.addIndex = (this.page - 1) * this.limit + 1
      this.loadData()
    },
    handlerPageSize(limit) {
      //切换每页大小
      this.limit = limit
      this.listQuery.limit = this.limit
      this.listQuery.page = this.page
      this.loadData()
    },
    handleSelectionChange(rows) {
      //数据选中事件
      if (!this.checkRow) {
        this.selections = rows
      } else {
        if (rows.length === this.list.length) {
          this.selections = rows
        } else {
          if (Array.isArray(rows) && rows.length > 0) {
            rows.forEach((row, index) => {
              if (index === rows.length - 1) return
              // callback self
              this.$refs.currentGrid.toggleRowSelection(row, false)
              // console.log('ready set false')
            })
            this.selections = [rows[0]]
          } else {
            this.selections = []
          }
        }
      }
      this.$emit('selectChange', this.selections)
    },
    handleRowHandle(row) {
      this.$emit('on-dbclick', row)
    },
    handleCellClick(row) {
      this.$emit('cellClick', row)
    },
    rowChecked(row, column, event) {
      //阻止耦合触发
      if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'INPUT') {
        this.checkRow = false
        this.$refs.currentGrid.toggleRowSelection(row)
      } else if (
        event.target.lastChild &&
        event.target.lastChild.getAttribute &&
        event.target.lastChild.getAttribute('role') === 'checkbox'
      ) {
        this.checkRow = false
        this.$refs.currentGrid.toggleRowSelection(row)
      } else if (event.target.nodeName !== 'SPAN' && event.target.nodeName !== 'INPUT') {
        this.$refs.currentGrid.clearSelection()
        this.checkRow = true
        this.$refs.currentGrid.toggleRowSelection(row)
      }
      this.$emit('row-click', row)
    },
    summaryMethod(param) {
      //异步加载 先判断表格的值是否有了
      if (this.list) {
        const { columns, data } = param
        if (this.summaryFun) {
          return this.summaryFun(columns, data)
        } else {
          const sums = []
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = this.$t('global.table.summaryText')
              return
            }
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] += ''
            } else {
              sums[index] = ''
            }
          })
          return sums
        }
      }
    },
    //自动勾选指定的行
    autoCheckSpecifiedRow(row) {
      this.$refs.currentGrid.toggleRowSelection(row, true)
    },
    //列工具栏 对应点击事件
    rowButtonClick(id, row, index) {
      //子控件根据id 判断执行哪个方法
      this.$emit('feature-click', id, row, index)
    },
    getTableDate() {
      return this.list
    },
    /*
     * 表格存在按钮 根据方法返回值 判断是否显示按钮
     * 方法名 btnHideFun
     * */
    btnHide(row, fun) {
      if (fun) {
        return fun(row)
      }
      return true
    },
    clearSelection() {
      this.$refs.currentGrid.clearSelection()
    }
  }
}
</script>
